import CityRepo from "../../../domain/repositories/cityRepo";
import CityEntity from "../../../domain/entities/cityEntity";
import CityModel from "../models/cityModel";
import { QueryBuilder, QueryPagination } from "../../../shared/utils/queryBuilder";
import { ParsedQs } from "qs";
import BaseRepository from "./baseRepository";

class CityRepoImpl extends BaseRepository<CityEntity> implements CityRepo {
  constructor() {
    super(CityModel);
  }

  async countDocuments(): Promise<number> {
    return await CityModel.find().clone().countDocuments();
  }

  async createCity(cityData: CityEntity): Promise<CityEntity> {
    return await CityModel.create(cityData);
  }

  async getCities(query: ParsedQs): Promise<{ data: CityEntity[]; pagination?: QueryPagination }> {
    const totalDocuments = await this.countDocuments();
    const queryBuilder = new QueryBuilder<CityEntity>(CityModel.find().populate("governorate"), query)
      .filter()
      .search(undefined, ["name"])
      .paginate(totalDocuments)
      .sort()
      .limitFields();

    const cities = await queryBuilder.mongooseQuery.lean();

    return {
      data: cities as CityEntity[],
      pagination: queryBuilder.pagination,
    };
  }

  async getCityById(id: string): Promise<CityEntity | null> {
    const city = await CityModel.findById(id).populate("governorate").lean();
    return city ? (city as CityEntity) : null;
  }

  async deleteCityById(id: string): Promise<CityEntity | null> {
    const city = await CityModel.findByIdAndDelete(id);
    return city ? (city.toJSON() as CityEntity) : null;
  }
}

const cityRepoImpl = new CityRepoImpl();
export default cityRepoImpl;
export { CityRepoImpl };
