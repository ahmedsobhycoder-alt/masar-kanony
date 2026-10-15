import AdsEntity from "../entities/adsEntity";
import listType from "../../shared/constants/types";

interface AdsRepo {
  createAd(adData: AdsEntity): Promise<AdsEntity>;
  getAds(query?: Record<string, any>): Promise<listType<AdsEntity>>;
  getAdById(id: string): Promise<AdsEntity | null>;
  deleteAdById(id: string): Promise<AdsEntity | null>;
  countDocuments(): Promise<number>;
}

export default AdsRepo;
