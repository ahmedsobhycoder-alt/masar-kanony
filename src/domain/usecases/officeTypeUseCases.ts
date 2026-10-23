import { OfficeTypeEntity } from "../entities/officeTypeEntity";
import OfficeTypeRepo from "../repositories/officeTypeRepo";
import listType from "../../shared/constants/types";

export class OfficeTypeUseCases {
  private readonly officeTypeRepo: OfficeTypeRepo;

  constructor({ officeTypeRepo }: { officeTypeRepo: OfficeTypeRepo }) {
    this.officeTypeRepo = officeTypeRepo;
  }

  createOfficeType = async (officeTypeData: Omit<OfficeTypeEntity, "id" | "_id">): Promise<OfficeTypeEntity> =>
    this.officeTypeRepo.createOfficeType(officeTypeData);

  getOfficeTypes = async (query: Record<string, any> = {}): Promise<listType<OfficeTypeEntity>> =>
    this.officeTypeRepo.getOfficeTypes(query);

  getOfficeTypeById = async (id: string): Promise<OfficeTypeEntity | null> =>
    this.officeTypeRepo.getOfficeTypeById(id);

  updateOfficeTypeById = (id: string, data: Partial<OfficeTypeEntity>) =>
    this.officeTypeRepo.updateOfficeTypeById(id, data);

  deleteOfficeTypeById = async (id: string): Promise<OfficeTypeEntity | null> =>
    this.officeTypeRepo.deleteOfficeTypeById(id);

}
