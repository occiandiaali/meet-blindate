function convertMilliseconds(ms) {
  let totalSeconds = Math.floor(ms / 1000);
  let hours = Math.floor((totalSeconds % 86400) / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let seconds = totalSeconds % 60;
  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")} ${ampm}`;
}

module.exports = convertMilliseconds;
