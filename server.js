const cds = require('@sap/cds')
const express = require('express')

const ALLOWED_ORIGINS = {
  'https://davicastr.github.io': 1
}

function getXsuaaCredentials() {
  try {
    const vcap = JSON.parse(process.env.VCAP_SERVICES || '{}')
    const xsuaa = (vcap.xsuaa || [])[0]
    if (xsuaa && xsuaa.credentials && xsuaa.credentials.url && xsuaa.credentials.clientid && xsuaa.credentials.clientsecret) {
      return xsuaa.credentials
    }
  } catch (error) {
    /* ignore */
  }

  const auth = cds.env.requires && cds.env.requires.auth
  const credentials = auth && auth.credentials
  if (credentials && credentials.url && credentials.clientid && credentials.clientsecret) {
    return credentials
  }

  throw new Error('XSUAA credentials are not available')
}

async function callXsuaaTokenEndpoint(payload) {
  const { url, clientid, clientsecret } = getXsuaaCredentials()
  const params = new URLSearchParams({
    ...payload,
    client_id: clientid,
    client_secret: clientsecret
  })

  const response = await fetch(`${url}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
    signal: AbortSignal.timeout(15000)
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`XSUAA token endpoint returned ${response.status}: ${text}`)
  }

  return response.json()
}

cds.on('bootstrap', (app) => {
  app.use((req, res, next) => {
    const origin = req.headers.origin
    if (origin && ALLOWED_ORIGINS[origin]) {
      res.set('Access-Control-Allow-Origin', origin)
      res.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS')
      res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-csrf-token, Prefer, If-Match, If-None-Match, sap-context-token, sap-cancel-on-close, sap-correlationid, mime-version, odata-version, odata-maxversion')
      res.set('Access-Control-Expose-Headers', 'x-csrf-token')
      res.set('Vary', 'Origin')
      if (req.method === 'OPTIONS') {
        return res.status(204).end()
      }
    }
    next()
  })

  app.post('/auth/login', express.json(), async (req, res) => {
    const { code, redirect_uri } = req.body || {}

    if (!code) {
      return res.status(400).json({
        error: 'missing_code',
        error_description: 'Parameter "code" is required'
      })
    }

    try {
      const data = await callXsuaaTokenEndpoint({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirect_uri || ''
      })
      res.json(data)
    } catch (error) {
      const detail = error.response && error.response.data ? error.response.data : error.message
      cds.log('auth').error('XSUAA token exchange failed', detail)
      res.status(502).json({
        error: 'token_exchange_failed',
        error_description: typeof detail === 'string' ? detail : JSON.stringify(detail)
      })
    }
  })

  app.post('/auth/refresh', express.json(), async (req, res) => {
    const { refresh_token } = req.body || {}

    if (!refresh_token) {
      return res.status(400).json({
        error: 'missing_refresh_token',
        error_description: 'Parameter "refresh_token" is required'
      })
    }

    try {
      const data = await callXsuaaTokenEndpoint({
        grant_type: 'refresh_token',
        refresh_token
      })
      res.json(data)
    } catch (error) {
      const detail = error.response && error.response.data ? error.response.data : error.message
      cds.log('auth').error('XSUAA token refresh failed', detail)
      res.status(502).json({
        error: 'token_refresh_failed',
        error_description: typeof detail === 'string' ? detail : JSON.stringify(detail)
      })
    }
  })
})

module.exports = cds.server
