import { CourtTypeEntity } from "../entities/courtTypeEntity";
import listType from "../../shared/constants/types";

interface CourtTypeRepo {
  createCourtType(courtTypeData: CourtTypeEntity): Promise<CourtTypeEntity>;
  getCourtTypes(query?: Record<string, any>): Promise<listType<CourtTypeEntity>>;
  getCourtTypeById(id: string): Promise<CourtTypeEntity | null>;
  deleteCourtTypeById(id: string): Promise<CourtTypeEntity | null>;
  countDocuments(): Promise<number>;
}

export default CourtTypeRepo;
