abstract class Constraints {
    /*
    an abstract class that contains the common attributes and methods templates for constraints
    other classess inherit this class to determine their own values of the variables and possibly override methods
    */

    consequentHoursLimit: number
    hoursPerDayLimit: number
    hoursPerWeekLimit: number
    numClassPerUnitLimit: number
    numActivityPerTALimit: number

//constructor
constructor(consequentHoursLimit: number,
    hoursPerDayLimit: number,
    hoursPerWeekLimit: number,
    numClassPerUnitLimit: number,
    numActivityPerTALimit: number){
        this.consequentHoursLimit = consequentHoursLimit;
        this.hoursPerDayLimit = hoursPerDayLimit;
        this.hoursPerWeekLimit = hoursPerWeekLimit;
        this.numClassPerUnitLimit = numClassPerUnitLimit;
        this.numActivityPerTALimit = numActivityPerTALimit;
    }
////////////////////////////
    /*
        Setters:
        change the values of the attribute if the user is an Admin
        logic: when calling the functions, pass the user status as admin or not.     
    */

   setConsequentHoursLimit(isAdmin: boolean, hours:number ){
        if (isAdmin){
            this.consequentHoursLimit = hours;
        }else{
            //TODO: show error message for user (communicate with front end)
        }
    }

    setHoursPerDayLimit(isAdmin: boolean, hours:number ){
        if (isAdmin){
            this.hoursPerDayLimit = hours;
        }else{
            //TODO: show error message for user (communicate with front end)
        }
    }

    setHoursPerWeekLimit(isAdmin: boolean, hours:number ){
        if (isAdmin){
            this.hoursPerWeekLimit = hours;
        }else{
            //TODO: show error message for user (communicate with front end)
        }
    }

    setNumClassPerUnitLimit(isAdmin: boolean, number:number ){
        if (isAdmin){
            this.numClassPerUnitLimit = number;
        }else{
            //TODO: show error message for user (communicate with front end)
        }
    }

    setnumActivityPerTALimit(isAdmin: boolean, number:number ){
        if (isAdmin){
            this.numActivityPerTALimit = number;
        }else{
            //TODO: show error message for user (communicate with front end)
        }
    }

////////////////////////////
    /*
        individual constraints check
        check the param passed against the variable store here.
        return true if checkPasses, else return False
    */

    checkConsequentHoursLimit(hours: number){
        if ( hours > this.consequentHoursLimit){
            return true;
        }else{
            return false;
        }
    }

    checkHoursPerDayLimit(hours: number){
        if ( hours > this.hoursPerDayLimit){
            return true;
        }else{
            return false;
        }
    }

    checkHoursPerWeekLimit(hours: number){
        if ( hours > this.hoursPerWeekLimit){
            return true;
        }else{
            return false;
        }
    }

    checkNumClassPerUnitLimit(classesCount: number){
        if ( classesCount > this.numClassPerUnitLimit){
            return true;
        }else{
            return false;
        }
    }

    checkNumActivityPerTALimit(classesCount: number){
        if ( classesCount > this.numActivityPerTALimit){
            return true;
        }else{
            return false;
        }
    }
////////////////////////////
    /*
        FullScanRunner
        run all scans and submit a report of all constraints violations
    */

    runFullScan
        (
        consequentHours: number, 
        hoursPerDay: number, 
        hoursPerWeek: number,
        numActivityPerUnit: number,
        totalActivityCount: number
        )
        {
        //array to store violaion causes
        let testFailed: Array<string> = [];
        
        //check for consequent hours 
        if (!this.checkConsequentHoursLimit(consequentHours)){
            testFailed.push("ConsequentHoursLimit");
        }

        //check for hours per day
        if (!this.checkHoursPerDayLimit(hoursPerDay)){
            testFailed.push("HoursPerDayLimit");
        }

        //check for hours per week
        if (!this.checkHoursPerWeekLimit(hoursPerWeek)){
            testFailed.push("HoursPerWeekLimit");
        }

        //check for number of activities chosen by a TA per unit
        if (!this.checkNumClassPerUnitLimit(numActivityPerUnit)){
            testFailed.push("NumClassPerUnitLimit");
        }

        //check for number of Activities in total chosen by a TA
        if (!this.checkNumActivityPerTALimit(totalActivityCount)){
            testFailed.push("NumActivityPerTALimit");
        }

        return testFailed;
        //caller of this function can use the array.length to check if length = 0, then no violations
        
    }
}

/*
//to extend from this abstract class

class Level0TA extends Constraints{
    <<add any new paramaters here>>
    // example: number of days per week...

    constructor(
        consequentHoursLimit: number,
        hoursPerDayLimit: number,
        hoursPerWeekLimit: number,
        numClassPerUnitLimit: number,
        numActivityPerTALimit: number
        *new* numDaysPerWeek: number 
        ) 
        {
        super(consequentHoursLimit,
            hoursPerDayLimit,
            hoursPerWeekLimit,
            numClassPerUnitLimit,
            numActivityPerTALimit);
        
        }
       *new* this.NumDaysPerWeek: numDaysPerWeek
}

*/