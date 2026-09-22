import AdsRepo from "../../../domain/repositories/adsRepo";
import AdsEntity from "../../../domain/entities/adsEntity";
import AdsModel from "../models/adsModel";
import { QueryBuilder, QueryPagination } from "../../../shared/utils/queryBuilder";

class AdsRepoImpl implements AdsRepo {
  async countDocuments(): Promise<number> {
    return await AdsModel.find().clone().countDocuments();
  }

  async createAd(adData: AdsEntity): Promise<AdsEntity> {
    return await AdsModel.create(adData);
  }

  async getAds(query: Record<string, any> = {}): Promise<{ data: AdsEntity[]; pagination?: QueryPagination }> {
    const totalDocuments = await this.countDocuments();
    const queryBuilder = new QueryBuilder<AdsEntity>(AdsModel.find(), query)
      .filter()
      .search(undefined, ["title", "description"])
      .paginate(totalDocuments)
      .sort()
      .limitFields();

    const ads = await queryBuilder.mongooseQuery;

    return {
      data: ads.map((ad) => {
        if (ad && typeof (ad as any).toJSON === "function") {
          return (ad as any).toJSON() as AdsEntity;
        }
        return ad as AdsEntity;
      }),
      pagination: queryBuilder.pagination,
    };
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
