import CityEntity from "../entities/cityEntity";
import { ParsedQs } from "qs";
import { QueryPagination } from "../../shared/utils/queryBuilder";

interface CityRepo {
  createCity(cityData: CityEntity): Promise<CityEntity>;
  getCities(query: ParsedQs): Promise<{ data: CityEntity[]; pagination?: QueryPagination }>;
  getCityById(id: string): Promise<CityEntity | null>;
  deleteCityById(id: string): Promise<CityEntity | null>;
  countDocuments(): Promise<number>;
}

export default CityRepo;
