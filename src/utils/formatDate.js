export const formatDate = (ISOStringDate) => {
  const readableDate = new Date(ISOStringDate);
  let day = readableDate.getDate();
  let month = readableDate.getMonth() + 1;
  const year = readableDate.getFullYear();
  if (day < 10) {
    day = `0${day}`;
  }
  if (month < 10) {
    month = `0${month}`;
  }
  return `${day}/${month}/${year}`;
};
