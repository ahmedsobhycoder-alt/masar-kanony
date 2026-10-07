import OfficeEntity from "../entities/officeEntity";
import OfficeRepo from "../repositories/officeRepo";
import { QueryPagination } from "../../shared/utils/queryBuilder";

class OfficeUseCases {
    private readonly officeRepo: OfficeRepo;

    constructor({ officeRepo }: { officeRepo: OfficeRepo }) {
        this.officeRepo = officeRepo;
    }

    createOffice(officeData: OfficeEntity): Promise<OfficeEntity> {
        return this.officeRepo.createOffice(officeData);
    }

    getOffices(query: Record<string, any> = {}): Promise<{ data: OfficeEntity[]; pagination?: QueryPagination }> {
        return this.officeRepo.getOffices(query);
    }

    getOfficeById(id: string): Promise<OfficeEntity | null> {
        return this.officeRepo.getOfficeById(id);
    }

    deleteOfficeById(id: string): Promise<OfficeEntity | null> {
        return this.officeRepo.deleteOfficeById(id);
    }

}

export default OfficeUseCases