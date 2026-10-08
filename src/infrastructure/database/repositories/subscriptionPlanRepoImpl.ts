import SubscriptionPlanEntity from "../../../domain/entities/subscriptionPlanEntity";
import SubscriptionPlanRepo from "../../../domain/repositories/subscriptionPlanRepo";
import SubscriptionPlanModel from "../models/subscriptionPlanModel";
import { QueryBuilder, QueryPagination } from "../../../shared/utils/queryBuilder";

class SubscriptionPlanRepoImpl implements SubscriptionPlanRepo {
    async getSubscriptionPlans(query: Record<string, any> = {}): Promise<SubscriptionPlanEntity|null> {
        const queryBuilder = new QueryBuilder<SubscriptionPlanEntity>(SubscriptionPlanModel, query)
        const subscriptionPlans = await queryBuilder.mongooseQuery.lean<SubscriptionPlanEntity[]>();
        return subscriptionPlans?.length ?
         subscriptionPlans![0] : null;
    }


    getSubscriptionPlanById(id: string): Promise<SubscriptionPlanEntity | null> {
        return SubscriptionPlanModel.findById(id).lean<SubscriptionPlanEntity | null>();
    }

    createSubscriptionPlan(subscriptionPlanData: SubscriptionPlanEntity): Promise<SubscriptionPlanEntity> {
        return SubscriptionPlanModel.create(subscriptionPlanData);
    }

    updateSubscriptionPlan(id: string, subscriptionPlanData: Partial<SubscriptionPlanEntity>): Promise<SubscriptionPlanEntity | null> {
        return SubscriptionPlanModel.findByIdAndUpdate(
            id,
            { $set: subscriptionPlanData },
            { new: true, runValidators: true }
        ).lean<SubscriptionPlanEntity | null>();
    }

    deleteSubscriptionPlanById(id: string): Promise<SubscriptionPlanEntity | null> {
        return SubscriptionPlanModel.findByIdAndDelete(id).lean<SubscriptionPlanEntity | null>();
    }
}

export default new SubscriptionPlanRepoImpl();
