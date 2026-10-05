import AppConfigEntity from "../entities/appConfigEntity";
interface AppConfigRepository {
    getAppConfig(): Promise<AppConfigEntity | null> ;
    createAppConfig(appConfig: AppConfigEntity): Promise<AppConfigEntity>;
    updateAppConfig(appConfig: AppConfigEntity): Promise<AppConfigEntity | null>;
}
export default AppConfigRepository;