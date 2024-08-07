// scale number to 8 deciamls (remaining in bigInt)
export function adjustDecimals(value, decimals) {
    // assumes value to be bigInt
    // Multiply by 10^decimals if decimals are more than 8 (you have to multiply by the difference between 8 and decimals)
    // Divide by 10^decimals if decimals are less than 8 (ou have to devide b the difference between 8 and decimals)
    
    if (decimals < 8) {
        return value * BigInt(10 ** (8 - decimals));
    } else if (decimals > 8) {
        return value / BigInt(10 ** (decimals - 8));
    } else {
        return value;
    }
}

// function to multiply two bigInt numbers and return the result in bigInt 8 decimals
// assumes both numbers are in bigInt format
// assumes one of the numbers is in 8 decimals
export function multiplyDecimals(a, b, decimals) {
    return (a * b) / 10n**(BigInt(decimals));
}

// function to convert any 8 decimals number to a given number of decimals
// assumes number is in bigInt format
export function convertFromTo(number, decimalsFrom, decimalsTo) {
    // if decimals are less than 8, multiply by 10^(8 - decimals)
    // if decimals are more than 8, divide by 10^(decimals - 8)
    if (decimalsFrom < decimalsTo) {
        return number * 10n**(BigInt(decimalsTo - decimalsFrom));
    } else if (decimalsFrom > decimalsTo) {
        return number / 10n**(BigInt(decimalsFrom - decimalsTo));
    } else {
        return number;
    }
}

// export function divideDecimals(a, b, decimals) {
//     return (a * 10n**(BigInt(decimals))) / b;
// }

// // test
// console.log(adjustDecimals(1000000000000000000n, 18)); // 10000000000n
// console.log(adjustDecimals(1000000n, 6)); // 1000000000000000000n
// let a = 2832901422384028203n;// 18 decimals
// let b = 51571861n; // 8 decimals
// let decimals = 18;

// // test 2
// console.log(multiplyDecimals(a, b, decimals));
// a = 283290142n;// 8 decimals
// b = 51571861n; // 8 decimals
// decimals = 8;
// console.log(multiplyDecimals(a, b, decimals));


// // test 3
// a = 2832902057736600146n;// 18 decimals
// b = 51449999n; // 8 decimals
// decimals = 18;
// console.log(multiplyDecimals(a, b, decimals)); //

// // test 3
// a = 2832902n;// 6 decimals
// b = 51449999n; // 8 decimals
// decimals = 6;
// console.log(multiplyDecimals(a, b, decimals)); //


// // test 04
// let number = 1000n;
// let decimalsFrom = 3;
// let decimalsTo = 18;
// console.log(convertFromTo(number, decimalsFrom, decimalsTo)); // 10000000000n