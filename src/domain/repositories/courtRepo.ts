import CourtEntity from "../entities/courtEntity";
import { QueryPagination } from "../../shared/utils/queryBuilder";

export interface CourtRepo {
    createCourt(courtData: CourtEntity): Promise<CourtEntity>;
    getCourts(query?: Record<string, any>): Promise<{ data: CourtEntity[]; pagination?: QueryPagination }>;
    getCourtById(id: string): Promise<CourtEntity | null>;
    deleteCourtById(id: string): Promise<CourtEntity | null>;
    countDocuments(): Promise<number>;
}