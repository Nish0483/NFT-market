
/*kindly use your private key and alchemy api key in the .env in root folder */
/*example : ALCHEMY_API_KEY=A-Zoy_6....72i
PRIVATE_KEY=6525323214e2.....5af20a562680c68e43a9e78
*/
const { ethers } = require('ethers');
const { providers } = require('ethers');
require('dotenv').config();

const alchemyApiKey = process.env.ALCHEMY_API_KEY;
const privateKey = process.env.PRIVATE_KEY;
const contractAddress = '0xA546C2dF062ade1740c24aA5Cdb7E80C42A1C46c';
const contractABI = require('./artifacts/contracts/NFT.json');

const provider = new providers.JsonRpcProvider(`https://eth-goerli.alchemyapi.io/v2/${alchemyApiKey}`);
const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractAddress, contractABI, wallet);




async function mintNFT(toAddress, tokenId) {
    try {
        // Mint NFT
        const tx = await contract.mintNFT(toAddress, tokenId);

        // Wait for the transaction to be mined
        await tx.wait();

        console.log(`NFT minted successfully. Token ID: ${tokenId}, Recipient: ${toAddress}`);
    } catch (error) {
        if (error.message.includes("Caller is not a minter")) {
            console.error('failed: caller doesnt have MINTER_ROLE');
        } else {
            console.error('failed: ID already minted');
        }
    }
}



async function listNFTForFixedPrice(tokenId, price) {
    try {
        // Call the listForFixedPrice function
        const tx = await contract.listForFixedPrice(tokenId, price);

        // Wait for the transaction to be mined
        const receipt = await tx.wait();

        console.log(`NFT listed for fixed price. Transaction hash: ${receipt.transactionHash}`);
         } catch (error) {
        if (error.message.includes("Caller is not the owner of the NFT")) {
            console.error('failed: You can only list NFT(id) you own');
        } else {
            console.error('Error listing NFT for fixed price:', error);
        }
   }
}



// 2. List an NFT for auction
async function listNFTForAuction(tokenId, durationInSeconds) {
    try {
        // Call the listForAuction function
        const tx = await contract.listForAuction(tokenId, durationInSeconds);

        // Wait for the transaction to be mined
        const receipt = await tx.wait();

        console.log(`NFT listed for auction. Transaction hash: ${receipt.transactionHash}`);
    }   catch (error) {
        if (error.message.includes("Caller is not the owner of the NFT")) {
            console.error('failed: You can only list NFT(id) you own');
        } else {
            console.error('Error listing NFT for Auction:', error);
        }
   }
}


// 3. Retrieve data of NFT listed for fixed price
async function getFixedListingData(tokenId) {
    try {
        // Call the getFixedListingData function
        const fixedListingData = await contract.getFixedListingData(tokenId);
        if(fixedListingData.seller == 0x0000000000000000000000000000000000000000){
            console.log('This NFT id is not listed for fixed price');
            return;
        }
        console.log('Fixed Price Listing Data:\n');
        console.log(`Token ID: ${fixedListingData.tokenId}`);
        console.log(`Seller: ${fixedListingData.seller}`);
        console.log(`Price: ${ethers.utils.formatEther(fixedListingData.price)} ETH`);
    } catch (error) {
        console.error('Error retrieving fixed price listing data:', error);
    }
}



// 4. Retrieve data of NFT listed for auction
async function getAuctionData(tokenId) {
    try {
        // Call the getAuctionData function
        const auctionData = await contract.getAuctionData(tokenId);
        if(auctionData.startTime == 0){
            console.log('This NFT id is not listed for auction');
            return;
        }
        console.log('Auction Data:\n');
        console.log(`highestBid: ${ethers.utils.formatEther(auctionData.highestBid)} ETH`);
        console.log(`highestBidder: ${auctionData.highestBidder}`);
        console.log(`Start Time: ${auctionData.startTime}`);
        console.log(`End Time: ${auctionData.endTime}`);
    } catch (error) {
        console.error('Error retrieving auction data:', error);
    }
}



// 5. Retrieve the auction end time for a specific NFT ID
async function getAuctionEndTime(tokenId) {
    try {
        // Call the getAuctionEndTime function
        const endTime = await contract.getAuctionEndTime(tokenId);

        console.log('Auction End Time:', endTime.toNumber());
    } catch (error) {
        console.error('Error retrieving auction end time:', error);
    }
}

// 6. Retrieve wallet addresses of bidders for a specific NFT ID
async function getBidders(tokenId) {
    try {
        // Call the getBidders function
        const bidders = await contract.getBidders(tokenId);

        console.log('Bidders:', bidders);
    } catch (error) {
        console.error('Error retrieving bidders:', error);
    }
}






async function placeBid(tokenId, bidAmount) {
    try {
        // Call the placeBid function on the smart contract
        const transaction = await contract.placeBid(tokenId, { value: bidAmount });
        await transaction.wait();

        console.log(`Bid placed successfully for NFT ${tokenId} with amount ${bidAmount/10**18} ETH`);
    } catch (error){
      if (error.message.includes("Bid amount must be")) {
        console.error('failed: please bid more than the current highest bid');
    } else {
        console.error('Error listing NFT for Auction:', error);
    }
}

}


async function buyFixedPriceNFT(tokenId, price) {
    try {
        // Call the buyFixedPriceNFT function on the smart contract
        const transaction = await contract.buyFixedPriceNFT(tokenId, { value: price });
        await transaction.wait();

        console.log(`NFT ${tokenId} purchased successfully for ${price} ETH`);
    } catch (error) {
        console.error('Error buying NFT:', error);
    }
}



/*change values here comment and un comment as per need*/
/////////////////////////////////////////////////////////////////////////////////

//  mintNFT('0x5dBA78D25000c19E543E7f628eB42776b1498ff7', 2);  //address, tokenId

// listNFTForFixedPrice(0, ethers.utils.parseEther('0.001'));  //tokenId, price in ETH

//  listNFTForAuction(1, 3600);  //tokenId, duration in seconds

//  getFixedListingData(0); //tokenId

//  getAuctionData(1); //tokenId

// getAuctionEndTime(1);// tokenId

// getBidders(1); //tokenId

// placeBid(1, ethers.utils.parseEther('0.00101')); //tokenId, bidAmount

// buyFixedPriceNFT(1, ethers.utils.parseEther('0.001')); //tokenId