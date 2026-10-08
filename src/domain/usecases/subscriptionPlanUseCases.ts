import SubscriptionPlanEntity from "../entities/subscriptionPlanEntity";
import SubscriptionPlanRepo from "../repositories/subscriptionPlanRepo";
import { QueryPagination } from "../../shared/utils/queryBuilder";

class SubscriptionPlanUseCases {
    readonly subscriptionPlanRepo: SubscriptionPlanRepo;

    constructor({ subscriptionPlanRepo }: { subscriptionPlanRepo: SubscriptionPlanRepo }) {
        this.subscriptionPlanRepo = subscriptionPlanRepo;
    }

    getSubscriptionPlans = (query: Record<string, any> = {}): Promise<SubscriptionPlanEntity | null> =>
        this.subscriptionPlanRepo.getSubscriptionPlans(query);

    getSubscriptionPlanById = (id: string): Promise<SubscriptionPlanEntity | null> =>
        this.subscriptionPlanRepo.getSubscriptionPlanById(id);

    createSubscriptionPlan = (subscriptionPlanData: SubscriptionPlanEntity): Promise<SubscriptionPlanEntity> =>
        this.subscriptionPlanRepo.createSubscriptionPlan(subscriptionPlanData);

    updateSubscriptionPlan = (id: string, subscriptionPlanData: Partial<SubscriptionPlanEntity>): Promise<SubscriptionPlanEntity | null> =>
        this.subscriptionPlanRepo.updateSubscriptionPlan(id, subscriptionPlanData);

    deleteSubscriptionPlanById = (id: string): Promise<SubscriptionPlanEntity | null> =>
        this.subscriptionPlanRepo.deleteSubscriptionPlanById(id);
}

export default SubscriptionPlanUseCases;
