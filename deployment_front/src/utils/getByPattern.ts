export const getByPattern = (value: string, pattern: any) => {
  return value.match(pattern)!.join("");
};
