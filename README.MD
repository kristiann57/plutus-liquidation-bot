
# Plutus: A Liquidation Bot Framework for StarkNet
Plutus is a liquidation bot written in JavaScript, designed to provide a robust framework for new MEV (Miner Extractable Value) searchers on StarkNet. This project aims to enable users to quickly set up and customize a fully functional liquidation bot.

The overarching goal of this repository is to support a wide range of lending protocols on StarkNet. Currently, Plutus is compatible with ZKLend, and efforts are underway to implement logic for additional protocols, such as Vesu and more. Therefore, facilitating the extraction of value to newcomers.

# Educational Resources
In addition to providing a powerful tool, this project aims to educate the community by sharing techniques and insights from the MEV space. The development process of Plutus is thoroughly documented in a series of articles, detailing each step and the underlying thought process:

[Liquidation Bot on ZKLend (Starknet) Part 1 — Introduction: who is borrowing?](https://link.medium.com/2T49dC5PRLb)      
[Liquidation Bot on ZKLend (Starknet) Part 2 — Are you liquidatable?](https://link.medium.com/c4sbO38PRLb)   
[Liquidation Bot on ZKLend (Starknet) Part 3— How much should I liquidate?](https://link.medium.com/XFrv1WcoGLb)   

# Setup Instructions
To run the bot, you need to configure the environment variables as follows:
Set up the .env file with the required information:

```
OZ_ACCOUNT_PRIVATE_KEY="YOUR_PRIVATE_KEY"
OZ_ACCOUNT_ADDRESS="YOUR_ACCOUNT_ADDRESS"
RPC_NODE_URL="YOUR_RPC_NODE_URL"
USDC_ACCOUNT_ADDRESS="0x53c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8"
USDT_ACCOUNT_ADDRESS="0x68f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8"
```

Get Historic Borrowers:
Retrieve all current and historic borrowers from the platform by running the script getInitialBorrowers.
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

# Assumptions
*The bot assumes your account is funded with sufficient debt assets to cover the debt portion of undercollateralized users. Without this, transaction and gas fee estimations will fail.
*The bot requires an RPC node without call limits, as the current design involves multiple calls that can quickly exceed limits, causing errors.

# Limitations
* Currently, the bot only works with users holding a single asset as collateral. Support for multiple assets is in development.
* Only ZKLend is supported at this time.

# Roadmap
- [ ] Release a rust implementation version for better performance and speed.  
- [ ] In-Memory Database: Implementing an in-memory database for faster data fetching, reducing the need for disk operations.  
- [ ] Event Subscriptions: Adding event subscription capabilities to respond to price changes dynamically, rather than relying on constant queries.  


Plutus aims to be an essential tool for MEV searchers, providing both practical functionality and valuable educational resources to the community.
