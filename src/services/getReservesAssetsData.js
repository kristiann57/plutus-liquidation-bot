import { initialiseProvider, instantiateZKLendContract } from '../utils/InitialisationStarknet.js';
import {  num, hash} from 'starknet';
import fs from 'fs';

// initialise the provider and contract
const provider = initialiseProvider();
const zkLendContract = await instantiateZKLendContract(provider);

const zkLendContratcAddress = zkLendContract.address;


// we first need to fo through all of the new reserves events and get the assets accepted in the platform
// then we need to get the reserves data for each of the assets

async function getReservesAddressesByEvents() {
    // get the last block number
    let block = await provider.getBlock('latest');
    
    // key filter
    const keyFilter = [[num.toHex(hash.starknetKeccak('NewReserve'))]];
    
    // define the continuation token and the array to store all the events
    let continuationToken = null;
    const uniqueReservesAddresses = new Set();
    const chunkSize = 1000; // Number of events to fetch in each request

    // Get the events by calling the getEvents method of the provider
    while (true) {
        const response = await provider.getEvents({
        from_block: { block_number: 0 },
        to_block: { block_number: block.block_number },
        address: zkLendContratcAddress,
        keys: keyFilter, // Filter by Borrowing event key
        chunk_size: chunkSize,
        continuation_token: continuationToken
        });

        response.events.forEach(event => {
            uniqueReservesAddresses.add(event.data[0]);
            console.log(event.data[0]); // log the address
        });

        if (response.continuation_token) {
        continuationToken = response.continuation_token;
        } else {
        break; // Exit the loop when there are no more events
        }
    }

    // return the unique addresses array
    return Array.from(uniqueReservesAddresses);
}

// with the reserves assets addresses, we can now get the reserves data, let's loop through them and query the contract
async function getReservesData(reservesAddresses) {
    const reservesData = [];
    for (const reserveAddress of reservesAddresses) {
        const reserveData = await zkLendContract.get_reserve_data(reserveAddress);
        // append the reserve address to the reserve data
        reserveData.reserve_address = reserveAddress;
        reservesData.push(reserveData);
    }
    return reservesData;
}

// serialise the bigInt data to string before saving it to a JSON file
// Custom replacer function to handle BigInt serialization
function replacer(key, value) {
    if (typeof value === 'bigint') {
        if (key === 'z_token_address') {
            return '0x' + value.toString(16);
        }
        return value.toString();
    }
    return value;
}

async function main() {
    const reservesAddresses = await getReservesAddressesByEvents();
    console.log(reservesAddresses);
    const reservesData = await getReservesData(reservesAddresses);
    console.log(reservesData);
    // save the data to a JSON file
    fs.writeFileSync('/mnt/d/Nethermind/starknet_zklend_liquidator_bot/reservesData.json', JSON.stringify(reservesData, replacer, 2));
}

main();