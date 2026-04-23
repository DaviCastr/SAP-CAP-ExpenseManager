import Decimal from "decimal.js";
import { BaseModel } from "./base";

export type LiabilityPaymentScheduleItem = {
    Installment: number;
    DueDate?: string;
    Amount: Decimal;
    Principal?: Decimal;
    Interest?: Decimal;
    BalanceAfter?: Decimal;
    Paid: boolean;
};

export type LiabilityPaymentScheduleItemReturn = {
    Installment: number;
    DueDate?: string;
    Amount: number;
    Principal?: number;
    Interest?: number;
    BalanceAfter?: number;
    Paid: boolean;
};

export type LiabilityPaymentScheduleProperties = {
    LiabilityId: string;
    Name: string;
    TotalInstallments: number;
    PaidInstallments: number;
    RemainingInstallments: number;
    Items: LiabilityPaymentScheduleItem[];
};

export type LiabilityPaymentScheduleReturnProperties = {
    LiabilityId: string;
    Name: string;
    TotalInstallments: number;
    PaidInstallments: number;
    RemainingInstallments: number;
    Items: LiabilityPaymentScheduleItemReturn[];
};

export class LiabilityPaymentScheduleModel
    extends BaseModel {

    constructor(
        private props:
            LiabilityPaymentScheduleProperties
    ) {
        super();
    }

    public static with(
        props:
            LiabilityPaymentScheduleProperties
    ): LiabilityPaymentScheduleModel {

        return new LiabilityPaymentScheduleModel(
            props
        );

    }

    public static singleModel(
        item:
            LiabilityPaymentScheduleReturnProperties
    ): LiabilityPaymentScheduleModel {

        return LiabilityPaymentScheduleModel.with({

            LiabilityId: item.LiabilityId,
            Name: item.Name,

            TotalInstallments:
                item.TotalInstallments,

            PaidInstallments:
                item.PaidInstallments,

            RemainingInstallments:
                item.RemainingInstallments,

            Items:
                item.Items?.map(schedule => ({
                    Installment:
                        schedule.Installment,

                    DueDate:
                        schedule.DueDate,

                    Amount:
                        this.retrieveDecimal(
                            schedule.Amount
                        ),

                    Principal:
                        this.retrieveDecimal(
                            schedule.Principal
                        ),

                    Interest:
                        this.retrieveDecimal(
                            schedule.Interest
                        ),

                    BalanceAfter:
                        this.retrieveDecimal(
                            schedule.BalanceAfter
                        ),

                    Paid:
                        schedule.Paid
                })) || []

        });

    }

    public toObject():
        LiabilityPaymentScheduleProperties {

        return this.props;

    }

    public toEntityObject():
        LiabilityPaymentScheduleReturnProperties {

        return this.cleanEntity({

            LiabilityId:
                this.props.LiabilityId,

            Name:
                this.props.Name,

            TotalInstallments:
                this.props.TotalInstallments,

            PaidInstallments:
                this.props.PaidInstallments,

            RemainingInstallments:
                this.props.RemainingInstallments,

            Items:
                this.props.Items?.map(item => ({

                    Installment:
                        item.Installment,

                    DueDate:
                        item.DueDate,

                    Amount:
                        item.Amount?.toNumber(),

                    Principal:
                        item.Principal?.toNumber(),

                    Interest:
                        item.Interest?.toNumber(),

                    BalanceAfter:
                        item.BalanceAfter?.toNumber(),

                    Paid:
                        item.Paid

                }))

        });

    }

}