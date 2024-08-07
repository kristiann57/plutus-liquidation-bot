import { RpcProvider, Contract} from 'starknet';
import fs from 'fs';
// import zkLendABI from '../ABI/zkLendABI.js';

// initialise the provider
const myNodeUrl = 'http://homelab.cicerolabs.xyz:9545';
const provider = new RpcProvider({ nodeUrl: `${myNodeUrl}` });

// ZKLend Contract address
const zkLendContratcAddress = '0x04c0a5193d58f74fbace4b74dcf65481e734ed1714121bdc571da345540efa05'

// read abi of ZKLend contract
const { abi: zkLendABI } = await provider.getClassAt(zkLendContratcAddress);
if (zkLendABI === undefined) {
  throw new Error('no abi.');
}

const zkLendContract = new Contract(zkLendABI, zkLendContratcAddress, provider);

// open JSON file with unique borrower addresses
const borrowers = JSON.parse(fs.readFileSync('/mnt/d/Nethermind/starknet_zklend_liquidator_bot/uniqueBorrowerAddresses.json', 'utf8'));

// loop through the borrowers and get Only the active ones
async function getOnlyActiveBorrowers(borrowers) {
    console.log("Checking active borrowers...")
    const activeBorrowers = [];
    for (const borrower of borrowers) {
        // this is necessary to get the calldata for the function call
        const myCall = zkLendContract.populate('user_has_debt', [borrower]);
        // execute the call
        const res = await zkLendContract.user_has_debt(myCall.calldata);
        const isBorrowerActive = await zkLendContract.user_has_debt(borrower);
        // log the borrower address and the result
        console.log(borrower, isBorrowerActive);
        if (isBorrowerActive) {
        activeBorrowers.push(borrower);
        }
    }
    return activeBorrowers;
}

// save the active borrowers to a JSON file
function saveActiveBorrowers(activeBorrowers) {
    fs.writeFileSync('/mnt/d/Nethermind/starknet_zklend_liquidator_bot/onlyActiveBorrowers.json', JSON.stringify(activeBorrowers, null, 2));
}

async function main() {
    const activeBorrowers = await getOnlyActiveBorrowers(borrowers);
    saveActiveBorrowers(activeBorrowers);
}

main();
