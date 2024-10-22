export const formatDecimal = (decimal) => {
  if (decimal && decimal.$numberDecimal) {
    return parseFloat(decimal.$numberDecimal).toFixed(2);
  }
  return "0.00";
};
