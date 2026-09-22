import HomeEntity from "../entities/homeEntity";
import HomeRepo from "../repositories/homeRepo";

export class HomeUseCases {
  private readonly homeRepo: HomeRepo;

  constructor({ homeRepo }: { homeRepo: HomeRepo }) {
    this.homeRepo = homeRepo;
  }

  getHomeData = async (): Promise<HomeEntity> => this.homeRepo.getHomeData();
}
