import SubscriptionPlanEntity from "../entities/subscriptionPlanEntity";
import { QueryPagination } from "../../shared/utils/queryBuilder";

interface SubscriptionPlanRepo {
    getSubscriptionPlans(query?: Record<string, any>): Promise<SubscriptionPlanEntity|null>;
    getSubscriptionPlanById(id: string): Promise<SubscriptionPlanEntity | null>;
    createSubscriptionPlan(subscriptionPlanData: SubscriptionPlanEntity): Promise<SubscriptionPlanEntity>;
    updateSubscriptionPlan(id: string, subscriptionPlanData: Partial<SubscriptionPlanEntity>): Promise<SubscriptionPlanEntity | null>;
    deleteSubscriptionPlanById(id: string): Promise<SubscriptionPlanEntity | null>;
}

export default SubscriptionPlanRepo;
