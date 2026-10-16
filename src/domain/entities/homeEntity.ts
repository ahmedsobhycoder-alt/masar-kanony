import AdsEntity from "./adsEntity";
import CourtEntity from "./courtEntity";
import PaymentEntity from "./paymentEntity";

interface HomeEntity {
    ads?: AdsEntity[];
    courts?: CourtEntity[];
    mostSeenCourts? : CourtEntity[],
    payment : PaymentEntity|null
}

export default HomeEntity;
export { HomeEntity };