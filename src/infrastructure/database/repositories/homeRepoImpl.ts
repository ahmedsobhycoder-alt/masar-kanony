import HomeRepo from "../../../domain/repositories/homeRepo";
import HomeEntity from "../../../domain/entities/homeEntity";
import AdsModel from "../models/adsModel";
import CourtModel from "../models/courtModel";

class HomeRepoImpl implements HomeRepo {
  async getHomeData(): Promise<HomeEntity> {
    const [ads, courts] = await Promise.all([
      AdsModel.find(),
      CourtModel.find(),
    ]);

    return {
      ads: ads.map((ad) => ad.toJSON() as any),
      courts: courts.map((court) => court.toJSON() as any),
    };
  }
}

const homeRepoImpl = new HomeRepoImpl();
export default homeRepoImpl;
export { HomeRepoImpl };
