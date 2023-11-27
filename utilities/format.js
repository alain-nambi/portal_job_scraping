export const formatDate = (date) => {
  return String(date).trim("\n").replaceAll("\n", "-");
};

export const uniqueFileName = () => {
  const datetime = new Date().toISOString().split("T");
  const date = datetime[0].replaceAll("-", "_")
  const time = datetime[1].split(".")[0].replaceAll(":", "_")
  const milliseconds = datetime[1].split(".")[1].replace("Z", "")
  return `WEBDEV_${date}_${time}_${milliseconds}.pdf`
};
