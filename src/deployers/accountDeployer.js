import { initialiseProvider} from '../utils/InitialiseProviderContract.js';
import { Account, constants, ec, json, stark, RpcProvider, hash, CallData } from 'starknet';
const provider = initialiseProvider();
// connect provider (Mainnet or Sepolia)

// new Open Zeppelin account v0.8.1
// Generate public and private key pair.
const privateKey = stark.randomAddress();
console.log('New OZ account:\nprivateKey=', privateKey);
const starkKeyPub = ec.starkCurve.getStarkKey(privateKey);
console.log('publicKey=', starkKeyPub);

// const OZaccountClassHash = '0x061dac032f228abef9c6626f995015233097ae253a7f72d68552db02f2971b8f';
const OZaccountClassHash = '0x00e2eb8f5672af4e6a4e8a8f1b44989685e668489b0a25437733756c5a34a1d6';


// Calculate future address of the account
const OZaccountConstructorCallData = CallData.compile({ publicKey: starkKeyPub });
const OZcontractAddress = hash.calculateContractAddressFromHash(
  starkKeyPub,
  OZaccountClassHash,
  OZaccountConstructorCallData,
  0
);
console.log('Precalculated account address=', OZcontractAddress);
// console log number of characters in the address
console.log('Number of characters in the address=', OZcontractAddress.length);
console.log('Number of characters in the address=', "0x01cf4d57ba01109f018dec3ea079a38fc08b789e03de4df937ddb9e8a0ff853a".length);

const OZaccount = new Account(provider, OZcontractAddress, privateKey);

const { transaction_hash, contract_address } = await OZaccount.deployAccount({
  classHash: OZaccountClassHash,
  constructorCalldata: OZaccountConstructorCallData,
  addressSalt: starkKeyPub,
});

await provider.waitForTransaction(transaction_hash);
console.log('✅ New OpenZeppelin account created.\n   address =', contract_address);
