import AdsRepo from "../../../domain/repositories/adsRepo";
import AdsEntity from "../../../domain/entities/adsEntity";
import AdsModel from "../models/adsModel";
import { QueryBuilder } from "../../../shared/utils/queryBuilder";
import listType from "../../../shared/constants/types";

class AdsRepoImpl implements AdsRepo {
  async countDocuments(): Promise<number> {
    return await AdsModel.find().clone().countDocuments();
  }

  async createAd(adData: AdsEntity): Promise<AdsEntity> {
    return await AdsModel.create(adData);
  }

  async getAds(query: Record<string, any> = {}): Promise<listType<AdsEntity>> {
    const queryBuilder = new QueryBuilder<AdsEntity>(AdsModel, query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    return await queryBuilder.execute();
  }

  async getAdById(id: string): Promise<AdsEntity | null> {
    const ad = await AdsModel.findById(id);
    return ad ? (ad.toJSON() as AdsEntity) : null;
  }

  async deleteAdById(id: string): Promise<AdsEntity | null> {
    const ad = await AdsModel.findByIdAndDelete(id);
    return ad ? (ad.toJSON() as AdsEntity) : null;
  }
}

const adsRepoImpl = new AdsRepoImpl();
export default adsRepoImpl;
export { AdsRepoImpl };
