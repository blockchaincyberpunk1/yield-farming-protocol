// Import necessary testing utilities
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("YieldFarm contract", function () {
  let LPtoken;
  let RewardToken;
  let YieldFarm;
  let lptoken;
  let rewardToken;
  let yieldFarm;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  // Deploy the contract before each test
  beforeEach(async function () {
    // Get the ContractFactory and Signers
    LPtoken = await ethers.getContractFactory("LPtoken");
    RewardToken = await ethers.getContractFactory("Token");
    YieldFarm = await ethers.getContractFactory("YieldFarm");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy the mock LP token and reward token contracts
    lptoken = await LPtoken.deploy("MockLP", "MLP");
    rewardToken = await RewardToken.deploy(
      "RewardToken",
      "RWT",
      ethers.utils.parseUnits("1000000", 18)
    );

    // Deploy the YieldFarm contract
    yieldFarm = await YieldFarm.deploy(lptoken.address, rewardToken.address, 1); // 1 token per second

    // Distribute LP tokens to addr1 and addr2
    await lptoken.mint(addr1.address, 1000);
    await lptoken.mint(addr2.address, 1000);

    // Approve YieldFarm contract to move addr1's and addr2's LP tokens
    await lptoken.connect(addr1).approve(yieldFarm.address, 1000);
    await lptoken.connect(addr2).approve(yieldFarm.address, 1000);

    // Transfer all reward tokens to YieldFarm for reward distribution
    await rewardToken.transfer(
      yieldFarm.address,
      ethers.utils.parseUnits("1000000", 18)
    );
  });

  describe("Staking and Rewards", function () {
    it("Should accept stakes and update stakers' data correctly", async function () {
      await yieldFarm.connect(addr1).stake(100);
      const staker = await yieldFarm.stakers(addr1.address);
      expect(staker.amountStaked).to.equal(100);
      expect(staker.timeOfLastUpdate).to.be.at.least(1);
      expect(staker.unclaimedRewards).to.equal(0);
    });

    it("Should calculate rewards over time", async function () {
      await yieldFarm.connect(addr1).stake(100);
      await ethers.provider.send("evm_increaseTime", [3600]); // increase time by 1 hour
      await ethers.provider.send("evm_mine", []);

      // Trigger reward update through a natural process, like withdrawing
      await yieldFarm.connect(addr1).withdraw();
      const finalBalance = await rewardToken.balanceOf(addr1.address);
      expect(finalBalance).to.be.closeTo(360000, 100); // Allow a small variance for timing differences
    });

    it("Should allow withdrawal of LP tokens and rewards", async function () {
      await yieldFarm.connect(addr1).stake(200);
      await ethers.provider.send("evm_increaseTime", [3600]); // increase time by 1 hour
      await ethers.provider.send("evm_mine", []);
      await yieldFarm.connect(addr1).withdraw();

      const finalLPBalance = await lptoken.balanceOf(addr1.address);
      const finalRewardBalance = await rewardToken.balanceOf(addr1.address);
      expect(finalLPBalance).to.equal(1000); // Initially 1000, staked 200, then withdrew 200
      expect(finalRewardBalance).to.be.closeTo(720000, 200); // Allow variance for calculation timing
    });
  });
});
