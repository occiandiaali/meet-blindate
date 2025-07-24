function addMinutesToDate(date, duration) {
  // Create a new Date object to avoid modifying the original date directly,
  // which can be important if the original date is used elsewhere.
  const newDate = new Date(date.getTime());

  // Get the current minutes and add 5 to them.
  // The setMinutes() method automatically handles overflows (e.g., 60 minutes becoming 1 hour).
  newDate.setMinutes(newDate.getMinutes() + duration);

  return newDate;
}

module.exports = addMinutesToDate;
