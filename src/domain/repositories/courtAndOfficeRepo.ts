import listType from "../../shared/constants/types";
import CourtAndOfficeEntity from "../entities/courtAndOfficeEntity";

interface CourtAndOfficeRepo {
    getCourtsAndOffices(query:Record<string,any>): Promise<listType<CourtAndOfficeEntity>>
}
export default CourtAndOfficeRepo;
