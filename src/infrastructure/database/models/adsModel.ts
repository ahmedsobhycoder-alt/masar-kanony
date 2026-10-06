import mongoose, { Schema } from "mongoose";
import AdsEntity from "../../../domain/entities/adsEntity";

const adsSchema = new Schema<AdsEntity>({
  title: {
    type: String,
    required: [true, "Ad title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Ad description is required"],
    trim: true,
  },
  image: {
    type: String,
    required: [true, "Ad image is required"],
  },
  link: {
    type: String,
    required: [true, "Ad link is required"],
  },
},{ timestamps: true , versionKey: false });
adsSchema.post("init", function (doc) {
  formatImageUrl(doc);
})
adsSchema.post("save", function (doc) {
  formatImageUrl(doc);
});
const formatImageUrl = (doc: AdsEntity) => {
    if (doc.image) {
        doc.image = `${process.env.BASE_URL}/ads/${doc.image}`;

    }

}
const AdsModel = mongoose.model<AdsEntity>("Ads", adsSchema);

export default AdsModel;
