import AdsEntity from "../entities/adsEntity";
import { QueryPagination } from "../../shared/utils/queryBuilder";

interface AdsRepo {
  createAd(adData: AdsEntity): Promise<AdsEntity>;
  getAds(query?: Record<string, any>): Promise<{ data: AdsEntity[]; pagination?: QueryPagination }>;
  getAdById(id: string): Promise<AdsEntity | null>;
  deleteAdById(id: string): Promise<AdsEntity | null>;
  countDocuments(): Promise<number>;
}

export default AdsRepo;
