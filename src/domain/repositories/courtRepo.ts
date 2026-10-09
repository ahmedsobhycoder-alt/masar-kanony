import CourtEntity from "../entities/courtEntity";
import { QueryPagination } from "../../shared/utils/queryBuilder";
import listType from "../../shared/constants/types";

export interface CourtRepo {
    createCourt(courtData: CourtEntity): Promise<CourtEntity>;
    getCourts(userId: string,query?: Record<string, any>): Promise<{ data: CourtEntity[]; pagination?: QueryPagination }>;
    getCourtById(id: string): Promise<CourtEntity | null>;
    deleteCourtById(id: string): Promise<CourtEntity | null>;
    getMostSeenCourts( query : Record<string, any>): Promise<CourtEntity[]>
    addToSaved(court: CourtEntity,userId:string) : Promise<CourtEntity|null>
    removeFromSaved(court: CourtEntity,userId:string):Promise<CourtEntity|null>
    getSavedCourts(query : Record<string, any>,userId:string):Promise<listType<CourtEntity>>


}