import { CourtRepo } from "../repositories/courtRepo";
import CourtEntity from "../entities/courtEntity";
import { QueryPagination } from "../../shared/utils/queryBuilder";
import listType from "../../shared/constants/types";

export class CourtUseCases {
    private readonly courtRepo: CourtRepo;

    constructor({ courtRepo }: { courtRepo: CourtRepo }) {
        this.courtRepo = courtRepo;
    }

    async createCourt(courtData: CourtEntity): Promise<CourtEntity> {
        return await this.courtRepo.createCourt(courtData);
    }

    async getAllCourts(userId: string , query: Record<string, any> = {},  otherQueries: Record<string, any>={}): Promise<listType<CourtEntity>> {
        return await this.courtRepo.getCourts(userId,query,otherQueries);
    }

    async getCourtById(id: string, userId?: string): Promise<CourtEntity | null> {
        return await this.courtRepo.getCourtById(id, userId);
    }
    async getMostSeenCourts(
        userId: string,
        query: Record<string, any> = {},
        otherQueries: Record<string, any> = {}
    ): Promise<listType<CourtEntity>> {
        return await this.courtRepo.getMostSeenCourts(userId, query, otherQueries);
    }
    addToSaved=(court: CourtEntity,
        userId:string) : Promise<CourtEntity|null> => this.courtRepo.addToSaved(court,userId)
    removeFromSaved=(court: CourtEntity,userId:string):Promise<CourtEntity|null>=> this.courtRepo.removeFromSaved(court,userId)
    getSavedCourts = (
        query: Record<string, any>,
        userId: string,
        otherQueries: Record<string, any> = {}
    ): Promise<listType<CourtEntity>> => this.courtRepo.getSavedCourts(query, userId, otherQueries);


}