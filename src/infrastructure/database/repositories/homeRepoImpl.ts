import HomeRepo from "../../../domain/repositories/homeRepo";
import HomeEntity from "../../../domain/entities/homeEntity";
import AdsModel from "../models/adsModel";
import CourtModel from "../models/courtModel";
import { QueryBuilder, QueryPagination } from "../../../shared/utils/queryBuilder";
import { query } from "express-validator";
class HomeRepoImpl implements HomeRepo {
  private readonly courtQueryBuilder: QueryBuilder = new QueryBuilder(
    CourtModel.find(),

  );
  private readonly adsQueryBuilder: QueryBuilder = new QueryBuilder(
    AdsModel.find(),

  );
 async getHomeData(): Promise<HomeEntity> {
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
    const [courts, ads, mostSeenCourts] = await Promise.all([
        courtsQueryBuilder.mongooseQuery.clone(),
        adsQueryBuilder.mongooseQuery.clone(),
        // Apply the specific sort directly to the underlying Mongoose query
        mostSeenQueryBuilder.mongooseQuery.clone().sort({ nViews: -1 }) 
    ]);

    // 3. Return the results
    return { courts, ads, mostSeenCourts };
}
}
export default HomeRepoImpl;
