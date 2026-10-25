import CourtAndOfficeEntity from "src/domain/entities/courtAndOfficeEntity";
import CourtAndOfficeRepo from "src/domain/repositories/courtAndOfficeRepo";
import listType, { QueryPagination } from "src/shared/constants/types";
import CourtModel from "../models/courtModel";
import {
    buildBilingualFuzzyRegex,
    fromStringToList,
} from "src/shared/utils/helpers";
import { AggregateBuilder } from "src/shared/utils/aggregationBuilder";
import { printGreen } from "src/shared/utils/printColors";

class CourtAndOfficeRepoImpl implements CourtAndOfficeRepo {
    async getCourtsAndOffices(
        query: Record<string, any>
    ): Promise<listType<CourtAndOfficeEntity>> {


        const name = typeof query.name === "string" ? query.name.trim() : "";
        const governorates: string[] = Array.isArray(query.governorate)
            ? query.governorate
            : fromStringToList(query.governorate);
        const courtTypes: string[] = Array.isArray(query.courtType)
            ? query.courtType
            : fromStringToList(query.courtType);

        // 1. Shared direct filters
        const baseMatch: Record<string, any> = {};
        if (governorates.length > 0) baseMatch.governorate = { $in: governorates };
        if (courtTypes.length > 0) baseMatch.courtType = { $in: courtTypes };

        // 2. Court-specific search
        const courtMatch: Record<string, any> = { ...baseMatch };
        if (name) {
            const pattern = new RegExp(buildBilingualFuzzyRegex(name), "i");
            courtMatch.$or = [
                { name: pattern },
                { governorate: pattern },
                { courtType: pattern },
            ];
        }

        // 3. Office-specific search
        const officeMatch: Record<string, any> = { ...baseMatch };
        if (name) {
            const pattern = new RegExp(buildBilingualFuzzyRegex(name), "i");
            officeMatch.$or = [
                { name: pattern },
                { courtName: pattern },
                { roomNumber: pattern },
                { locationDirection: pattern },
                { governorate: pattern },
                { courtType: pattern },
            ];
        }

        // 4. Build and execute pipeline using AggregateBuilder
        const builder = new AggregateBuilder<CourtAndOfficeEntity>(CourtModel, query);

        const result = await builder
            .addStage([
                // Match & Project Courts
                { $match: courtMatch },

                // Union with Offices
                {
                    $unionWith: {
                        coll: "offices",
                        pipeline: [
                            { $match: officeMatch },

                        ],
                    },
                },
            ])
            .sort()
            .paginate()
            .execute();
            printGreen("result", query.userId.toString());
        result.data.forEach((item: any) => {
            item.isOffice = item.officeType != null;
            if (!item.isOffice) {
                const isSaved = Boolean((item as any).savedBy?.some((id: any) => id.toString() === query.userId.toString()));
                // Delete savedBy so it's not exposed to the client
                delete item.savedBy;
                item.isSaved = isSaved;
            }
            //   courts.data = this.checkUserSavedCourts(courts.data, userId);

        });
        return result as listType<CourtAndOfficeEntity>;
    }
}
export default new CourtAndOfficeRepoImpl();
