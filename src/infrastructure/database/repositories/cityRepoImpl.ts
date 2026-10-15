import CityRepo from "../../../domain/repositories/cityRepo";
import CityEntity from "../../../domain/entities/cityEntity";
import CityModel from "../models/cityModel";
import { QueryBuilder } from "../../../shared/utils/queryBuilder";
import listType from "../../../shared/constants/types";
import { ParsedQs } from "qs";
import BaseRepository from "./baseRepository";

class CityRepoImpl extends BaseRepository<CityEntity> implements CityRepo {
  constructor() {
    super(CityModel);
  }


  async createCity(cityData: CityEntity): Promise<CityEntity> {
    return await CityModel.create(cityData);
  }

async getCities(query: ParsedQs): Promise<listType<CityEntity>> {
  return await new QueryBuilder<CityEntity>(CityModel, query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .execute();
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
