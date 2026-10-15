import OfficeEntity from "../entities/officeEntity";
import OfficeRepo from "../repositories/officeRepo";
import listType from "../../shared/constants/types";

class OfficeUseCases {
    private readonly officeRepo: OfficeRepo;

    constructor({ officeRepo }: { officeRepo: OfficeRepo }) {
        this.officeRepo = officeRepo;
    }

    createOffice(officeData: OfficeEntity): Promise<OfficeEntity> {
        return this.officeRepo.createOffice(officeData);
    }

    getOffices(query: Record<string, any> = {}): Promise<listType<OfficeEntity>> {
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