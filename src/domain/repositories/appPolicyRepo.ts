import { AppPolicyEntity  } from "../entities/appPolicyEntity";
interface AppPolicyRepo{
    createAppPolicy(appPolicy: AppPolicyEntity): Promise<AppPolicyEntity>;
    getAppPolicy(type?: string): Promise<AppPolicyEntity | null>;
    updateAppPolicy(appPolicy: AppPolicyEntity): Promise<AppPolicyEntity | null>;
}
export default AppPolicyRepo;