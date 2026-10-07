interface SubscriptionPlanEntity {
    id: string;
    title: string;
    subtitle: string;
    price: number;
    currency: string;
    currencySymbol: string;
    billingPeriod: string;
    billingLabel: string;
    features: string[];
    isPopular: boolean;
    createdAt: Date,
    updatedAt: Date;

}
export default SubscriptionPlanEntity;