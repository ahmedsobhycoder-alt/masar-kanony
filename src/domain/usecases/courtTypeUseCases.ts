import { CourtTypeEntity } from "../entities/courtTypeEntity";
import CourtTypeRepo from "../repositories/courtTypeRepo";
import listType from "../../shared/constants/types";

export class CourtTypeUseCases {
  private readonly courtTypeRepo: CourtTypeRepo;

  constructor({ courtTypeRepo }: { courtTypeRepo: CourtTypeRepo }) {
    this.courtTypeRepo = courtTypeRepo;
  }

  createCourtType = async (courtTypeData: CourtTypeEntity): Promise<CourtTypeEntity> =>
    this.courtTypeRepo.createCourtType(courtTypeData);

  getCourtTypes = async (query: Record<string, any> = {}): Promise<listType<CourtTypeEntity>> =>
    this.courtTypeRepo.getCourtTypes(query);

  getCourtTypeById = async (id: string): Promise<CourtTypeEntity | null> =>
    this.courtTypeRepo.getCourtTypeById(id);

  updateCourtTypeById = async (id: string, data: Partial<CourtTypeEntity>): Promise<CourtTypeEntity | null> =>
    this.courtTypeRepo.updateCourtTypeById(id, data);

  deleteCourtTypeById = async (id: string): Promise<CourtTypeEntity | null> =>
    this.courtTypeRepo.deleteCourtTypeById(id);

  countDocuments = async (): Promise<number> => this.courtTypeRepo.countDocuments();
}
