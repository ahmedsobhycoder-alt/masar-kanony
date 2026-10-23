import CourtActivity from "../../infrastructure/database/models/courtActivityModel";

// Reserve a durable audit entry before mutating a court, including before deletion.
export async function auditCourtAction<T extends { _id?: any; name?: string } | null>(
  admin: any, action: "created" | "updated" | "deleted", courtId: string | undefined,
  operation: () => Promise<T>,
): Promise<T> {
  const entry = await CourtActivity.create({
    court: courtId, action, admin: admin._id,
    adminName: admin.name || admin.email || String(admin._id), adminEmail: admin.email,
  });
  let result: T;
  try {
    result = await operation();
  } catch (error) {
    await CourtActivity.updateOne({ _id: entry._id }, { $set: { status: "failed" } });
    throw error;
  }
  await CourtActivity.updateOne({ _id: entry._id }, { $set: result ? {
    court: result._id || courtId, courtName: result.name, status: "completed",
  } : { status: "failed" } });
  return result;
}
