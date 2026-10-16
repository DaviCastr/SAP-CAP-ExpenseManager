export class RateLimiter {

    private readonly hits = new Map<string, number[]>();

    constructor(
        private readonly maxHits: number,
        private readonly windowInMinutes: number
    ) { }


    public tryConsume(key: string): boolean {

        const now = Date.now();
        const windowStart = now - this.windowInMinutes * 60 * 1000;
        const recentHits = (this.hits.get(key) || []).filter((hit) => hit > windowStart);

        if (recentHits.length >= this.maxHits) {

            this.hits.set(key, recentHits);

            return false;

        }

        recentHits.push(now);

        this.hits.set(key, recentHits);

        return true;

    }

}
