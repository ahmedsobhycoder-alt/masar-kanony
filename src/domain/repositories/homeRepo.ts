import HomeEntity from "../entities/homeEntity";

interface HomeRepo {
  getHomeData(userId:string|null): Promise<HomeEntity>;
}

export default HomeRepo;
