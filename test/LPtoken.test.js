// Import necessary testing utilities
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LPtoken contract", function () {
    let LPtoken;
    let lptoken;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    // Deploy the contract before each test
    beforeEach(async function () {
        // Get the ContractFactory and Signers
        LPtoken = await ethers.getContractFactory("LPtoken");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        // Deploy a new LPtoken contract before each test
        lptoken = await LPtoken.deploy("MockLP", "MLP");
    });

    describe("Deployment", function () {
        it("Should have the correct name and symbol", async function () {
            expect(await lptoken.name()).to.equal("MockLP");
            expect(await lptoken.symbol()).to.equal("MLP");
        });
    });

    describe("Minting and Burning", function () {
        it("Should mint new tokens correctly", async function () {
            await lptoken.mint(addr1.address, 100);
            expect(await lptoken.balanceOf(addr1.address)).to.equal(100);
        });

        it("Should burn tokens correctly", async function () {
            await lptoken.mint(addr1.address, 100);
            await lptoken.burn(addr1.address, 50);
            expect(await lptoken.balanceOf(addr1.address)).to.equal(50);
        });

        it("Should only allow owner to mint and burn tokens", async function () {
            // Testing mint by non-owner
            await expect(lptoken.connect(addr1).mint(addr1.address, 100)).to.be.revertedWith("OwnableUnauthorizedAccount");

            // Testing burn by non-owner
            await lptoken.mint(owner.address, 100);
            await expect(lptoken.connect(addr1).burn(owner.address, 50)).to.be.revertedWith("OwnableUnauthorizedAccount");
        });
    });
});

