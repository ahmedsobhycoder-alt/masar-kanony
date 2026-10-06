        import AppConfigEntity from "../entities/appConfigEntity";
import AppConfigRepository from "../repositories/appConfigRepo";
class AppConfigUseCases {
    private readonly appConfigRepository: AppConfigRepository;
    constructor({ appConfigRepository }: {
        appConfigRepository: AppConfigRepository;
    }) {
        this.appConfigRepository = appConfigRepository;
    }
    getAppConfig = (): Promise<AppConfigEntity | null> => this.appConfigRepository.getAppConfig();
    createAppConfig = (appConfig: AppConfigEntity): Promise<AppConfigEntity> => this.appConfigRepository.createAppConfig(appConfig);
    updateAppConfig = (appConfig: AppConfigEntity): Promise<AppConfigEntity | null> => this.appConfigRepository.updateAppConfig(appConfig);
}
export default AppConfigUseCases;