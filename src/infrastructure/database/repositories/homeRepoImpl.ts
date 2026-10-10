import HomeRepo from "../../../domain/repositories/homeRepo";
import HomeEntity from "../../../domain/entities/homeEntity";
import AdsModel from "../models/adsModel";
import CourtModel from "../models/courtModel";
import { QueryBuilder, QueryPagination } from "../../../shared/utils/queryBuilder";
import { query } from "express-validator";
import CourtEntity from "../../../domain/entities/courtEntity";
class HomeRepoImpl implements HomeRepo {
  private readonly courtQueryBuilder: QueryBuilder = new QueryBuilder(
    CourtModel.find(),

  );
  private readonly adsQueryBuilder: QueryBuilder = new QueryBuilder(
    AdsModel.find(),

  );
 async getHomeData(userId:string|null): Promise<HomeEntity> {
    // 1. Instantiate FRESH queries locally (Do NOT use 'this.queryBuilder')
    const courtsQueryBuilder = new QueryBuilder(CourtModel, {})
        .populate(["governorate", "courtType", "floors"])
        .limitFields()
        .sort();
        
    const adsQueryBuilder = new QueryBuilder(AdsModel, {})
        .limitFields()
        .sort();

    const mostSeenQueryBuilder = new QueryBuilder(CourtModel, {})
        .populate(["governorate", "courtType", "floors"])
        .limitFields();

    // 2. Execute all queries simultaneously using Promise.all
    // Always append .clone() to ensure Mongoose treats them as fresh executions
    let [courts, ads, mostSeenCourts] = await Promise.all([
        courtsQueryBuilder.mongooseQuery.clone(),
        adsQueryBuilder.mongooseQuery.clone(),
        
        // Apply the specific sort directly to the underlying Mongoose query
        mostSeenQueryBuilder.mongooseQuery.clone().sort({ nViews: -1 }) 
    ]);
  // 5. Map results and calculate isSaved safely
    const formattedCourts   = (courts || []).map((court:any) => {
      const isSaved = userId
        ? Boolean(court.savedBy?.some((id: any) => id.toString() === userId))
        : false;
        


      // Delete savedBy so it's not exposed to the client
      delete (court as Partial<CourtEntity>).savedBy;
      court.isSaved = isSaved;
      return court
    });
        const formattedMostSeenCourts   = (mostSeenCourts || []).map((court:any) => {
      const isSaved = userId
        ? Boolean(court.savedBy?.some((id: any) => id.toString() === userId))
        : false;
        


      // Delete savedBy so it's not exposed to the client
      delete (court as Partial<CourtEntity>).savedBy;
      court.isSaved = isSaved;
      return court
    });
    courts=formattedCourts
    mostSeenCourts=formattedMostSeenCourts
    // 3. Return the results
    return { courts, ads, mostSeenCourts};
}
}
export default HomeRepoImpl;
