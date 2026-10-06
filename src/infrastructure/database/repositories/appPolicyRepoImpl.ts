import AppPolicyEntity from "../../../domain/entities/appPolicyEntity";
import AppPolicyRepo from "../../../domain/repositories/appPolicyRepo";
import AppPolicyModel from "../models/appPolicyModel";

class AppPolicyRepoImpl implements AppPolicyRepo {
    async createAppPolicy(appPolicy: AppPolicyEntity): Promise<AppPolicyEntity> {
        const newAppPolicy = await AppPolicyModel.create(appPolicy);
        return newAppPolicy;
    }
    async getAppPolicy(type?: string): Promise<AppPolicyEntity | null> {
        const appPolicy = await AppPolicyModel.findOne(type ? { type } : {});
        return appPolicy;
    }
    async updateAppPolicy(appPolicy: AppPolicyEntity): Promise<AppPolicyEntity> {
        const { type, ...updateData } = appPolicy;

        const updatedDoc = await AppPolicyModel.findOneAndUpdate(
            { type },
            {
                $set: {
                    ...updateData,
                    lastUpdate: new Date(), // Automatically refreshes update date
                },
            },
            {
                new: true,           // Returns the modified document rather than the original
                upsert: true,        // Creates the document if it doesn't exist
                runValidators: true, // Ensures schema validation rules run on update
                setDefaultsOnInsert: true, // Applies default schema values if created
            }
        ).lean();

        return this.mapToEntity(updatedDoc);
    }
    private mapToEntity(doc: any): AppPolicyEntity {
        const { _id, __v, ...rest } = doc;
        return {
            id: _id ? _id.toString() : rest.id,
            ...rest,
        } as AppPolicyEntity;
    }

}

export default new AppPolicyRepoImpl();