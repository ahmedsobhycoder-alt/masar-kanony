import { CourtTypeEntity } from "../entities/courtTypeEntity";
import { QueryPagination } from "../../shared/utils/queryBuilder";

interface CourtTypeRepo {
  createCourtType(courtTypeData: CourtTypeEntity): Promise<CourtTypeEntity>;
  getCourtTypes(query?: Record<string, any>): Promise<{ data: CourtTypeEntity[]; pagination?: QueryPagination }>;
  getCourtTypeById(id: string): Promise<CourtTypeEntity | null>;
  deleteCourtTypeById(id: string): Promise<CourtTypeEntity | null>;
  countDocuments(): Promise<number>;
}

export default CourtTypeRepo;
