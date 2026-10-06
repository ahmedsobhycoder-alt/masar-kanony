import e from "express";
import { PolicySectionEntity,AppPolicyEntity } from "../../../domain/entities/appPolicyEntity";
import mongoose, {Schema} from "mongoose";
enum PolicyType {
    TERMS_AND_CONDITIONS = "termsAndConditions",
    PRIVACY_POLICY = "privacyPolicy",
}
const policyTypeValues = Object.values(PolicyType);

const policySectionSchema = new Schema<PolicySectionEntity>({
    order: {
        type: Number,
        required: [true, "Section order is required"],
    },
    sectionTitle: {
        type: String,
        required: [true, "Section title is required"],
        trim: true,
    },
    sectionContent: {
        type: String,
        required: [true, "Section content is required"],
        trim: true,
    }
    },
    { _id: false });

const appPolicySchema = new Schema<AppPolicyEntity>({
    type: {
        type: String,
        required: [true, "Policy type is required"],
        enum: Object.values(PolicyType),
        unique: [true, "Policy type must be unique"],
    },
    intro: {
        type: String,
        required: [true, "Policy intro is required"],
        trim: true,
    },
    sections: {
        type: [policySectionSchema],
        required: [true, "Policy sections are required"],
    },
    lastUpdate :{
        type: Date,
        default: Date.now,
    }
},{
    timestamps: true,
    versionKey: false,

});
const AppPolicyModel = mongoose.model<AppPolicyEntity>("AppPolicies", appPolicySchema);
export default AppPolicyModel;
export { policyTypeValues };