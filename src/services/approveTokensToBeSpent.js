// Import starknet
import { Account, cairo, ec} from 'starknet';
// import initialiseProvider and instantiateZKLendContract
import { initialiseProvider, instantiateZKLendContract, initialiseTokenContract, initialiseAccount } from '../utils/InitialisationStarknet.js';
// import dotenv
import dotenv from 'dotenv';
dotenv.config();
// import the decimals

// initialise the provider
const provider = initialiseProvider();
// instantiate the ZKLend contract
const zkLendContract = await instantiateZKLendContract(provider);

// Initialise the account
const account = initialiseAccount();

// function to approve tokens to be spent by markets
async function approveTokensToBeSpent(tokenContratcAddress, amount) {
    const tokenContract = await initialiseTokenContract(provider, tokenContratcAddress);
    
    // get the token decimals .. this will be used in future versions of the code
    const decimals = await tokenContract.decimals();

    // serialise the amount
    const amountSerialised = cairo.uint256(amount);

    // connect the account
    tokenContract.connect(account);

    // execute the approve function
    const res = await tokenContract.approve(zkLendContract.address, amountSerialised);
    const txR = await provider.waitForTransaction(res.transaction_hash);

    console.log(txR.statusReceipt, txR.value);
    console.log(txR.isSuccess(), txR.isRejected(), txR.isReverted(), txR.isError());

    txR.match({
    success: () => {
        console.log('Success');
    },
    _: () => {
        console.log('Unsuccess');
    },
    });
}

// Call the function
async function main() {
    await approveTokensToBeSpent(process.env.USDC_ACCOUNT_ADDRESS, 40_000000); //6 decimals
    await approveTokensToBeSpent(process.env.USDT_ACCOUNT_ADDRESS, 40_000000); //6 decimals
}

await main();