import CourtEntity from "../entities/courtEntity";
import { QueryPagination } from "../../shared/utils/queryBuilder";
import listType from "../../shared/constants/types";

export interface CourtRepo {
    createCourt(courtData: CourtEntity): Promise<CourtEntity>;
    getCourts(queryies?: Record<string, any>): Promise<listType<CourtEntity>>;
    getCourtById(id: string, userId?: string): Promise<CourtEntity | null>;
    updateCourtById(id: string, courtData: Partial<CourtEntity>): Promise<CourtEntity | null>;
    deleteCourtById(id: string): Promise<CourtEntity | null>;
    getMostSeenCourts(queries?: Record<string, any>): Promise<listType<CourtEntity>>
    addToSaved(court: CourtEntity,userId:string) : Promise<CourtEntity|null>
    removeFromSaved(court: CourtEntity,userId:string):Promise<CourtEntity|null>
    getSavedCourts(queryies: Record<string, any>): Promise<listType<CourtEntity>>


}