# Yield Farming Protocol

This project consists of smart contracts designed to implement a basic yield farming system where users can stake LP tokens to earn rewards over time. The contracts are written in Solidity and utilize the OpenZeppelin library for ERC20 token functionality.

## Contracts Overview

### LPtoken.sol

- **Description**: Mock version of a Liquidity Provider (LP) token for testing purposes.
- **Functionality**: Provides basic ERC20 functionality with additional minting and burning capabilities.
- **Purpose**: Suitable for simulating user interactions in decentralized finance environments.

### Token.sol

- **Description**: Implementation of the ERC20 Token for yield farming rewards.
- **Functionality**: Allows minting of tokens, controlled by the owner or other privileged roles.
- **Purpose**: Used as the reward token for the yield farming protocol.

### YieldFarm.sol

- **Description**: Implements a basic yield farming system where users can stake LP tokens to earn rewards.
- **Functionality**: Allows users to stake LP tokens, earn rewards over time, and withdraw their staked tokens and rewards.
- **Purpose**: Core contract for the yield farming protocol.

## Setup and Deployment

To deploy these contracts:

1. Ensure you have a compatible Ethereum development environment.
2. Install necessary dependencies, including OpenZeppelin contracts.
3. Deploy each contract to the desired Ethereum network using a compatible deployment tool or framework.

## Usage

1. Deploy LPtoken and Token contracts, providing necessary parameters such as name, symbol, and initial supply.
2. Deploy YieldFarm contract, providing addresses of LPtoken and Token contracts, along with the reward rate.
3. Users can stake LP tokens using the `stake` function in the YieldFarm contract.
4. Users can withdraw their staked LP tokens and earned rewards using the `withdraw` function.

## License

All contracts are licensed under the MIT License. See each contract file for details.
