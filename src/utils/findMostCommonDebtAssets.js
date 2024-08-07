

// open te JSON file containing the debts using fs module
// parse the JSON file and store it in a variable
import fs from 'fs';
const debts = JSON.parse(fs.readFileSync('./debtAssetsAddressGLOBAL.json', 'utf8'));

console.log(debts);

// create a function that loops through all the debts and finds the most common debt assets
// and returns an array of the most common debt assets sorted by the most common to the least common
// and the number of times the debt asset appears in the debts array
// the SON fiele only has an array of addresses nothing else

function findMostCommonDebtAssets(debts) {
    let debtAssets = {};
    debts.forEach(debt => {
        if (debtAssets[debt]) {
        debtAssets[debt] += 1;
        } else {
        debtAssets[debt] = 1;
        }
    });
    let sortedDebtAssets = Object.entries(debtAssets).sort((a, b) => b[1] - a[1]);
    return sortedDebtAssets;
    }


console.log(findMostCommonDebtAssets(debts));