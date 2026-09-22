import HomeEntity from "../entities/homeEntity";

interface HomeRepo {
  getHomeData(): Promise<HomeEntity>;
}

export default HomeRepo;
