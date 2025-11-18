// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title FlappyBirdNFT
 * @dev ERC721 NFTs for Flappy Bird high scores
 */
contract FlappyBirdNFT is ERC721, Ownable {
    using Counters for Counters.Counter;

    // Score NFT metadata
    struct ScoreNFT {
        uint256 score;
        string playerName;
        uint256 timestamp;
        string metadataURI;
    }

    // Storage
    Counters.Counter private _tokenIdCounter;
    mapping(uint256 => ScoreNFT) public scoreNFTs;

    // Events
    event ScoreNFTMinted(
        address indexed to,
        uint256 indexed tokenId,
        uint256 score
    );

    constructor() ERC721("Flappy Bird Score NFT", "FBS") {}

    /**
     * @dev Mint a new score NFT
     * @param to Address to mint to
     * @param score Score achieved
     * @param playerName Player's name
     * @param tokenURI Metadata URI (IPFS)
     * @return tokenId The minted token ID
     */
    function mintScoreNFT(
        address to,
        uint256 score,
        string memory playerName,
        string memory tokenURI
    ) external returns (uint256) {
        require(to != address(0), "Cannot mint to zero address");
        require(score > 0, "Score must be greater than 0");
        require(bytes(playerName).length > 0, "Player name required");
        require(bytes(tokenURI).length > 0, "Token URI required");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        // Mint NFT
        _safeMint(to, tokenId);

        // Store metadata
        scoreNFTs[tokenId] = ScoreNFT({
            score: score,
            playerName: playerName,
            timestamp: block.timestamp,
            metadataURI: tokenURI
        });

        emit ScoreNFTMinted(to, tokenId, score);

        return tokenId;
    }

    /**
     * @dev Get token URI for a token
     * @param tokenId Token ID
     * @return Token URI
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(_exists(tokenId), "Token does not exist");
        return scoreNFTs[tokenId].metadataURI;
    }

    /**
     * @dev Get score NFT metadata
     * @param tokenId Token ID
     * @return ScoreNFT struct
     */
    function getScoreNFT(uint256 tokenId)
        external
        view
        returns (ScoreNFT memory)
    {
        require(_exists(tokenId), "Token does not exist");
        return scoreNFTs[tokenId];
    }

    /**
     * @dev Get total minted NFTs
     * @return Total count
     */
    function totalMinted() external view returns (uint256) {
        return _tokenIdCounter.current();
    }

    /**
     * @dev Get all NFTs owned by an address
     * @param owner Owner address
     * @return Array of token IDs
     */
    function tokensOfOwner(address owner)
        external
        view
        returns (uint256[] memory)
    {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokens = new uint256[](balance);
        uint256 index = 0;

        for (uint256 i = 0; i < _tokenIdCounter.current(); i++) {
            if (_exists(i) && ownerOf(i) == owner) {
                tokens[index] = i;
                index++;
            }
        }

        return tokens;
    }
}
