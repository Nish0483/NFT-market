# Ethereum NFT Project

This project implements an Ethereum-based Non-Fungible Token (NFT) contract with features such as fixed-price listings and auctions. The project is built using the Ethereum blockchain, Solidity for smart contracts, Hardhat for development, and Node.js for the backend.

## Prerequisites

Before running the project, make sure you have the following installed:

- Node.js
- npm (Node Package Manager)
- Hardhat (installed globally or as a project dependency)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/ethereum-nft-project.git
Install dependencies:

```bash
Copy code
cd ethereum-nft-project
npm install
```
Set up your environment variables:

Create a .env file in the root directory and add the following:


```
ALCHEMY_API_KEY=your-alchemy-api-key
PRIVATE_KEY=your-private-key
Run the Hardhat tests:
```

```
npx hardhat test
```
This will compile your contracts and run the test script.

# Contract Functionality
1. List an NFT for Fixed Price
To list an NFT for a fixed price, use the listForFixedPrice function.

2. List an NFT for Auction
To list an NFT for an auction, use the listForAuction function.

3. Retrieve Data of NFT Listed for Fixed Price
Use the getFixedListingData function to retrieve data of an NFT listed for a fixed price.

4. Retrieve Data of NFT Listed for Auction
Use the getAuctionData function to retrieve data of an NFT listed for an auction.

5. Retrieve Auction End Time for a Specific NFT ID
Use the getAuctionEndTime function to retrieve the auction end time for a specific NFT ID.

6. Retrieve Wallet Addresses of Bidders
Use the getBidders function to retrieve wallet addresses of bidders for a specific NFT ID.

7. Finalize Auction
To finalize an auction after the bid time expiration, use the finalizeAuction function.

8. Place Bid on Auction
To place a bid on an auction, use the placeBid function.

9. Mint ERC-721 NFTs
Use the mintNFT function to mint ERC-721 NFTs.

10. Buy Fixed Price NFT
To buy an NFT listed for a fixed price, use the buyFixedPriceNFT function.

11. Change Admin
To change the admin, use the changeAdmin function.
