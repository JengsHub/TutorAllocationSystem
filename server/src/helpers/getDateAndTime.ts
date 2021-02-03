/**
 * Get date and format : DD/MM/YYYY before returning as a string
 */
export function createCurrentDate() {
  // Getting the current Date
  let dateObject = new Date();
  let dateDay = ("0" + dateObject.getDate()).slice(-2);
  let month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
  let year = dateObject.getFullYear();

  return dateDay + "/" + month + "/" + year;
}

/**
 * Returns the current data and time back in string format: "DD/MM/YYYY 24:00:00"
 */
export function createCurrentDateAndTime() {
  let dateObject = new Date();
  let hour = (dateObject.getHours() < 10 ? "0" : "") + dateObject.getHours();
  let minute =
    (dateObject.getMinutes() < 10 ? "0" : "") + dateObject.getMinutes();
  let seconds =
    (dateObject.getSeconds() < 10 ? "0" : "") + dateObject.getSeconds();
  let time = hour + ":" + minute + ":" + seconds;
  return createCurrentDate() + " " + time;
}
