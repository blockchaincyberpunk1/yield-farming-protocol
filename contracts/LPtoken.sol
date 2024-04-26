// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title LPtoken
 * @dev Mock version of a Liquidity Provider (LP) token for testing purposes.
 * This contract provides basic ERC20 functionality with additional minting and burning capabilities,
 * making it suitable for simulating user interactions in decentralized finance environments.
 */
contract LPtoken is ERC20, Ownable {
    /**
     * @dev Constructor that sets the token details.
     * @param name The name of the token.
     * @param symbol The symbol of the token.
     */
    constructor(string memory name, string memory symbol) ERC20(name, symbol) Ownable(msg.sender) {
    }

    /**
     * @dev Mints new tokens to a specified address.
     * This can be used to simulate depositing tokens into a liquidity pool.
     * @param to The address that will receive the minted tokens.
     * @param amount The amount of tokens to be minted.
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Burns tokens from a specified address.
     * This can be used to simulate withdrawing tokens from a liquidity pool.
     * @param from The address from which tokens will be burned.
     * @param amount The amount of tokens to be burned.
     */
    function burn(address from, uint256 amount) public onlyOwner {
        _burn(from, amount);
    }
}
