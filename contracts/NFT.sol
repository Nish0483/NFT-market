// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract NFT is Initializable, ERC721EnumerableUpgradeable, OwnableUpgradeable, AccessControlUpgradeable {
    using SafeMathUpgradeable for uint256;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");   //minter role for access control contract

    constructor(){
     _grantRole(DEFAULT_ADMIN_ROLE,msg.sender);   //taking admin role at deployment
    
    }

    //struct to stores auction data
    struct Auction {
        uint256 tokenId; 
        uint256 startTime;
        uint256 endTime;
        address highestBidder;
        uint256 highestBid;
        address[] bidders;
    }
    // store fixed price listing data
    struct FixedPriceListing {
        uint256 tokenId;
        address seller;
        uint256 price;
    }

    
    mapping(uint256 => uint256) public fixedPrices;
    mapping(uint256 => Auction) public auctions;
    mapping(uint256 => address) public fixedPriceSellers;
    mapping(uint256 => FixedPriceListing) public fixedPriceListings;

    
    event FixedPriceSold(address indexed seller, address indexed buyer, uint256 indexed tokenId, uint256 price);
    event AuctionSold(address indexed seller, address indexed buyer, uint256 indexed tokenId, uint256 price);
    event BidPlaced(address indexed bidder, uint256 indexed tokenId, uint256 bidAmount);
    event NFTListedForFixedPrice(address indexed seller, uint256 indexed tokenId, uint256 price);
    event NFTListedForAuction(address indexed seller, uint256 indexed tokenId, uint256 startTime, uint256 endTime);
    event NFTMinted(address indexed to, uint256 indexed tokenId);
    
    

    function initialize(string memory name, string memory symbol) public initializer onlyAdmin { 
    __ERC721_init(name, symbol);
    __Ownable_init(msg.sender);
    __AccessControl_init();

    }

    modifier onlyAdmin(){
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender),"Only Admin can do this transaction");
        _;
    }

    modifier onlyMinter() {
        require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter. Note:-Admin can add a Minter using grandRole function");
        _;
    }



   // Function to list an NFT for fixed price
    function listForFixedPrice(uint256 tokenId, uint256 price) external {
        require(ownerOf(tokenId) == msg.sender, "Caller is not the owner of the NFT");
        _transfer(msg.sender, address(this), tokenId);
        fixedPrices[tokenId] = price;
        fixedPriceSellers[tokenId] = msg.sender;
        fixedPriceListings[tokenId] = FixedPriceListing(tokenId, msg.sender, price);

        emit NFTListedForFixedPrice(msg.sender, tokenId, price);
    }



    // Function to list an NFT for auction
    function listForAuction(uint256 tokenId, uint256 duration) external  {
        require(ownerOf(tokenId) == msg.sender, "Caller is not the owner of the NFT");
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime.add(duration);
        auctions[tokenId] = Auction(tokenId,startTime, endTime, address(0), 0,new address[](0));
       _transfer(msg.sender, address(this), tokenId);

       emit NFTListedForAuction(msg.sender, tokenId, startTime, endTime);
    }


    // Function to retrieve data of NFT listed for fixed price
   function getFixedListingData(uint256 tokenId) external view returns (FixedPriceListing memory) {
    return fixedPriceListings[tokenId];
    }




    // Function to retrieve data of NFT listed for auction
    function getAuctionData(uint256 tokenId) external view returns (uint256 startTime, uint256 endTime, address highestBidder, uint256 highestBid) {
        Auction storage auction = auctions[tokenId];
        return (auction.startTime, auction.endTime, auction.highestBidder, auction.highestBid);
    }


    // Function to retrieve auction end time for a specific NFT ID
    function getAuctionEndTime(uint256 tokenId) external view returns (uint256 endTime) {
        return auctions[tokenId].endTime;
    }

   
    // Function to retrieve wallet addresses of bidders for a specific NFT ID
    function getBidders(uint256 tokenId) external view returns (address[] memory bidders) {
        Auction storage auction = auctions[tokenId];
        return auction.bidders;
    }

    
    // Function to check and finalize the auction after bid time expiration
    function finalizeAuction(uint256 tokenId) public onlyOwner {
        Auction storage auction = auctions[tokenId];
        require(block.timestamp > auction.endTime, "Auction is still active");
        _transfer(ownerOf(tokenId), auction.highestBidder, tokenId);

        auction.startTime = 0;
        auction.endTime = 0;
        auction.highestBidder = address(0);
        auction.highestBid = 0;
        delete auction.bidders;
        
        emit AuctionSold(ownerOf(tokenId), auction.highestBidder, tokenId, auction.highestBid);
        
    }

    // Function to place a bid on an auction
    function placeBid(uint256 tokenId) external  payable {
        Auction storage auction = auctions[tokenId];
        require(block.timestamp >= auction.startTime && block.timestamp <= auction.endTime, "Auction is not active");
        require(msg.value > auction.highestBid, "Bid amount must be higher than the current highest bid");
        if (auction.highestBidder != address(0)) {
            payable(auction.highestBidder).transfer(auction.highestBid);
        }
        auction.highestBidder = msg.sender;
        auction.highestBid = msg.value;
        auction.bidders.push(msg.sender);
    
        emit BidPlaced(msg.sender, tokenId, msg.value);
    }



    // Function to mint ERC-721 NFTs
    function mintNFT(address to, uint256 tokenId) external onlyMinter {
        _mint(to, tokenId);

        emit NFTMinted(to, tokenId);
    }

    // demo supportsInterface 
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721EnumerableUpgradeable, AccessControlUpgradeable) returns (bool) {
        return ERC721EnumerableUpgradeable.supportsInterface(interfaceId) || AccessControlUpgradeable.supportsInterface(interfaceId);
    }



    //function for a user to buy a fixed price listed NFT
    function buyFixedPriceNFT(uint256 tokenId) external payable {
        uint256 price = fixedPrices[tokenId];
        require(price > 0, "NFT not listed for sale");
        require(msg.value == price, "Incorrect Ether value sent");
        _transfer(ownerOf(tokenId), msg.sender, tokenId);
        address seller = fixedPriceSellers[tokenId];
        payable(seller).transfer(msg.value);
        delete fixedPriceSellers[tokenId];
        delete fixedPrices[tokenId];

        emit FixedPriceSold(seller, msg.sender, tokenId, price);
    }

    // Function to change the admin
    function changeAdmin(address newAdmin) external onlyAdmin {
        grantRole(DEFAULT_ADMIN_ROLE, newAdmin);
        revokeRole(DEFAULT_ADMIN_ROLE, owner());
    }

}

