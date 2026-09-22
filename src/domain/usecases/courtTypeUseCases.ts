import { CourtTypeEntity } from "../entities/courtTypeEntity";
import CourtTypeRepo from "../repositories/courtTypeRepo";
import { QueryPagination } from "../../shared/utils/queryBuilder";

export class CourtTypeUseCases {
  private readonly courtTypeRepo: CourtTypeRepo;

  constructor({ courtTypeRepo }: { courtTypeRepo: CourtTypeRepo }) {
    this.courtTypeRepo = courtTypeRepo;
  }

  createCourtType = async (courtTypeData: CourtTypeEntity): Promise<CourtTypeEntity> =>
    this.courtTypeRepo.createCourtType(courtTypeData);

  getCourtTypes = async (query: Record<string, any> = {}): Promise<{ data: CourtTypeEntity[]; pagination?: QueryPagination }> =>
    this.courtTypeRepo.getCourtTypes(query);

  getCourtTypeById = async (id: string): Promise<CourtTypeEntity | null> =>
    this.courtTypeRepo.getCourtTypeById(id);

  deleteCourtTypeById = async (id: string): Promise<CourtTypeEntity | null> =>
    this.courtTypeRepo.deleteCourtTypeById(id);

  countDocuments = async (): Promise<number> => this.courtTypeRepo.countDocuments();
}
