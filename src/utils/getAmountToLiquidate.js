// import { adjustDecimals, convertFromTo } from "./adjustDecimals";

// 10^8 as BigInt for 8 decimal places of precision
const SCALE = 10n ** 8n;

export function getAmountToLiquidate(C, f, D, CP, DP, b, targetHF) {
    // logs
    console.log("getting amount to liquidate...");
    console.log("Collateral Value (C):", C , "formatBigInt(C):", formatBigInt(C));
    console.log("Collateral Factor (f):", f , "formatBigInt(f):", formatBigInt(f));
    console.log("Debt Value (D):", D , "formatBigInt(D):", formatBigInt(D));
    console.log("Collateral Price (CP):", CP , "formatBigInt(CP):", formatBigInt(CP));
    console.log("Debt Price (DP):", DP , "formatBigInt(DP):", formatBigInt(DP));
    console.log("Liquidation Bonus (b):", b, "formatBigInt(b):", formatBigInt(b));
    console.log("Target Health Factor (HF):", targetHF , "formatBigInt(targetHF):", formatBigInt(targetHF));
    
    const B = SCALE + b;

    console.log("Step 1: Calculate L (in USD)");
    console.log(`L = (${targetHF}D - Cf) / (${targetHF} - f(1 + b))`);
    console.log(`L = (${targetHF}*${D} - ${C}*${f}) / (${targetHF} - ${f}*${B})`);
    
    const numeratorL = targetHF * D - C * f;
    const denominatorL = targetHF * SCALE - f * B;
    console.log(`L = ${numeratorL} / ${denominatorL}`);

    // bool to check if liquidation amount in debt tokens > current debt in tokens
    let isLiquidationGreaterTHanDebt = false;
    
    let L_usd = (numeratorL * SCALE) / denominatorL;
    // if liquiation amount debt tokens > current debt in tokens =>liquidation amount in debt tokens is equal to current debt - full liquidation (liquidate all debt)
    // as ZKLEND requires user to be undercollateralized after liquidation, we can't liquidate more than the current debt
    // so liquidation amount in debt tokens is equal to (current debt amount - 1% of current debt amount)
    // also Liquidation in USD is equal to current debt in USD
    if (L_usd > D) {
        L_usd = get99Percent(D);
        isLiquidationGreaterTHanDebt = true;
    }
    //liquidation amount in debt tokens
    let liquidationAmountInDebtTokens = (L_usd * SCALE) / DP;

    const L_tokens = (L_usd * SCALE) / CP;

    console.log(`L (USD) = ${formatBigInt(L_usd)} (Raw: ${L_usd})`);
    console.log(`L (tokens) = ${formatBigInt(L_tokens)} (Raw: ${L_tokens})`);


    console.log("\nStep 2: Calculate current HF");
    const currentHF = ((C * f ) * SCALE) / D;
    console.log(`Current HF = (C * f) / D = (${C} * ${f}) / ${D} = ${formatBigInt(currentHF)} (Raw: ${currentHF})`);

    console.log("\nStep 3: Calculate new collateral and debt values");
    const collateralRemoved = (L_usd * B) / SCALE;  // Divide by SCALE to maintain correct scaling
    const newC = C - collateralRemoved;
    const newD = D - L_usd;
    console.log(`Collateral removed = L_usd * (1 + b) = ${formatBigInt(L_usd)} * ${formatBigInt(B)} = ${formatBigInt(collateralRemoved)} (Raw: ${collateralRemoved})`);
    console.log(`New Collateral Value (new_C) = C - collateral_removed = ${formatBigInt(C)} - ${formatBigInt(collateralRemoved)} = ${formatBigInt(newC)} (Raw: ${newC})`);
    console.log(`New Debt Value (new_D) = D - L_usd = ${formatBigInt(D)} - ${formatBigInt(L_usd)} = ${formatBigInt(newD)} (Raw: ${newD})`);

    console.log("\nStep 4: Calculate HF after liquidation");
    const HF = (newC * f ) / newD;  // Multiply by SCALE to maintain precision
    console.log(`HF = (new_C * f) / new_D = (${formatBigInt(newC)} * ${formatBigInt(f)}) / ${formatBigInt(newD)} = ${formatBigInt(HF)} (Raw: ${HF})`);

    console.log("\nStep 5: Liquidator's Bonus Calculation");
    const bonusTokens = (L_tokens * b) / SCALE;  // Collateral tokens Divide by SCALE to maintain correct scaling
    const bonusUsd = (L_usd * b) / SCALE;
    const profitInUSD = (L_tokens * b * CP / SCALE / SCALE) - (L_tokens * CP / SCALE/ SCALE) ;
    console.log(`Liquidator receives extra tokens: ${formatBigInt(bonusTokens)} (Raw: ${bonusTokens})`);
    console.log(`Bonus value in USD: ${formatBigInt(bonusUsd)} (Raw: ${bonusUsd})`);

    

    
    console.log("\nFinal Results:");
    console.log(`Liquidation amount (L) in USD = ${formatBigInt(L_usd)} (Raw: ${L_usd})`);
    console.log(`Liquidation amount (L) in collateral tokens = ${formatBigInt(L_tokens)} (Raw: ${L_tokens})`);
    // liquidation amount in debt 
    console.log(`Liquidation amount (L) in debt tokens = ${formatBigInt(liquidationAmountInDebtTokens)} (Raw: ${liquidationAmountInDebtTokens})`);
    console.log(`Liquidator receives total tokens: ${formatBigInt((L_tokens * B) / SCALE)} (Raw: ${(L_tokens * B) / SCALE})`);
    console.log(`Liquidator receives total USD (liquidation + B): ${formatBigInt(L_tokens * B * CP / SCALE / SCALE)} (Raw: ${L_tokens * B * CP / SCALE /SCALE})`);
    
    console.log(`Profit in USD: ${formatBigInt(profitInUSD)} (Raw: ${profitInUSD})`);
    console.log(`Current HF before liquidation = ${formatBigInt(currentHF)} (Raw: ${currentHF})`);
    //isLiquidationGreaterTHanDebt = true? don#t pay attention to the new HF value as liquidation amount = the current debt amount 
    if (isLiquidationGreaterTHanDebt) {
        console.log("Liquidation amount is greater than current debt amount, so new HF is not calculated correcly, ignore it");
    }
    console.log(`Health Factor after liquidation (HF) = ${formatBigInt(HF)} (Raw: ${HF})`);
    


    // return liquidation amount in debt tokens and profit in USD
    return {
        liquidationAmountInDebtTokens: liquidationAmountInDebtTokens,
        profitInUSD: profitInUSD
    };
}

function formatBigInt(value) {
    return (Number(value) / Number(SCALE)).toFixed(8);
}

// function to return 99% of a given bigInt value
function get99Percent(bigIntValue) {
    return (bigIntValue * 99n) / 100n;
}

function selectCollateralForLiquidation(collateralAssets, debtToLiquidate) {
    // Sort collateral assets by liquidation bonus
    const sortedAssets = collateralAssets.sort((a, b) => b.liquidationBonus - a.liquidationBonus);
    
    let remainingValueNeeded = debtToLiquidate * (1 + sortedAssets[0].liquidationBonus);
    let selectedCollateral = [];

    for (const asset of sortedAssets) {
        const assetValue = asset.balance * asset.price;
        
        if (assetValue >= remainingValueNeeded) {
            // This asset is sufficient
            const amountNeeded = remainingValueNeeded / asset.price;
            selectedCollateral.push({
                asset: asset.symbol,
                amount: amountNeeded
            });
            break;
        } else {
            // Use entire balance of this asset
            selectedCollateral.push({
                asset: asset.symbol,
                amount: asset.balance
            });
            remainingValueNeeded -= assetValue;
        }

        if (remainingValueNeeded <= 0) break;
    }

    return selectedCollateral;
}

// // Test case
// console.log("--------------------Test Case: C = 30000, f = 0.6, D = 18536, CP = 29997, DP = 1 b = 0.15");
// getAmountToLiquidate(3000000000000n, 60000000n, 1853600000000n, 2999700000000n, 100000000n,15000000n, SCALE);

// // Test case
// console.log("--------------------Test Case: C = 30000, f = 0.6, D = 18536, CP = 29997, DP = 1 b = 0.15");
// getAmountToLiquidate(3000000000000n, 60000000n, 1853600000000n, 2999700000000n, 100000000n,15000000n, SCALE);

// // Test case
// console.log("--------------------Test Case: C = 30000, f = 0.6, D = 18536, CP = 29997, DP = 1 b = 0.15");
// const amount = getAmountToLiquidate(400000000000n, 50000000n, 225000000000n, 4000000000n, 10000000000n,20000000n, SCALE);

// getAmountToLiquidate(5123955790n, 5134709533n, 1853600000000n, 2999700000000n, 15000000n, 99999999n);

// Alice status now:
    //   Collateral value:
    //     100 TST_A - collateral
    //       = 100 * 50 * 0.5
    //       = 2500 USD
    //   Collateral required:
    //     22.5 TST_B - debt
    //       = 22.5 * 100
    //       = 2250 USD

    // Change TST_A price to 40 USD
    //   Collateral value:
    //     100 TST_A
    //       = 100 * 40 * 0.5
    //       = 2000 USD
    //   Collateral required: 2250 USD


// Collateral withdrawn:
//     x * 100 / 40 * 1.2 TST_A
//   Collateral value after:
//     (100 - x * 100 / 40 * 1.2) TST_A
//       = (100 - x * 100 / 40 * 1.2) * 40 * 0.5
//   Collateral required:
//     (22.5 - x) TST_B
//       = (22.5 - x) * 100
//   Collateral value after = Collateral required
    //     Solve for x





// x * 30000 / 29997 * 1.15 

// (30000 - x * 29997 / 1 * 1.15) * 29997 * 0.6
// (18536 - x) * 1







// function detailedCalculation(C, f, D, P, b, targetHF = 0.99999) {
//     // Convert inputs to numbers to ensure proper calculation
//     C = Number(C);
//     f = Number(f);
//     D = Number(D);
//     P = Number(P);
//     b = Number(b);
//     const B = 1 + b;

//     console.log("Step 1: Calculate L (in USD)");
//     console.log(`L = (${targetHF}D - Cf) / (${targetHF} - f(1 + b))`);
//     console.log(`L = (${targetHF}*${D} - ${C}*${f}) / (${targetHF} - ${f}*${B})`);
    
//     const numeratorL = targetHF * D - C * f;
//     const denominatorL = targetHF - f * B;
//     console.log(`L = ${numeratorL} / ${denominatorL}`);
    
//     const L_usd = numeratorL / denominatorL;
//     const L_tokens = L_usd / P;
//     console.log(`L (USD) = ${L_usd.toFixed(6)}`);
//     console.log(`L (tokens) = ${L_tokens.toFixed(6)}`);

//     console.log("\nStep 2: Calculate current HF");
//     const currentHF = (C * f) / D;
//     console.log(`Current HF = (C * f) / D = (${C} * ${f}) / ${D} = ${currentHF.toFixed(6)}`);

//     console.log("\nStep 3: Calculate new collateral and debt values");
//     const collateralRemoved = L_usd * B;
//     const newC = C - collateralRemoved;
//     const newD = D - L_usd;
//     console.log(`Collateral removed = L_usd * (1 + b) = ${L_usd.toFixed(6)} * ${B} = ${collateralRemoved.toFixed(6)}`);
//     console.log(`New Collateral Value (new_C) = C - collateral_removed = ${C} - ${collateralRemoved.toFixed(6)} = ${newC.toFixed(6)}`);
//     console.log(`New Debt Value (new_D) = D - L_usd = ${D} - ${L_usd.toFixed(6)} = ${newD.toFixed(6)}`);

//     console.log("\nStep 4: Calculate HF after liquidation");
//     const HF = (newC * f) / newD;
//     console.log(`HF = (new_C * f) / new_D = (${newC.toFixed(6)} * ${f}) / ${newD.toFixed(6)} = ${HF.toFixed(6)}`);

//     console.log("\nStep 5: Liquidator's Bonus Calculation");
//     const bonusTokens = L_tokens * b;
//     const bonusUsd = L_usd * b;
//     console.log(`Liquidator receives extra tokens: ${bonusTokens.toFixed(6)}`);
//     console.log(`Bonus value in USD: ${bonusUsd.toFixed(6)}`);

//     console.log("\nFinal Results:");
//     console.log(`Liquidation amount (L) in USD = ${L_usd.toFixed(6)}`);
//     console.log(`Liquidation amount (L) in tokens = ${L_tokens.toFixed(6)}`);
//     console.log(`Liquidator receives total tokens: ${(L_tokens * B).toFixed(6)}`);
//     console.log(`Current HF before liquidation = ${currentHF.toFixed(6)}`);
//     console.log(`Health Factor after liquidation (HF) = ${HF.toFixed(6)}`);
//     console.log(`Difference of HF from target: ${Math.abs(targetHF - HF).toFixed(12)}`);
// }

// // Test case
// console.log("Test Case: C = 30000, f = 0.6, D = 18536, P = 29997, b = 0.15");
// detailedCalculation(30000, 0.6, 18536, 29997, 0.15);



// test get99Percent
// console.log(get99Percent(100000000000n)); // 99000000000n
// console.log(get99Percent(50000000n)); //
// console.log(get99Percent(789290021n)); //