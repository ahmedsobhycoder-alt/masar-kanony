import AdsEntity from "../entities/adsEntity";
import AdsRepo from "../repositories/adsRepo";
import listType from "../../shared/constants/types";

export class AdsUseCases {
  private readonly adsRepo: AdsRepo;

  constructor({ adsRepo }: { adsRepo: AdsRepo }) {
    this.adsRepo = adsRepo;
  }

  createAd = async (adData: AdsEntity): Promise<AdsEntity> =>
    this.adsRepo.createAd(adData);

  getAds = async (query: Record<string, any> = {}): Promise<listType<AdsEntity>> =>
    this.adsRepo.getAds(query);

  getAdById = async (id: string): Promise<AdsEntity | null> =>
    this.adsRepo.getAdById(id);

  deleteAdById = async (id: string): Promise<AdsEntity | null> =>
    this.adsRepo.deleteAdById(id);

  countDocuments = async (): Promise<number> => this.adsRepo.countDocuments();
}
