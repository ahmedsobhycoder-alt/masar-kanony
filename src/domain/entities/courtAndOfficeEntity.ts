import CourtEntity from "./courtEntity";
import OfficeEntity from "./officeEntity";

interface CourtAndOfficeEntity{
    isOffice: boolean,
    rawData: OfficeEntity|CourtEntity
    
}
export default CourtAndOfficeEntity;