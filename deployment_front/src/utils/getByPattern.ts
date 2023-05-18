export const getByPattern = (value: string, pattern: any): any => {
  const matches = value.match(pattern);
  const result = matches ? matches.join("") : "";
  return result;
};
