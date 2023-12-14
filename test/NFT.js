// test/nft-test.js
const { expect } = require("chai");

describe("NFT Contract", function () {
  let NFT;
  let nft;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    NFT = await ethers.getContractFactory("NFT");
    nft = await NFT.deploy();
    await nft.deployed();
  });

  it("Should mint an NFT and list it for fixed price", async function () {
    // Mint an NFT
    await nft.connect(owner).mintNFT(addr1.address, 1);

    // List the NFT for fixed price
    await nft.connect(addr1).listForFixedPrice(1, ethers.utils.parseEther("1"));

    // Get fixed price listing data
    const fixedListingData = await nft.getFixedListingData(1);

    expect(fixedListingData.tokenId).to.equal(1);
    expect(fixedListingData.seller).to.equal(addr1.address);
    expect(fixedListingData.price).to.equal(ethers.utils.parseEther("1"));
  });

  it("Should mint an NFT and list it for auction", async function () {
    // Mint an NFT
    await nft.connect(owner).mintNFT(addr1.address, 2);

    // List the NFT for auction
    await nft.connect(addr1).listForAuction(2, 86400); // 1 day duration

    // Get auction data
    const auctionData = await nft.getAuctionData(2);

    expect(auctionData.startTime).to.not.equal(0);
    expect(auctionData.endTime).to.not.equal(0);
    expect(auctionData.highestBidder).to.equal(address0);
    expect(auctionData.highestBid).to.equal(0);
  });

  it("Should place a bid on an auction", async function () {
    // Mint an NFT
    await nft.connect(owner).mintNFT(addr1.address, 3);

    // List the NFT for auction
    await nft.connect(addr1).listForAuction(3, 86400); // 1 day duration

    // Place a bid on the auction
    await nft.connect(addr2).placeBid(3, { value: ethers.utils.parseEther("0.5") });

    // Get auction data
    const auctionData = await nft.getAuctionData(3);

    expect(auctionData.highestBidder).to.equal(addr2.address);
    expect(auctionData.highestBid).to.equal(ethers.utils.parseEther("0.5"));
  });
});
