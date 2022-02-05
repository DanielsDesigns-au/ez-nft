// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract EzNFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _nftsMinted;
    Counters.Counter private _nftsSold;

    // declares the market variables
    address payable owner;
    uint256 private listingPrice = 0.025 ether;

    constructor() {
        owner = payable(msg.sender);
    }

    struct MarketNFT {
        uint256 nftId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => MarketNFT) private idToMarketNFT;

    event MarketNFTCreated(
        uint256 indexed nftId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function createMarketNFT(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Price must be at least 1 wei");
        require(msg.value == listingPrice, "Price must equal listing price");

        _nftsMinted.increment();
        uint256 nftId = _nftsMinted.current();

        idToMarketNFT[nftId] = MarketNFT(
            nftId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketNFTCreated(
            nftId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price,
            false
        );
    }

    function sellMarketNFT(address nftContract, uint256 nftId)
        public
        payable
        nonReentrant
    {
        uint256 price = idToMarketNFT[nftId].price;
        uint256 tokenId = idToMarketNFT[nftId].tokenId;

        require(msg.value == price, "Please pay asking price");

        // Transfer transaction value to the seller
        idToMarketNFT[nftId].seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToMarketNFT[nftId].owner = payable(msg.sender);
        idToMarketNFT[nftId].sold = true;

        // Increment tokens/NFT's sold so you know the length of sold items
        _nftsSold.increment();
        payable(owner).transfer(listingPrice);
    }

    function getMarketNFTs() public view returns (MarketNFT[] memory) {
        uint256 nftCount = _nftsMinted.current();
        uint256 unsoldNFTCount = _nftsMinted.current() - _nftsSold.current();
        uint256 currentIndex = 0;

        MarketNFT[] memory nfts = new MarketNFT[](unsoldNFTCount);

        for (uint256 i = 0; i < nftCount; i++) {
            if (idToMarketNFT[i + 1].owner == address(0)) {
                // get the current id of the item
                uint256 currentId = idToMarketNFT[i + 1].nftId;
                MarketNFT storage currentNFT = idToMarketNFT[currentId];
                nfts[currentIndex] = currentNFT;
                currentIndex += 1;
            }
        }

        return nfts;
    }

    function getAccountNFTs() public view returns (MarketNFT[] memory) {
        uint256 totalNFTCount = _nftsMinted.current();
        uint256 nftCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalNFTCount; i++) {
            if (idToMarketNFT[i + 1].owner == msg.sender) {
                nftCount += 1;
            }
        }

        MarketNFT[] memory nfts = new MarketNFT[](nftCount);
        for (uint256 i = 0; i < totalNFTCount; i++) {
            if (idToMarketNFT[i + 1].owner == msg.sender) {
                uint256 currentId = i + 1;
                MarketNFT storage currentNFT = idToMarketNFT[currentId];
                nfts[currentIndex] = currentNFT;
                currentIndex += 1;
            }
        }
        return nfts;
    }
}
