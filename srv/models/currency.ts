// entity Currencies : CodeList {
//   key code      : String(3) @(title : '{i18n>CurrencyCode}');
//       symbol    : String(5) @(title : '{i18n>CurrencySymbol}');
//       minorUnit : Int16     @(title : '{i18n>CurrencyMinorUnit}');
// }

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

    public get Code() {

        return this.props.Code;

    }

    public get Symbol() {

        return this.props.Symbol;

    }

    public get MinorUnit() {

        return this.props.MinorUnit;

    }

}