// Import ethers from Hardhat package
const { ethers } = require("hardhat");

async function main() {
  // This script deploys the Token contract

  // Retrieve accounts from the Hardhat runtime environment
  const [deployer] = await ethers.getSigners();

  // Display the deployer's address
  console.log("Deploying contracts with the account:", deployer.address);

  // Get the balance of the deployer's account
  const balance = await deployer.getBalance();
  console.log("Account balance:", balance.toString());

  // Get the contract factory for the Token contract
  const Token = await ethers.getContractFactory("Token");

  // Deploy the contract with the specified arguments for the constructor
  const token = await Token.deploy(
    "YieldFarmToken",
    "YFT",
    ethers.utils.parseEther("1000000")
  );

  // Wait for the deployment to be confirmed
  await token.deployed();

  // Print the address of the newly deployed contract
  console.log("Token deployed to:", token.address);
}

// Call the main function and catch any errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
