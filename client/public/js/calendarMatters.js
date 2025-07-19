export function isToday(input) {
  var q = new Date();
  var m = q.getMonth() + 1;
  var d = q.getDay();
  var y = q.getFullYear();

  var day = `${m}/${d}/${y}`;

  var today = new Date(day);
  if (today !== new Date(input)) {
    return true;
  } else {
    return false;
  }
}

export function isInputEqualToToday(input) {
  let inputDate = new Date(input);
  let today = new Date();
  if (inputDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
    return false;
  } else {
    return true;
  }
}

export function getTodayDate() {
  let today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  return today;
}
export function formatDate(inputDate) {
  if (getTodayDate() > inputDate) {
    window.alert("You can't choose a past date!");
    return;
  }
  var date = new Date(inputDate);
  if (!isNaN(date.getTime())) {
    // Months use 0 index.
    return (
      date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
    );
  }
}
