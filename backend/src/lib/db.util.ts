export const makeUpdateSet = (values?: Record<string, unknown>) => {
  if (!values) return "";

  return Object.keys(values)
    .map((key) => `${key} = '${values[key]}'`)
    .join(", ");
};

export const makeInsertSet = (values?: Record<string, unknown>) => {
  if (!values) return "";

  const columns = Object.keys(values)
    .map((key) => `${key}`)
    .join(", ");
  
  const params = Object.keys(values)
    .map((key) => `'${values[key]}'`)
    .join(", ");

  return ` (${columns}) VALUES (${params})`;
};
