import  AppPolicyEntity  from "../entities/appPolicyEntity";
import AppPolicyRepo from "../repositories/appPolicyRepo";
class AppPolicyUseCases {
    private appPolicyRepo: AppPolicyRepo;
    constructor({ appPolicyRepo }: { appPolicyRepo: AppPolicyRepo }) {
        this.appPolicyRepo = appPolicyRepo;
    }
    getAppPolicy = async (type?: string): Promise<AppPolicyEntity | null> => this.appPolicyRepo.getAppPolicy(type)
    createAppPolicy = async (appPolicy: AppPolicyEntity): Promise<AppPolicyEntity> => this.appPolicyRepo.createAppPolicy(appPolicy)


    updateAppPolicy = async (appPolicy: AppPolicyEntity): Promise<AppPolicyEntity | null> => this.appPolicyRepo.updateAppPolicy( appPolicy)
}
export default AppPolicyUseCases;