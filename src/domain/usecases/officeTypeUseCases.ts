import { OfficeTypeEntity } from "../entities/officeTypeEntity";
import OfficeTypeRepo from "../repositories/officeTypeRepo";
import { QueryPagination } from "../../shared/utils/queryBuilder";

export class OfficeTypeUseCases {
  private readonly officeTypeRepo: OfficeTypeRepo;

  constructor({ officeTypeRepo }: { officeTypeRepo: OfficeTypeRepo }) {
    this.officeTypeRepo = officeTypeRepo;
  }

  createOfficeType = async (officeTypeData: OfficeTypeEntity): Promise<OfficeTypeEntity> =>
    this.officeTypeRepo.createOfficeType(officeTypeData);

  getOfficeTypes = async (query: Record<string, any> = {}): Promise<{ data: OfficeTypeEntity[]; pagination?: QueryPagination }> =>
    this.officeTypeRepo.getOfficeTypes(query);

  getOfficeTypeById = async (id: string): Promise<OfficeTypeEntity | null> =>
    this.officeTypeRepo.getOfficeTypeById(id);

  deleteOfficeTypeById = async (id: string): Promise<OfficeTypeEntity | null> =>
    this.officeTypeRepo.deleteOfficeTypeById(id);

}
