import ApiError from "../errors/apiError";

const pickAllowedFields = (
  source: Record<string, unknown>,
  allowedFields: string[],
): Record<string, unknown> => {
  const selected = Object.fromEntries(
    allowedFields
      .filter((field) => Object.prototype.hasOwnProperty.call(source, field))
      .map((field) => [field, source[field]])
  );

  if (!Object.keys(selected).length) {
    throw new ApiError(400, "No supported fields to update");
  }

  return selected;
};

export default pickAllowedFields;
