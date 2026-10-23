import OfficeTypeModel from "../models/officeTypeModel";
import SequenceModel from "../models/sequenceModel";

export async function nextOfficeTypeId(): Promise<number> {
  const highest = await OfficeTypeModel.findOne().sort({ id: -1 }).select("id").lean();
  const filter = { _id: "officeTypes" };
  const update = { $max: { value: highest?.id ?? 0 } };
  // Keep the sequence ahead of existing/seeded IDs without ever moving it backwards.
  try {
    await SequenceModel.updateOne(filter, update, { upsert: true });
  } catch (error: any) {
    if (error?.code !== 11000) throw error;
    // Another first request may have initialized the same sequence concurrently.
    await SequenceModel.updateOne(filter, update);
  }
  const sequence = await SequenceModel.findOneAndUpdate(filter, { $inc: { value: 1 } }, { new: true });
  if (!sequence) throw new Error("Office type sequence is unavailable");
  return sequence.value;
}
