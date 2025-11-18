// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title FlappyBirdScores
 * @dev On-chain leaderboard for Flappy Bird scores
 */
contract FlappyBirdScores {
    // Score entry structure
    struct Score {
        address player;
        string playerName;
        uint256 score;
        uint256 timestamp;
        string profileImageIPFS;
    }

    // Storage
    Score[] public leaderboard;
    mapping(address => uint256) public playerBestScore;
    mapping(address => uint256) public playerScoreCount;

    // Events
    event ScoreSubmitted(
        address indexed player,
        uint256 score,
        uint256 timestamp
    );

    /**
     * @dev Submit a new score to the leaderboard
     * @param _score The score achieved
     * @param _playerName Player's display name
     * @param _profileImageIPFS IPFS hash of player's profile image
     */
    function submitScore(
        uint256 _score,
        string memory _playerName,
        string memory _profileImageIPFS
    ) external {
        require(_score > 0, "Score must be greater than 0");
        require(bytes(_playerName).length > 0, "Player name required");

        // Create score entry
        Score memory newScore = Score({
            player: msg.sender,
            playerName: _playerName,
            score: _score,
            timestamp: block.timestamp,
            profileImageIPFS: _profileImageIPFS
        });

        // Add to leaderboard
        leaderboard.push(newScore);

        // Update player stats
        if (_score > playerBestScore[msg.sender]) {
            playerBestScore[msg.sender] = _score;
        }
        playerScoreCount[msg.sender]++;

        emit ScoreSubmitted(msg.sender, _score, block.timestamp);
    }

    /**
     * @dev Get top N scores from leaderboard
     * @param _limit Maximum number of scores to return
     * @return Array of Score structs
     */
    function getLeaderboard(uint256 _limit)
        external
        view
        returns (Score[] memory)
    {
        require(_limit > 0, "Limit must be greater than 0");

        // Sort leaderboard (simple bubble sort for small datasets)
        Score[] memory sortedScores = new Score[](leaderboard.length);
        for (uint256 i = 0; i < leaderboard.length; i++) {
            sortedScores[i] = leaderboard[i];
        }

        // Bubble sort by score (descending)
        for (uint256 i = 0; i < sortedScores.length; i++) {
            for (uint256 j = i + 1; j < sortedScores.length; j++) {
                if (sortedScores[j].score > sortedScores[i].score) {
                    Score memory temp = sortedScores[i];
                    sortedScores[i] = sortedScores[j];
                    sortedScores[j] = temp;
                }
            }
        }

        // Return top N
        uint256 resultSize = _limit < sortedScores.length
            ? _limit
            : sortedScores.length;
        Score[] memory result = new Score[](resultSize);

        for (uint256 i = 0; i < resultSize; i++) {
            result[i] = sortedScores[i];
        }

        return result;
    }

    /**
     * @dev Get player's rank on leaderboard
     * @param _player Player's address
     * @return Player's rank (1-indexed, 0 if not on leaderboard)
     */
    function getPlayerRank(address _player) external view returns (uint256) {
        uint256 bestScore = playerBestScore[_player];
        if (bestScore == 0) {
            return 0;
        }

        uint256 rank = 1;
        for (uint256 i = 0; i < leaderboard.length; i++) {
            if (leaderboard[i].score > bestScore) {
                rank++;
            }
        }

        return rank;
    }

    /**
     * @dev Get player's statistics
     * @param _player Player's address
     * @return bestScore Player's best score
     * @return totalScores Total number of games played
     */
    function getPlayerStats(address _player)
        external
        view
        returns (uint256 bestScore, uint256 totalScores)
    {
        bestScore = playerBestScore[_player];
        totalScores = playerScoreCount[_player];
    }

    /**
     * @dev Get total number of scores submitted
     * @return Total count
     */
    function getTotalScores() external view returns (uint256) {
        return leaderboard.length;
    }
}
