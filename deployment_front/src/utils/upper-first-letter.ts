export const capitalizeFirstLowercaseRest = (str: string) => {
  if (str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  return "";
};
