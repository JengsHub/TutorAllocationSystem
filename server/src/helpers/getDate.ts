/**
 * Get date and format : DD/MM/YYYY before returning as a string
 */
export function createCurrentDate(){
    // Getting the current Date
    let dateObject = new Date();
    let dateDay = ("0" + dateObject.getDate()).slice(-2);
    let month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
    let year = dateObject.getFullYear();

    return dateDay+"/"+month+"/"+year;
}