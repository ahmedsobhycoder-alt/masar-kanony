import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { Model, PopulateOptions } from "mongoose";
import ApiError from "../errors/apiError";
import { formatJson } from "../utils/formatJson";
import { QueryBuilder } from "../utils/queryBuilder";

export class ServiceHandler<T> {
  constructor(
    protected readonly collection: Model<T>,
    protected readonly modelName: string,
    protected readonly searchFields: string[] = ["name"],
  ) {}

  addOne(populateOptions?: PopulateOptions | (string | PopulateOptions)[]) {
    return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      const addedItem = await this.collection.create(req.body);

      if (populateOptions && addedItem) {
        await (addedItem as any).populate(populateOptions);
      }

      if (!addedItem) {
        return next(new ApiError(400, `${this.modelName} not found`));
      }

      res.status(201).json(
        formatJson({
          data: addedItem,
          message: `${this.modelName} created successfully`,
          status: true,
        }),
      );
    });
  }

  getAll(populateOptions?: PopulateOptions | (string | PopulateOptions)[]) {
    return asyncHandler(async (req: any, res: Response, next: NextFunction) => {
      const filterObject = { ...(req.filterObject || {}), ...(req.query || {}) };
      const queryBuilder = new QueryBuilder<T>(this.collection.find(filterObject as any), req.query || {})
        .filter()
        .search(undefined, this.searchFields);

      const totalDocuments = await queryBuilder.mongooseQuery.clone().countDocuments();
      queryBuilder.paginate(totalDocuments).sort().limitFields();

      if (populateOptions) {
        queryBuilder.populate(populateOptions);
      }

      const documents = await queryBuilder.mongooseQuery;

      if (!documents) {
        return next(new ApiError(404, `${this.modelName} not found`));
      }

      res.status(200).json(
        formatJson({
          data: {
            count: totalDocuments,
            paginationResult: queryBuilder.pagination,
            list: documents,
          },
          message: `${this.modelName} fetched successfully`,
          status: true,
        }),
      );
    });
  }

  deleteOne(populateOptions?: PopulateOptions | (string | PopulateOptions)[]) {
    return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      const id = req.params.id;
      const query: any = this.collection.findByIdAndDelete(id);

      if (populateOptions) {
        query.populate(populateOptions);
      }

      const deletedItem = await query;

      if (!deletedItem) {
        return next(new ApiError(404, `${this.modelName} not found`));
      }

      res.status(200).json(
        formatJson({
          data: deletedItem,
          message: `${this.modelName} deleted successfully`,
          status: true,
        }),
      );
    });
  }

  updateOne() {
    return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      const id = req.params.id;
      const updatedItem = await this.collection.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updatedItem) {
        return next(new ApiError(404, `${this.modelName} not found`));
      }

      res.status(200).json(
        formatJson({
          data: updatedItem,
          message: `${this.modelName} updated successfully`,
          status: true,
        }),
      );
    });
  }

  getOne(populateOptions?: PopulateOptions | (string | PopulateOptions)[]) {
    return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      const id = req.params.id;
      const query: any = this.collection.findById(id);

      if (populateOptions) {
        query.populate(populateOptions);
      }

      const item = await query;

      if (!item) {
        return next(new ApiError(404, `${this.modelName} not found`));
      }

      res.status(200).json(
        formatJson({
          data: item,
          message: `${this.modelName} fetched successfully`,
          status: true,
        }),
      );
    });
  }
}
