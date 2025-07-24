export const makeUpdateSet = (values?: Record<string, unknown>) => {
  if (!values) return "";

  return Object.keys(values)
    .map((key) => `${key} = '${values[key]}'`)
    .join(", ");
};
