import AdsEntity from "./adsEntity";
import CourtEntity from "./courtEntity";

interface HomeEntity {
    ads: AdsEntity[];
    courts: CourtEntity[];
    mostSeenCourts : CourtEntity[]
}

export default HomeEntity;
export { HomeEntity };