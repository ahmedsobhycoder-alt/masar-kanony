import AdminAuditLog from "../../infrastructure/database/models/adminAuditLogModel";
import CourtModel from "../../infrastructure/database/models/courtModel";
import FloorModel from "../../infrastructure/database/models/floorModel";
import OfficeModel from "../../infrastructure/database/models/officeModel";
import ApiError from "../errors/apiError";

export type AuditedResource = "court" | "floor" | "office";

const plain = (document: any) => document?.toObject ? document.toObject({ depopulate: true }) : document;

export async function snapshotResource(resource: AuditedResource, id: string) {
  if (resource === "court") {
    const entity = await CourtModel.findById(id).lean();
    if (!entity) return null;
    const floors = await FloorModel.find({ court: id } as any).lean();
    const offices = await OfficeModel.find({ $or: [{ court: id }, { floor: { $in: floors.map(item => item._id) } }] } as any).lean();
    return { entity, floors, offices };
  }
  if (resource === "floor") {
    const entity = await FloorModel.findById(id).lean();
    if (!entity) return null;
    const offices = await OfficeModel.find({ $or: [{ floor: id }, { _id: { $in: entity.offices || [] } }] } as any).lean();
    return { entity, offices };
  }
  const entity = await OfficeModel.findById(id).lean();
  return entity ? { entity } : null;
}

export async function auditAdminMutation<T>(options: {
  admin: any;
  resource: AuditedResource;
  action: "updated" | "deleted";
  id: string;
  operation: () => Promise<T>;
}): Promise<T> {
  // HTTP/unit tests may exercise mocked use cases without opening MongoDB.
  // Production mutations only run after the application's connection is ready.
  if (CourtModel.db.readyState !== 1) return options.operation();
  const before = await snapshotResource(options.resource, options.id);
  if (!before) return options.operation();
  const result = await options.operation();
  const after = options.action === "updated" ? await snapshotResource(options.resource, options.id) : undefined;
  const entity: any = before.entity;
  await AdminAuditLog.create({
    resource: options.resource,
    resourceId: entity._id,
    resourceName: entity.name || entity.floorName || entity.roomNumber || String(entity._id),
    action: options.action,
    actor: options.admin._id,
    actorName: options.admin.name || options.admin.email || String(options.admin._id),
    actorEmail: options.admin.email,
    before: plain(before),
    after: plain(after),
  });
  return result;
}

const restoreDocument = async (model: any, document: any) => {
  if (!document?._id) return;
  await model.replaceOne({ _id: document._id }, document, { upsert: true, runValidators: true });
};

export async function restoreAuditLog(log: any, admin: any) {
  if (log.restoredAt) throw new ApiError(409, "This audit entry has already been restored");
  const snapshot = log.before;
  if (!snapshot?.entity) throw new ApiError(400, "Audit snapshot is unavailable");

  if (log.resource === "court") {
    await restoreDocument(CourtModel, snapshot.entity);
    for (const floor of snapshot.floors || []) await restoreDocument(FloorModel, floor);
    for (const office of snapshot.offices || []) await restoreDocument(OfficeModel, office);
  } else if (log.resource === "floor") {
    await restoreDocument(FloorModel, snapshot.entity);
    for (const office of snapshot.offices || []) await restoreDocument(OfficeModel, office);
    await CourtModel.updateOne({ _id: snapshot.entity.court }, { $addToSet: { floors: snapshot.entity._id } });
  } else {
    await restoreDocument(OfficeModel, snapshot.entity);
    await FloorModel.updateOne({ _id: snapshot.entity.floor }, { $addToSet: { offices: snapshot.entity._id } });
  }

  log.restoredAt = new Date();
  log.restoredBy = admin._id;
  log.restoredByName = admin.name || admin.email || String(admin._id);
  await log.save();
  return snapshot.entity;
}
