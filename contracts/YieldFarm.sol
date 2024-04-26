// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title YieldFarm
 * @dev Implements a basic yield farming system where users can stake LP tokens to earn rewards over time.
 * Rewards are calculated based on the staking duration and the amount of tokens staked.
 */
contract YieldFarm is Ownable, ReentrancyGuard {
    IERC20 public lpToken;
    IERC20 public rewardToken;

    struct Staker {
        uint256 amountStaked;
        uint256 timeOfLastUpdate;
        uint256 unclaimedRewards;
    }

    mapping(address => Staker) public stakers;

    uint256 public rewardRatePerTokenPerSecond;

    /**
     * @dev Constructor for initializing the Yield Farming contract.
     * @param _lpToken Address of the LP token contract.
     * @param _rewardToken Address of the reward token contract.
     * @param _rewardRate How many reward tokens each token staked earns per second.
     */
    constructor(address _lpToken, address _rewardToken, uint256 _rewardRate) Ownable(msg.sender) {
        lpToken = IERC20(_lpToken);
        rewardToken = IERC20(_rewardToken);
        rewardRatePerTokenPerSecond = _rewardRate;
    }

    /**
     * @dev Function for a staker to deposit LP tokens into the contract.
     * @param amount The amount of LP tokens to stake.
     */
    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot stake 0 LP tokens");

        updateRewards(msg.sender);

        lpToken.transferFrom(msg.sender, address(this), amount);
        stakers[msg.sender].amountStaked += amount;
    }

    /**
     * @dev Internal function to update the rewards for a staker.
     * @param staker The address of the staker.
     */
    function updateRewards(address staker) internal {
        Staker storage stakerData = stakers[staker];
        uint256 timeStaked = block.timestamp - stakerData.timeOfLastUpdate;
        uint256 rewardEarned = timeStaked * rewardRatePerTokenPerSecond * stakerData.amountStaked;
        stakerData.unclaimedRewards += rewardEarned;
        stakerData.timeOfLastUpdate = block.timestamp;
    }

    /**
     * @dev Function for a staker to withdraw their staked LP tokens and any accumulated rewards.
     */
    function withdraw() external nonReentrant {
        updateRewards(msg.sender);

        Staker storage stakerData = stakers[msg.sender];
        uint256 amountStaked = stakerData.amountStaked;
        require(amountStaked > 0, "No LP tokens to withdraw");

        uint256 rewardsToClaim = stakerData.unclaimedRewards;
        lpToken.transfer(msg.sender, amountStaked);
        rewardToken.transfer(msg.sender, rewardsToClaim);

        stakerData.amountStaked = 0;
        stakerData.unclaimedRewards = 0;
    }
}
