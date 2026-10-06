import mongoose from "mongoose";

interface CityEntity {
  id?: number;
  name: string;
  governorate: mongoose.Schema.Types.ObjectId | string;
}

export default CityEntity;
export { CityEntity };