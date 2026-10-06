import CityEntity from "../entities/cityEntity";
import CityRepo from "../repositories/cityRepo";
import { QueryPagination } from "../../shared/utils/queryBuilder";

export class CityUseCases {
  private readonly cityRepo: CityRepo;

  constructor({ cityRepo }: { cityRepo: CityRepo }) {
    this.cityRepo = cityRepo;
  }

  createCity = async (cityData: CityEntity): Promise<CityEntity> =>
    this.cityRepo.createCity(cityData);

  getCities = async (query: Record<string, any> = {}): Promise<{ data: CityEntity[]; pagination?: QueryPagination }> =>
    this.cityRepo.getCities(query as any);

  getCityById = async (id: string): Promise<CityEntity | null> =>
    this.cityRepo.getCityById(id);

  deleteCityById = async (id: string): Promise<CityEntity | null> =>
    this.cityRepo.deleteCityById(id);

  countDocuments = async (): Promise<number> => this.cityRepo.countDocuments();
}
