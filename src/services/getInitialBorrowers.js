// Import
import { RpcProvider, num, hash} from 'starknet';
// //import zkLendABI

import fs from 'fs';


// initialise the provider
const myNodeUrl = 'http://homelab.cicerolabs.xyz:9545';
const provider = new RpcProvider({ nodeUrl: `${myNodeUrl}` });


// Contract address
const zkLendContratcAddress = '0x04c0a5193d58f74fbace4b74dcf65481e734ed1714121bdc571da345540efa05'
//const zkLendContract = new Contract(provider, zkLendContratcAddress, zkLendABI);


// Fetch the events and extract the unique borrowers addresses
async function getBorrowersByEvents() {
    // get the last block number
    let block = await provider.getBlock('latest');
    
    // key filter
    const keyFilter = [[num.toHex(hash.starknetKeccak('Borrowing'))]];
    
    // define the continuation token and the array to store all the events
    let continuationToken = null;
    const uniqueAddresses = new Set();
    const chunkSize = 100; // Number of events to fetch in each request

    // Get the events by calling the getEvents method of the provider
    while (true) {
        const response = await provider.getEvents({
        from_block: { block_number: block.block_number - 5500 },
        to_block: { block_number: block.block_number },
        address: zkLendContratcAddress,
        keys: keyFilter, // Filter by Borrowing event key
        chunk_size: chunkSize,
        continuation_token: continuationToken
        });

        response.events.forEach(event => {
            uniqueAddresses.add(event.data[0]);
            console.log(event.data[0]); // log the address
        });

        if (response.continuation_token) {
        continuationToken = response.continuation_token;
        } else {
        break; // Exit the loop when there are no more events
        }
    }

    // return the unique addresses array
    return Array.from(uniqueAddresses);
}

// 

async function main() {
    const borrowers = await getBorrowersByEvents();

    // Save the borrowers to a JSON file
    fs.writeFileSync('/mnt/d/Nethermind/starknet_zklend_liquidator_bot/uniqueBorrowerAddresses.json', JSON.stringify(borrowers, null, 2));

    
}

await main();

// save only active borrowers in  redis address server
// get is liquidatable?
