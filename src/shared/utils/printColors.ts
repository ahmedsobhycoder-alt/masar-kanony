

import "colors";
function printRed(text:string, value:any){ 
 console.log(`${text} ${value}`.red);   
}
function printBlue(text:string, value:any){
    console.log(`${text} ${value}`.bgBlue);   
}
function printGreen(text:string, value:any){
    console.log(`${text} ${value}`.bgGreen);
}
function printYellow(text:string, value:any){
    console.log(`${text} ${value}`.bgYellow);
}

/**
 * Generates a secure 6-digit random string
 * @returns {string} - e.g., "482910"
 */
// const generateOTP = () => {
//   // Generates a number between 100,000 and 999,999
//   const otp = crypto.randomInt(100000, 1000000).toString();
//   return otp;
// };


export {printRed, printBlue, printGreen, printYellow};