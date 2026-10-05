import AppConfigEntity from "../../../domain/entities/appConfigEntity";
import AppConfigRepository from "../../../domain/repositories/appConfigRepo";
import ApiError from "../../../shared/errors/apiError";
import AppConfigModel from "../models/appConfigModel";
import CourtModel from "../models/courtModel";

class AppConfigRepositoryImpl implements AppConfigRepository {
  /**
   * Helper to map raw Mongoose lean documents to pure domain entity
   */
  private mapToEntity(doc: any): AppConfigEntity {
    const { _id, __v, ...rest } = doc;
    return {
      id: _id ? _id.toString() : rest.id,
      ...rest,
    } as AppConfigEntity;
  }

  /**
   * Helper to compute dynamic court and governorate statistics in parallel
   */
  private async computeLiveStats(fallbackDate?: Date) {
    const [courtsCount, uniqueGovernorates, latestCourt] = await Promise.all([
      CourtModel.countDocuments(),
      CourtModel.distinct("governorate", {
        governorate: { $exists: true, $ne: null },
      }),
      CourtModel.findOne().sort({ updatedAt: -1 }).select("updatedAt").lean(),
    ]);

    return {
      courtsCount,
      governoratesCount: uniqueGovernorates.length,
      lastDataUpdate: latestCourt?.updatedAt || fallbackDate || new Date(),
    };
  }

  /**
   * Fetch singleton AppConfig with real-time dynamic statistics
   */
  async getAppConfig(): Promise<AppConfigEntity | null> {
    const config = await AppConfigModel.findOne().lean();

    if (!config) {
      throw new ApiError(404, "App config not found");
    }

    const liveStats = await this.computeLiveStats(config.updatedAt);

    return this.mapToEntity({
      ...config,
      stats: liveStats,
    });
  }

  /**
   * Create initial AppConfig singleton document
   */
  async createAppConfig(appConfig: Partial<AppConfigEntity>): Promise<AppConfigEntity> {
    const liveStats = await this.computeLiveStats();

    const createdAppConfig = await AppConfigModel.create({
      ...appConfig,
      stats: liveStats,
    });

    return this.mapToEntity(createdAppConfig.toObject());
  }

  /**
   * Update singleton AppConfig using atomic $set to prevent wiping nested fields
   */
  async updateAppConfig(
    appConfig: Partial<AppConfigEntity>
  ): Promise<AppConfigEntity | null> {
    // Exclude 'id' or '_id' from the update payload to avoid immutable field errors
    const { id, ...updateData } = appConfig as any;

    const updated = await AppConfigModel.findOneAndUpdate(
      {}, // Matches the single configuration document
      { $set: updateData },
      {
        new: true,
        upsert: true, // Creates document if it doesn't exist yet
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    ).lean();

    if (!updated) {
      throw new ApiError(404, "App config not found");
    }

    // Return with live computed statistics
    const liveStats = await this.computeLiveStats(updated.updatedAt);

    return this.mapToEntity({
      ...updated,
      stats: liveStats,
    });
  }
}

export default new AppConfigRepositoryImpl();