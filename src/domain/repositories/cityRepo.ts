import CityEntity from "../entities/cityEntity";
import { ParsedQs } from "qs";
import listType from "../../shared/constants/types";

interface CityRepo {
  createCity(cityData: CityEntity): Promise<CityEntity>;
  getCities(query: ParsedQs): Promise<listType<CityEntity>>;
  getCityById(id: string): Promise<CityEntity | null>;
  deleteCityById(id: string): Promise<CityEntity | null>;
}

export default CityRepo;
