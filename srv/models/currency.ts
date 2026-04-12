// entity Currencies : CodeList {
//   key code      : String(3) @(title : '{i18n>CurrencyCode}');
//       symbol    : String(5) @(title : '{i18n>CurrencySymbol}');
//       minorUnit : Int16     @(title : '{i18n>CurrencyMinorUnit}');
// }

import { Currency } from "@models/sap/common";

export type CurrencyProperties = {
    Code: string;
    Name: string;
    Description: string;
    Symbol: string;
    MinorUnit: number;
}

export class CurrencyModel {

    constructor(private props: CurrencyProperties) { }

    public static with(properties: CurrencyProperties): CurrencyModel {

        return new CurrencyModel(properties);

    }

    public static singleModel(properties: Currency): CurrencyModel {

        return CurrencyModel.with({
            Code: properties?.code as string,
            Name: properties?.name || '' as string,
            Description: properties?.descr as string,
            Symbol: properties?.symbol as string,
            MinorUnit: properties?.minorUnit as number
        });

    }

    public get Code() {

        return this.props.Code;

    }

    public get Symbol() {

        return this.props.Symbol;

    }

    public get MinorUnit() {

        return this.props.MinorUnit;

    }

    public toEntityObject(): Currency {

        return {
            code: this.props.Code,
            //name: this.props.Name,
            //descr: this.props.Description,
            //minorUnit: this.props.MinorUnit,
            //symbol: this.props.Symbol
        }

    }

}