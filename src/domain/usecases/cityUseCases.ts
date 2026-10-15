import CityEntity from "../entities/cityEntity";
import CityRepo from "../repositories/cityRepo";
import listType from "../../shared/constants/types";

export class CityUseCases {
  private readonly cityRepo: CityRepo;

  constructor({ cityRepo }: { cityRepo: CityRepo }) {
    this.cityRepo = cityRepo;
  }

  createCity = async (cityData: CityEntity): Promise<CityEntity> =>
    this.cityRepo.createCity(cityData);

  getCities = async (query: Record<string, any> = {}): Promise<listType<CityEntity>> =>
    this.cityRepo.getCities(query as any);

  getCityById = async (id: string): Promise<CityEntity | null> =>
    this.cityRepo.getCityById(id);

  deleteCityById = async (id: string): Promise<CityEntity | null> =>
    this.cityRepo.deleteCityById(id);

}
