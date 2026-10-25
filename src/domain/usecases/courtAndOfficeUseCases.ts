import listType from "src/shared/constants/types";
import CourtAndOfficeRepo from "../repositories/courtAndOfficeRepo";
import CourtAndOfficeEntity from "../entities/courtAndOfficeEntity";

class CourtAndOfficeUseCases {
    readonly courtAndOfficeRepo: CourtAndOfficeRepo;
    constructor({ courtAndOfficeRepo }: { courtAndOfficeRepo: CourtAndOfficeRepo }) {
        this.courtAndOfficeRepo = courtAndOfficeRepo;
    }
    getCourtsAndOffices = async (query: Record<string, any>): Promise<listType<CourtAndOfficeEntity>> => this.courtAndOfficeRepo.getCourtsAndOffices(query);
}
export default CourtAndOfficeUseCases;