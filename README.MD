![Alt text](https://res.cloudinary.com/de8kng0rk/image/upload/v1723038935/lqmxdqbt0wng48avzo7n.jpg)
# Plutus: A Liquidation Bot Framework for StarkNet (Beta)
Plutus is a liquidation bot written in JavaScript, designed to provide a robust framework for new MEV searchers on StarkNet. This project aims to enable users to quickly set up and customize a fully functional liquidation bot.

The overarching goal of this repository is to support a wide range of lending protocols on StarkNet. Currently, Plutus is compatible with ZKLend, and efforts are underway to implement logic for additional protocols, such as Vesu and more. Therefore, facilitating the extraction of value to newcomers.

# Educational Resources
In addition to providing a powerful tool, this project aims to educate the community by sharing techniques and insights from the MEV space. The development process of Plutus is thoroughly documented in a series of articles, detailing each step and the underlying thought process:

[Liquidation Bot on ZKLend (Starknet) Part 1 — Introduction: who is borrowing?](https://link.medium.com/2T49dC5PRLb)      
[Liquidation Bot on ZKLend (Starknet) Part 2 — Are you liquidatable?](https://link.medium.com/c4sbO38PRLb)   
[Liquidation Bot on ZKLend (Starknet) Part 3— How much should I liquidate?](https://link.medium.com/XFrv1WcoGLb)   

# Setup Instructions
Install dependencies:
```
npm install
```

To run the bot, you need to configure the environment variables as follows:
Set up the .env file with the required information:

```
OZ_ACCOUNT_PRIVATE_KEY="YOUR_PRIVATE_KEY"
OZ_ACCOUNT_ADDRESS="YOUR_ACCOUNT_ADDRESS"
RPC_NODE_URL="YOUR_RPC_NODE_URL"
USDC_ACCOUNT_ADDRESS="0x53c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8"
USDT_ACCOUNT_ADDRESS="0x68f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8"
```
_I have added the USDT and USDC addresses, as these are the tokens I funded my bot with. The bot performs several checks after calculating the debt amount. If the debt asset is not one of the tokens I funded the bot with, it will not execute the transaction and will move on to the next borrower._

Get Historic Borrowers:
Retrieve all current and historic borrowers from the platform by running the script getInitialBorrowers. (Be aware this process might take some time)
```
node ./src/services/getInitialBorrowers.js
```

Filter Active Borrowers:
Identify and filter out non-active borrowers using the getOnlyActiveBorrowers script.
```
node ./src/services/getOnlyActiveBorrowers.js
```

Save Reserves Data:
Capture all available reserves on the ZKLend platform by running the getReservesAssetsData script.
```
node ./src/services/getReservesAssetsData.js
```

# Run The Bot
```
node ./src/bot/bot.js
```

# Example Files
I have included a few example files for those who prefer not to wait to gather the information mentioned above. While I still recommend collecting all borrower data and filtering it, you can use the following files for testing purposes:

* onlyActiveBorrowers.json
* uniqueBorrowerAddresses.json
* reservesData.json

# Assumptions
* The bot assumes your account is funded with sufficient debt assets to cover the debt portion of undercollateralized users. Without this, transaction and gas fee estimations will fail.
* The bot requires an RPC node without call limits, as the current design involves multiple calls that can quickly exceed limits, causing errors.
* The bot assumes you have approved the zkLend markets contract to spend the required assets for the liquidation.

# Limitations
* This early version, written in JavaScript, currently queries the blockchain to check if a given borrower's address is undercollateralized. If the borrower is undercollateralized, the bot calculates the amount that should be liquidated. You might be lucky and perform a profitable liquidation, but this version is primarily designed for educational purposes rather than performance optimization. Future updates will focus on improving efficiency.
* At this time, only ZKLend is supported.

# Comment Logs
This bot is designed to educate users on how liquidations are performed in various StarkNet lending protocols. The code includes extensive comments logs to help newcomers understand how it functions and what information it retrieves. If you wish to disable these logs, you'll need to do so manually for now.

# Expected Output:


# Known Issues
Please note that this is a beta version, so errors and bugs may occur. The most common errors you might encounter include:

* "sub_u256_overflow": This error likely indicates that you need to authorize the lending protocol to take the debt you are repaying in the liquidator.
* "MK_INVALID_LIQUIDATION": This error means that the liquidation amount leaves the borrower overcollateralized (health factor above 1). Although this shouldn't happen—since algebra is used to calculate the correct amount—you might encounter this error occasionally. It seems to occur when the collateral asset and debt asset are the same. I'll investigate this issue further, as it's an unusual behavior. Additionally, this could happen if the simulation is performed on a later block than when the information was originally fetched, meaning the liquidation opportunity may no longer be available. I'll investigate this issue further as it's an unusual behavior.
* Negative liquidation amount: This is an uncommon issue, but sometimes the calculated liquidation amount may result in a negative value. This is currently under investigation.


# Roadmap

- [ ] Optimize direct blockchain querying
- [ ] Add multi Collateral/debt asset capabilities
- [ ] Release a rust implementation version for better performance and speed.  
- [ ] In-Memory Database: Implementing an in-memory database for faster data fetching, reducing the need for disk operations.  
- [ ] Event Subscriptions: Adding event subscription capabilities to respond to price changes dynamically, rather than relying on constant queries.  


Plutus aims to be an essential tool for MEV searchers, providing both practical functionality and valuable educational resources to the community.
