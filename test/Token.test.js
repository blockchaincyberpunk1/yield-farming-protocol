// Importing necessary testing utilities from Hardhat and Chai
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token contract", function () {
    let Token;
    let token;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    // Deploy the contract before each test
    beforeEach(async function () {
        // Get the ContractFactory and Signers here
        Token = await ethers.getContractFactory("Token");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        // Deploy a new Token contract before each test
        token = await Token.deploy("YieldFarmToken", "YFT", ethers.utils.parseUnits("1000000", 18));
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await token.owner()).to.equal(owner.address);
        });

        it("Should assign the total supply of tokens to the owner", async function () {
            const ownerBalance = await token.balanceOf(owner.address);
            expect(await token.totalSupply()).to.equal(ownerBalance);
        });
    });

    describe("Transactions", function () {
        it("Should mint tokens when called by the owner", async function () {
            await token.mint(addr1.address, 100);
            expect(await token.balanceOf(addr1.address)).to.equal(100);
        });

        it("Should fail if mint is called by non-owner", async function () {
            // We expect this call to fail as addr1 is not the owner
            await expect(token.connect(addr1).mint(addr2.address, 100)).to.be.revertedWith("OwnableUnauthorizedAccount");
        });
    });
});
