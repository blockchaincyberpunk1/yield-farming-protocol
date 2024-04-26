// Import ethers from Hardhat package
const { ethers } = require("hardhat");

async function main() {
  // This script deploys the LPtoken contract

  // Retrieve accounts from the Hardhat runtime environment
  const [deployer] = await ethers.getSigners();

  // Display the deployer's address
  console.log("Deploying contracts with the account:", deployer.address);

  // Get the balance of the deployer's account
  const balance = await deployer.getBalance();
  console.log("Account balance:", balance.toString());

  // Get the contract factory for the LPtoken contract
  const LPtoken = await ethers.getContractFactory("LPtoken");

  // Deploy the contract with the specified arguments for the constructor
  const lpToken = await LPtoken.deploy("MockLPToken", "MLP");

  // Wait for the deployment to be confirmed
  await lpToken.deployed();

  // Print the address of the newly deployed contract
  console.log("LPtoken deployed to:", lpToken.address);
}

// Call the main function and catch any errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
