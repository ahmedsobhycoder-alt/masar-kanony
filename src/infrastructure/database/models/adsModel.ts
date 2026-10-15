import mongoose, { Schema } from "mongoose";
import AdsEntity from "../../../domain/entities/adsEntity";
import { printGreen } from "src/shared/utils/printColors";

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
}, { timestamps: true, versionKey: false });
adsSchema.post("init", function (doc) {
    printGreen("image", doc.image);
  formatImageUrl(doc);
})
adsSchema.post("save", function (doc) {
  formatImageUrl(doc);
});

const formatImageUrl = (doc: AdsEntity) => {
  printGreen("image", doc.image);
  if (process.env.NODE_ENV === "production") {
    doc.image = `${process.env.BASE_URL}/uploads/ads/${doc.image}`;
  } else {
    doc.image = `${process.env.BASE_URL}:${process.env.PORT}/uploads/ads/${doc.image}`;
  }
  printGreen("image", doc.image);

}
const AdsModel = mongoose.model<AdsEntity>("Ads", adsSchema);

export default AdsModel;
