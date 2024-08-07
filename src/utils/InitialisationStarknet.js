// Import
import { RpcProvider,Contract, Account} from 'starknet';
import dotenv from 'dotenv';
dotenv.config();

export function initialiseProvider() {
  // initialise the provider
    const myNodeUrl = process.env.RPC_NODE_URL;
    const provider = new RpcProvider({ nodeUrl: `${myNodeUrl}` });

    return provider;
}

export async function instantiateZKLendContract(provider) {
  // ZKLend Contract address
  const zkLendContratcAddress = '0x04c0a5193d58f74fbace4b74dcf65481e734ed1714121bdc571da345540efa05'
  // read abi of ZKLend contract
  const { abi: zkLendABI } = await provider.getClassAt(zkLendContratcAddress);
  if (zkLendABI === undefined) {
    throw new Error('no abi.');
  }

  const zkLendContract = new Contract(zkLendABI, zkLendContratcAddress, provider);

  console.log("ZKLend contract instantiated");
  return zkLendContract;
}

export async function initialiseOracleContract(provider) {
  // Oracle Contract address
  const oracleContratcAddress = '0x023fb3afbff2c0e3399f896dcf7400acf1a161941cfb386e34a123f228c62832'
  // read abi of Oracle contract
  const { abi: oracleABI } = await provider.getClassAt(oracleContratcAddress);
  if (oracleABI === undefined) {
    throw new Error('no abi.');
  }

  const oracleContract = new Contract(oracleABI, oracleContratcAddress, provider);

  return oracleContract;
}

export async function initialiseTokenContract(provider, tokenContratcAddress) {
  // ZToken Contract address
  // read abi of ZToken contract
  const { abi: tokenABI } = await provider.getClassAt(tokenContratcAddress);
  if (tokenABI === undefined) {
    throw new Error('no abi.');
  }

  const zTokenContract = new Contract(tokenABI, tokenContratcAddress, provider);

  return zTokenContract;
}

// ------------- INITIALISE ACCOUNT ----------------- //
// connect your account. To adapt to your own account:

export function initialiseAccount() {
  const provider = initialiseProvider();
  const privateKey = process.env.OZ_ACCOUNT_PRIVATE_KEY;
  const accountAddress = process.env.OZ_ACCOUNT_ADDRESS;

  const account = new Account(provider, accountAddress, privateKey);
  console.log("Account 0 connected..."); // remove later
  console.log("Account 0 address: ", accountAddress); // remove later

  return account;
}

// async function test () {
//   const oracle = await initialiseOracleContract(initialiseProvider());
//   const price = await oracle.get_price("0x6d8fa671ef84f791b7f601fa79fea8f6ceb70b5fa84189e3159d532162efc21");
//   console.log(price); 
// }

// test();
