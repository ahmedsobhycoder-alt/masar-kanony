import OfficeTypeRepo from "../../../domain/repositories/officeTypeRepo";
import { OfficeTypeEntity } from "../../../domain/entities/officeTypeEntity";
import OfficeTypeModel from "../models/officeTypeModel";
import { QueryBuilder, QueryPagination } from "../../../shared/utils/queryBuilder";

class OfficeTypeRepoImpl implements OfficeTypeRepo {
  async countDocuments(): Promise<number> {
    return await OfficeTypeModel.find().clone().countDocuments();
  }

  async createOfficeType(officeTypeData: OfficeTypeEntity): Promise<OfficeTypeEntity> {
    return await OfficeTypeModel.create(officeTypeData);
  }

  async getOfficeTypes(query: Record<string, any> = {}): Promise<{ data: OfficeTypeEntity[]; pagination?: QueryPagination }> {
    const queryBuilder = new QueryBuilder<OfficeTypeEntity>(OfficeTypeModel.find(), query)
    const countDocuements =await queryBuilder.mongooseQuery.clone().countDocuments();
      queryBuilder.filter()
      .search(undefined, ["name"])
      .paginate(countDocuements)
      .sort()
      .limitFields();

    const officeTypes = await queryBuilder.mongooseQuery;

    return {
      data: officeTypes.map((officeType) => {
        if (officeType && typeof (officeType as any).toJSON === "function") {
          return (officeType as any).toJSON() as OfficeTypeEntity;
        }
        return officeType as OfficeTypeEntity;
      }),
      pagination: queryBuilder.pagination,
    };
  }

  async getOfficeTypeById(id: string): Promise<OfficeTypeEntity | null> {
    const officeType = await OfficeTypeModel.findById(id);
    return officeType ? (officeType.toJSON() as OfficeTypeEntity) : null;
  }

  async deleteOfficeTypeById(id: string): Promise<OfficeTypeEntity | null> {
    const officeType = await OfficeTypeModel.findByIdAndDelete(id);
    return officeType ? (officeType.toJSON() as OfficeTypeEntity) : null;
  }
}

const officeTypeRepoImpl = new OfficeTypeRepoImpl();
export default officeTypeRepoImpl;
export { OfficeTypeRepoImpl };
