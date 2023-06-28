export const normalizeProjectName = (name: string) => {
  return name.toLowerCase().split(' ').join('-');
};
