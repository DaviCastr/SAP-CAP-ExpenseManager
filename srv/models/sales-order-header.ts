// entity SalesOrderHeaders: managed {
//     key id : UUID;
//     customer: Association to Customers;
//     totalAmount: Decimal(15, 2);
//     items: Composition of many SalesOrderItems on items.header = $self;
// }

import { SalesOrderItemModel, SalesOrderItemPropsWithSnakeCaseProductId } from '@/models/sales-order-item';

type SalesOrderHeaderProps = {
    id: string;
    customerId: string;
    totalAmount: number;
    items: SalesOrderItemModel[];
};

type SalesOrderHeaderPropsCreate = Omit<SalesOrderHeaderProps, 'id' | 'totalAmount'>;

type SalesOrderHeaderPropsWithSnakeCaseCustomerId = Omit<SalesOrderHeaderProps, 'customerId' | 'items'> & {
    customer_id: SalesOrderHeaderProps['customerId'];
    items: SalesOrderItemPropsWithSnakeCaseProductId[];
};

type CreationPayload = {
    customer_id: SalesOrderHeaderProps['customerId'];
};

type CreationPayloadValidationResult = {
    hasError: boolean;
    error?: Error;
};

export class SalesOrderHeaderModel {
    constructor(private props: SalesOrderHeaderProps) {}

    public static create(props: SalesOrderHeaderPropsCreate): SalesOrderHeaderModel {
        return new SalesOrderHeaderModel({
            ...props,
            id: crypto.randomUUID(),
            totalAmount: 0
        });
    }

    public static with(props: SalesOrderHeaderProps): SalesOrderHeaderModel {
        return new SalesOrderHeaderModel(props);
    }

    public get id() {
        return this.props.id;
    }

    public get customerId() {
        return this.props.customerId;
    }

    public get totalAmount() {
        return this.props.totalAmount;
    }

    public set totalAmount(amount: number) {
        this.props.totalAmount = amount;
    }

    public get items() {
        return this.props.items;
    }

    public validateCreationPayload(params: CreationPayload): CreationPayloadValidationResult {
        const customerValidationResult = this.validateCustomerOnCreation(params.customer_id);

        if (customerValidationResult.hasError) {
            return customerValidationResult;
        }

        const itemsValidationResult = this.validateItemsOnCreation(this.items);
        if (itemsValidationResult.hasError) {
            return itemsValidationResult;
        }

        return {
            hasError: false
        };
    }

    private validateCustomerOnCreation(customerId: CreationPayload['customer_id']): CreationPayloadValidationResult {
        if (!customerId) {
            return {
                hasError: true,
                error: new Error('Customer Obrigatory')
            };
        }

        return {
            hasError: false
        };
    }

    private validateItemsOnCreation(items: SalesOrderHeaderProps['items']): CreationPayloadValidationResult {
        if (!items || items?.length === 0) {
            return {
                hasError: true,
                error: new Error('Invalid Items')
            };
        }

        const itemsErrors: string[] = [];

        items.forEach((item) => {
            const validationResult = item.validateCreationPayload({ product_id: item.productId });

            if (validationResult.hasError) {
                itemsErrors.push(validationResult.error?.message as string);
            }
        });

        if (itemsErrors.length > 0) {
            const messages = itemsErrors.join('\n -');
            return {
                hasError: true,
                error: new Error(messages)
            };
        }

        return {
            hasError: false
        };
    }

    public calculateTotalAmount(): number {
        let totalAmount = 0;

        this.items.forEach((item) => {
            totalAmount += (item.price as number) * (item.quantity as number);
        });

        return totalAmount;
    }

    public calculateDiscount(): number {
        let totalAmount = this.calculateTotalAmount();

        if (totalAmount > 30000) {
            const discont = totalAmount * (10 / 100);
            totalAmount -= discont;
        }

        return totalAmount;
    }

    public getProductsData(): { id: string; quantity: number }[] {
        return this.items.map((item) => ({
            id: item.productId as string,
            quantity: item.quantity as number
        }));
    }

    public toStringifyObject(): string {
        return JSON.stringify(this.props);
    }

    public toCreationObject(): SalesOrderHeaderPropsWithSnakeCaseCustomerId {
        return {
            id: this.props.id,
            customer_id: this.props.customerId,
            totalAmount: this.calculateDiscount(),
            items: this.props.items.map((item) => item.toCreationObject())
        };
    }
}
