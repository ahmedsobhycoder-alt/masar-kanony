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


  async createCity(cityData: CityEntity): Promise<CityEntity> {
    return await CityModel.create(cityData);
  }

async getCities(query: ParsedQs): Promise<{ data: CityEntity[]; pagination?: QueryPagination }> {
  const queryBuilder = new QueryBuilder<CityEntity>(CityModel, query)
    .filter()
    .sort()
    .limitFields();

  // Clone to count documents matching the filtered criteria
  const totalDocuments = await queryBuilder.mongooseQuery.clone().countDocuments();

  // Apply skip & limit pagination logic
  queryBuilder.paginate(totalDocuments);

  // Execute query with lean for read performance
  const cities = await queryBuilder.mongooseQuery.lean<CityEntity[]>();

  return {
    data: cities || [],
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
