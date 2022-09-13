export const checkNumber = (string) =>
  !isNaN(parseFloat(string)) && !isNaN(string - 0) && parseInt(string);
