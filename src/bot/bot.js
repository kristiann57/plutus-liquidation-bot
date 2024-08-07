// import initialiseProvider and instantiateZKLendContract
import { initialiseProvider, 
    instantiateZKLendContract, 
    initialiseOracleContract, 
    initialiseTokenContract,
    initialiseAccount } from '../utils/InitialisationStarknet.js';
import {getAmountToLiquidate} from '../utils/getAmountToLiquidate.js';
import {multiplyDecimals, adjustDecimals, convertFromTo} from '../utils/adjustDecimals.js';
import fs from 'fs';




// ----------------- INITIALISE CONTRACTS & PROVIDER ------------------- //
const provider = initialiseProvider();
const zkLendContract = await instantiateZKLendContract(provider);

// oracle contract instantiation
const oracleContract = await initialiseOracleContract(provider);
// read the onlyActiveBorrowers.json file to get the active borrowers
const borrowers = JSON.parse(fs.readFileSync('/mnt/d/Nethermind/starknet_zklend_liquidator_bot/onlyActiveBorrowers.json', 'utf8'));




// ------------- INITIALISE ACCOUNT ----------------- //
const account = initialiseAccount()


// ----------------- CONSTANTS ------------------- //

// read the reservesData.json file to get the reserves data
const RESERVESDATA = JSON.parse(fs.readFileSync('/mnt/d/Nethermind/starknet_zklend_liquidator_bot/reservesData.json', 'utf8'));
const BASE_RESERVE_DECIMALS = 10**8; // this is the decimals the oracle uses for the price output
const SCALE_27 = 10n**27n; // Equivalent to SCALE in Cairo code
const HEALTH_FATCOR_SCALE = 10n**8n;
const HEALTH_FACTOR_TARGET = 99999999n; // this is the threshold we are aiming to get the Health Factor to (0.99 with 8 decimals)
const HEALTH_FACTOR_THRESHOLD = 100000000n; // this is the threshold we are aiming to get the Health Factor to (1 with 8 decimals)

const debtAssetsAddressGLOBAL = [];

// ----------------- LOGIC ------------------- //

// loop through the active borrowers and using the ZKLend contract, findout if thery're liquidatable
async function findLiquidatableBorrowers(borrowers) {
    console.log("Checking liquidatable borrowers...")
    for (const borrower of borrowers) {

        // execute the call
        let isBorrowerLiquidatable;
        try {
            isBorrowerLiquidatable = await zkLendContract.is_user_undercollateralized(borrower, false); // false: apply borrow factor
        } catch (error) {
            console.log("Error with isBorrowerLiquidatable: ", error); // remove later
            continue;
        }
        
        // log the borrower address and the result
        if (isBorrowerLiquidatable) {
            // we need to find out how much they owe and how much they have as collateral
            // with the reservesData information, let's find out their debt assets
            console.log(borrower, isBorrowerLiquidatable);

            // returns an object with accumulatedDebt, debtAssetToRepay, debtDecimals
            const accumulatedDebtUSD = await getDebtAssetsAmounts(RESERVESDATA, borrower);

            // check if 0 debt, skip
            if (accumulatedDebtUSD == 0) {
                console.log("...ERROR DURING DEBTSASSETS EXECUTION"); // remove later
                continue;
            }

            // returns an object with accumulatedCollateral, collateralAsset, collateralDecimals, collateralFactor, liquidationBonus
            const accumulatedCollateralUSD = await getCollateralAssetsAmounts(RESERVESDATA, borrower); 

            // check if 0 collateral or 0 debt, skip
            if (accumulatedCollateralUSD == 0) {
                console.log("...COLLATERAL TOO MANY...OR ANY OTHER ERROR"); // remove later
                continue;
            }

            // we have to find out the health factor based on the accumulatedDebtUSD and accumulatedCollateralUSD
            const healthFactor = calculateHealthFactor(accumulatedDebtUSD.debtAmount, accumulatedCollateralUSD.collateralAmountRA);
            console.log("Health factor: ", healthFactor); // remove later
            
            // if health factor is less than 1, we need to perform an derivate function to find out how much collateral/debt to liquidate
            if (healthFactor < HEALTH_FACTOR_THRESHOLD) {
                // it takes the  C, f, D, CP, DP, b, targetHF
                const amountToLiquidate = getAmountToLiquidate(
                    accumulatedCollateralUSD.collateralAmountTotal, 
                    accumulatedCollateralUSD.collateralFactor, 
                    accumulatedDebtUSD.debtAmount, 
                    accumulatedCollateralUSD.price, 
                    accumulatedDebtUSD.price,
                    accumulatedCollateralUSD.liquidationBonus, 
                    HEALTH_FACTOR_TARGET
                );

                // convert amountToLiquidate.liquidationAmountInDebtTokens to the debt asset decimals (it is already in 8 decimals)
                const amountToLiquidateInDebtTokens = convertFromTo(amountToLiquidate.liquidationAmountInDebtTokens, 8n, accumulatedDebtUSD.debtDecimals);

                // simulate tx to see if it's profitable
                // if it is, execute the transaction
                // if it's not, skip
                let estimatedFee;
                try{
                    // estimate fee
                    
                    // logs for debugging, remove later
                    console.log("**************borrower: ", borrower); // remove later
                    console.log("**************debt asset: ", accumulatedDebtUSD.debtAsset); // remove later
                    console.log("**************amount to liquidate in debt tokens: ", amountToLiquidateInDebtTokens); // remove later
                    console.log("**************collateral asset: ", accumulatedCollateralUSD.collateralAsset); // remove later

                    const { suggestedMaxFee: estimatedFee } = await account.estimateInvokeFee({
                        contractAddress: zkLendContract.address,
                        entrypoint: 'liquidate',
                        calldata: [borrower, 
                            accumulatedDebtUSD.debtAsset, 
                            amountToLiquidateInDebtTokens, 
                            accumulatedCollateralUSD.collateralAsset],
                    });
                    
                    console.log("**************estimated fee: ", estimatedFee); // remove 
                } catch (error) {
                    console.log("***************Error: ", error); // remove later
                    continue;
                }
                
                // convert profit to liquidate to 18 decimals
                const profitDecimalAdusted = convertFromTo(amountToLiquidate.profitInUSD, 8n, 18n);

                // if profit > fee, execute the transaction
                if (profitDecimalAdusted > estimatedFee) {
                    console.log("**************Liquidating..."); // remove later
                    console.log("!!!!!!!!!!!Net profit: ", profitDecimalAdusted - estimatedFee); // remove later
                    // execute the transaction
                } else {                
                    console.log("Transaction not profitable, skipping..."); // remove later
                }


            } else {
                console.log("Health factor is above threshold, no need to liquidate..."); // remove later
            }
            // assuming we now have the right colalteral amount to liquidate, we need to simulate the transaction to see if it's profitable
            // if it is, we can execute the transaction


        }
    }
    
}


// ------------- HEALTH FACTOR CALCULTAION ----------------- //
function calculateHealthFactor(accumulatedDebtUSD, accumulatedCollateralUSD) {
    console.log("Calculating health factor..."); // remove later
    const healthFactor = (accumulatedCollateralUSD * HEALTH_FATCOR_SCALE) / accumulatedDebtUSD;

    console.log("Health Factor 8 Decimals: ", healthFactor); // remove later

    const healthFactorFormatted = Number(healthFactor) / 10**8;
    console.log("Health Factor (readable form): ", healthFactorFormatted); // remove later
    

    return healthFactor;// returns health factor with 2 decimals
}




// ------------- DEBT ASSETS FUNCTION ----------------- //
async function getDebtAssetsAmounts(reservesData, borrower) {
    console.log("// --------- ------------ ---------- Getting debt assets amounts for borrower: ", borrower); // remove later
    const debtAssetsAmountsAccumulated = []; // this will hold the debt amount of each debt asset to be aggregated later
    let debtAssetData;
    for (const reserveData of reservesData) {
        let debtAssetAmount;
        try {
            debtAssetAmount = await zkLendContract.get_user_debt_for_token(borrower, reserveData.reserve_address);
        } catch (error) {
            console.log("Error with debtAssetAmount: ", error); // remove later
            return 0;
        }
        
        if (debtAssetAmount < 1){
            continue;
        }

        debtAssetsAddressGLOBAL.push(reserveData.reserve_address);

        console.log("reserve address: ", reserveData.reserve_address); // remove later
        console.log("debt asset amount: ", debtAssetAmount); // remove later

        // we need to find out the total debt amount the reserve currency of the platform (USDC)
        const reservePrice = await oracleContract.get_price(reserveData.reserve_address);
        console.log("reserve price: ", reservePrice.price); // remove later

        // now I have the asset price, I can calculate the total debt amount in USD        
        const totalDebtAmount = debtAssetAmount * reservePrice.price;  // this gives me the scaled up debt value.
        console.log("total debt amount: ", totalDebtAmount); // remove later

        // oracle_price output has 8 decimals,  debtAssetAmount might have a different decimal factor
        const debtAssetDecimals = BigInt(reserveData.decimals); // get the decimals of the debt asset and conver it to a BigInt
        console.log("debt asset decimals: ", debtAssetDecimals); // remove later

        // adjust the total debt amount to 8 decimals
        const totalDebtAmountAdjusted8Decimals = totalDebtAmount / 10n**(debtAssetDecimals);
        console.log("total debt amount price adjusted 8 decimals: ", totalDebtAmountAdjusted8Decimals); // remove later

        // convert the totalDebtAmountAdjusted8Decimals to normal USD two decimal places without rounding then divide it by 10^8 to get the USD redeable form
        const totalDebtAmountHumanForm = Number(totalDebtAmountAdjusted8Decimals) / BASE_RESERVE_DECIMALS;
        console.log("total debt amount price adjusted USD (readable form): ", totalDebtAmountHumanForm); // remove later

        // object to hold the debt asset and the debt amount and decimals
        debtAssetData = {
            debtAsset: reserveData.reserve_address,
            debtAmount: totalDebtAmountAdjusted8Decimals,
            debtDecimals: debtAssetDecimals,
            price: reservePrice.price
        }

        // add the totalDebtAmountAdjusted8Decimals to the debtAssetsAmountsAccumulated array
        debtAssetsAmountsAccumulated.push(debtAssetData);
    }

    let accumulatedUSDTotalDebt8Decimals;

    // if more than one asset, we need to sum up all the debt amounts
    if (debtAssetsAmountsAccumulated.length > 1) {
        console.log("more than one asset, summing up all the debt amounts..."); // remove later
        // sum up all the values inside debtAssetsAmountsAccumulated to get the accumulated debt in USD
        accumulatedUSDTotalDebt8Decimals = debtAssetsAmountsAccumulated.reduce((acc, curr) => acc + curr.debtAmount, 0n);

        // find out what debt asset to repay, sort the debtAssetsAmountsAccumulated array by debtAmount and get the debtAsset (address) with the highest debt amount
        const debtAssetWithHighestDebtAmount = debtAssetsAmountsAccumulated.sort((a, b) => {
            if (a.debtAmount > b.debtAmount) return -1;
            if (a.debtAmount < b.debtAmount) return 1;
            return 0;
        })[0];

        // update debtAssetData accumulatedUSDTotalDebt8Decimals and the debtAssetWithHighestDebtAmount
        debtAssetData = {
            debtAsset: debtAssetWithHighestDebtAmount.debtAsset,
            debtAmount: accumulatedUSDTotalDebt8Decimals,
            debtDecimals: debtAssetWithHighestDebtAmount.debtDecimals,
            price: debtAssetWithHighestDebtAmount.price
        }        
    } else {
        accumulatedUSDTotalDebt8Decimals = debtAssetData.debtAmount;
    }

    console.log("accumulated TOTAL debt in USD: ", accumulatedUSDTotalDebt8Decimals); // remove later

    // console log the accumulated debt in USD (readable form)
    const accumulatedUSDTotalDebtHumanForm = Number(accumulatedUSDTotalDebt8Decimals) / BASE_RESERVE_DECIMALS;
    console.log("accumulated TOTAL debt in USD (readable form): ", accumulatedUSDTotalDebtHumanForm); // remove later
    
    return debtAssetData;
}


// ------------- COLLATERAL ASSETS FUNCTION ----------------- //
async function getCollateralAssetsAmounts(reservesData, borrower) {
    console.log("// --------- ------------ ---------- Getting collateral assets amounts for borrower: ", borrower); // remove later
    const collateralAssetsDataAccumulated = []; // this will hold the final collateral price of each collateral asset to be aggregated later
    let collateralAssetData;
    for (const reserveData of reservesData) {
        let isColateralEnabled;
        try{
            isColateralEnabled = await zkLendContract.is_collateral_enabled(borrower, reserveData.reserve_address);
        } catch (error) {
            console.log("Error with isColateral Enabled: ", error); // remove later
            return 0;
        }
        

        // if the borrower doesn't have the asset as collateral, skip
        if (!isColateralEnabled) { 
            continue;
        }

        // we need to find out the total collateral amount by querying the interest bearing token balance (zToken representing the collateral)
        const zTokenContract = await initialiseTokenContract(provider, reserveData.z_token_address);

        // get the balance of the zToken contract
        const zTokenBalance = await zTokenContract.balanceOf(borrower);

        // if the zToken balance is less than 1, skip
        if (zTokenBalance < 1) {
            continue;
        }

        console.log("getCollateralAssetsAmounts zToken address: ", reserveData.z_token_address); // remove later
        console.log("getCollateralAssetsAmounts zToken balance: ", zTokenBalance); // remove later
        //----- find the price of that token by calling the oracle
        const collateralPrice = await oracleContract.get_price(reserveData.reserve_address);
        console.log("getCollateralAssetsAmounts collateral price: ", collateralPrice.price); // remove later

        // calculate the collateral value
        const totalCollateralValue = zTokenBalance * collateralPrice.price;
        console.log("getCollateralAssetsAmounts total collateral value: ", totalCollateralValue); // remove later


        // adjust the total collateral value to 8 decimals
        const collateralValueAdjusted8Decimals = multiplyDecimals(collateralPrice.price, zTokenBalance, reserveData.decimals);
        console.log("getCollateralAssetsAmountstotal collateral value adjusted 8 decimals: ", collateralValueAdjusted8Decimals); // remove later

        // apply the collateral factor to get the risk-adjusted collateral value
        const collateralFactor = BigInt(reserveData.collateral_factor);
        const riskAdjustedCollateralValue = (collateralValueAdjusted8Decimals * collateralFactor) / SCALE_27;
        console.log("getCollateralAssetsAmounts risk-adjusted collateral value: ", riskAdjustedCollateralValue); // remove later

        // console log the colateral factor
        console.log("getCollateralAssetsAmounts collateral factor: ", collateralFactor); // remove later

        // save the collateral asset data in an object
        collateralAssetData = {
            collateralAssetZToken: reserveData.z_token_address,
            collateralAsset: reserveData.reserve_address,
            collateralAmountTotal: collateralValueAdjusted8Decimals,
            collateralAmountRA: riskAdjustedCollateralValue,
            collateralDecimals: reserveData.decimals,
            collateralFactor: adjustDecimals(collateralFactor, 27),
            liquidationBonus: adjustDecimals(BigInt(reserveData.liquidation_bonus), 27),
            price: collateralPrice.price
        }

        // convert the riskAdjustedCollateralValue to a readable USD form
        const totalCollateralValueHumanForm = Number(riskAdjustedCollateralValue) / BASE_RESERVE_DECIMALS;
        console.log("getCollateralAssetsAmounts risk-adjusted collateral value in USD (readable form): ", totalCollateralValueHumanForm); // remove later

        //----- add it to the collateralAssetsDataAccumulated array
        collateralAssetsDataAccumulated.push(collateralAssetData);
    }

    // if more than one asset, we need to sum up all the collateral values
    let accumulatedUSDTotalCollateral8Decimals;
    if (collateralAssetsDataAccumulated.length > 1) {
        return 0; // remove when formula for more has been found
        console.log("more than one asset, summing up all the collateral values..."); // remove later

        // sum up all the values inside collateralAssetsDataAccumulated to get the accumulated collateral in USD
        accumulatedUSDTotalCollateral8Decimals = collateralAssetsDataAccumulated.reduce((acc, curr) => acc + curr.collateralAmountRA, 0n);

        // for ccolalterlal asset, we need to find out the one with heiger liquidation bonus
        // we need to compare the liquidatio bonus and find out the one with the highest liquidation bonus
        const collateralAssetWithHighestLiquidationBonus = collateralAssetsDataAccumulated.sort((a, b) => {
            if (a.liquidationBonus > b.liquidationBonus) return -1;
            if (a.liquidationBonus < b.liquidationBonus) return 1;
            return 0;
        })[0];

        // update collateralAssetData with accumulatedUSDTotalCollateral8Decimals and the collateralAssetWithHighestCollateralFactor
        collateralAssetData = {
            collateralAssetZToken: collateralAssetWithHighestLiquidationBonus.collateralAssetZToken,
            collateralAsset: collateralAssetWithHighestLiquidationBonus.collateralAsset,
            collateralAmountRA: accumulatedUSDTotalCollateral8Decimals,
            collateralDecimals: collateralAssetWithHighestLiquidationBonus.collateralDecimals,
            collateralFactor: collateralAssetWithHighestLiquidationBonus.collateralFactor,
            liquidationBonus: collateralAssetWithHighestLiquidationBonus.liquidationBonus,
            price: collateralAssetWithHighestLiquidationBonus.price
        }

        // is the liquidation bonus tided up with heiger collateral factor?

    } else {
        accumulatedUSDTotalCollateral8Decimals = collateralAssetData.collateralAmountRA;
    }
    
    console.log("accumulated TOTAL collateral in USD: ", accumulatedUSDTotalCollateral8Decimals); // remove later
    // console log the accumulated collateral in USD (readable form)
    const accumulatedUSDTotalCollateralHumanForm = Number(accumulatedUSDTotalCollateral8Decimals) / BASE_RESERVE_DECIMALS;
    console.log("accumulated TOTAL collateral in USD (readable form): ", accumulatedUSDTotalCollateralHumanForm); // remove later
    return collateralAssetData;
}

async function main() {
    await findLiquidatableBorrowers(borrowers);
    // save the debtAssetsAddressGLOBAL to a file
    fs.writeFileSync('/mnt/d/Nethermind/starknet_zklend_liquidator_bot/debtAssetsAddressGLOBAL.json', JSON.stringify(debtAssetsAddressGLOBAL));
}



main();
