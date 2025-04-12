# ERC-20 Token with Viem Integration

This project demonstrates how to deploy and interact with an ERC-20 token smart contract using Hardhat, Viem, and a Node.js backend. The backend API enables users to interact with the token contract, including checking token details, viewing user balances, and executing `transferFrom` operations.

## Project Structure

```bash
erc20-token-with-viem/ 
├── abi/
│ └── MyToken.json # ABI for MyToken contract 
├── contracts/
│ └── ERC20.sol # ERC-20 Token base contract 
│ └── IERC20.sol # Interface for ERC-20
│ └── MyToken.sol # Token contract inheriting ERC-20 
│ └── TokenSwap.sol # TokenSwap
├── scripts/
│ └── deploy.js # Deploy contract script 
├── src/
│ └── index.js # Express server and API routes 
├── test/
│ └── MyToken.test.js # Unit tests for the smart contract
├── .env
├── hardhat.config.js
├── node_modules/
├── package.json
└── README.md
```

## Project Description

This project demonstrates the following:

1. **ERC-20 Token Contract**: Implements the ERC-20 standard with minting, burning, and transferring tokens.
2. **Backend API**: A Node.js application with Express and Viem integration to interact with the deployed ERC-20 contract. The API exposes the following endpoints:
   - `/token`: Fetches token details like name, symbol, and total supply.
   - `/balance/:address`: Retrieves the token balance of a specific address.   
   - `/approve`: Approves a spender to spend a specified amount of tokens.
   - `/transferFrom`: Executes a `transferFrom` operation to transfer tokens from one address to another.

## Setup Instructions

### Prerequisites

Before starting, make sure you have the following installed:
- Node.js (>= 16.x)
- NPM
- Hardhat (for deploying smart contracts)

### 1. Install Dependencies

Clone the repository and install the necessary dependencies:

```bash
git clone https://github.com/reliableengineer0308/erc20-token-with-viem.git
cd erc20-token-with-viem
npm install
```

### 2. Configure Environment Variables

Clone the repository and install the necessary dependencies:

```bash
RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=0xYourPrivateKey  # Replace with your wallet private key
TOKEN_ADDRESS=0xYourDeployedTokenAddress  # Replace with your deployed token address
```

- Replace PRIVATE_KEY with your wallet's private key (for signing transactions).
- Replace TOKEN_ADDRESS with the deployed token address (this will be available after deploying the token).

### 3. Set Up Hardhat

Ensure your hardhat.config.js is set up for deployment:

```bash
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.28"
};
```

### 4. Deploy the Smart Contract

To deploy the ERC-20 token contract to your local Hardhat network:

1. Start the Hardhat local network:

```bash
npx hardhat node
```

2. In another terminal, deploy the contract:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

After running this command, the contract will be deployed, and you'll see the token address in the output.

### 5. Start the Backend API

Once the contract is deployed, you can start the Node.js backend:

```bash
npm start
```

The API will now be running at http://localhost:3000.

## API Endpoints

### 1. Get Token Info (GET /token)

Fetch the token details like name, symbol, and total supply.

Request:

```bash
curl http://localhost:3000/token
```

Response:

```bash
{
  "name": "My Token",
  "symbol": "MTK",
  "totalSupply": "1000000000"
}
```

### 2. Get Balance (GET /balance/:address)

Fetches the token balance of a specific address.

Request:

```bash
curl http://localhost:3000/balance/0xYourAddress
```

Response:

```bash
{
  "address": "0xYourAddress",
  "balance": "100.0"
}
```

### 3. Approve Tokens (POST /approve)
Approves a spender to spend a specified amount of tokens on behalf of the sender.

Request:
```bash
curl -X POST http://localhost:3000/approve -d '{"from": "0xYourAddress", "spender": "0xSpenderAddress", "amount": "100"}' -H "Content-Type: application/json"
```

Response:
```bash
{
  "success": true,
  "txHash": "0xTransactionHash"
}
```

### 4. Execute transferFrom (POST /transferFrom)

Executes a transferFrom operation to transfer tokens from one address to another.

Request:

```bash
curl -X POST http://localhost:3000/transferFrom -d '{"from": "0xSenderAddress", "to": "0xRecipientAddress", "amount": "50"}' -H "Content-Type: application/json"
```

Response:

```bash
{
  "success": true,
  "txHash": "0xTransactionHash"
}
```

## Unit Testing

Unit tests are written using Mocha and Chai. These tests ensure the basic functionality of the ERC20 token contract, including transfers, approvals, and minting.

### Run the Tests

To run the unit tests for the smart contract, use the following command:

```bash
npx hardhat test
```

## Design Decisions and Considerations

- Viem for Contract Interaction: The project uses the viem library to interact with the Ethereum smart contract, which provides a minimal and lightweight interface for reading and writing to smart contracts.
- Backend with Express: The backend API is built using Express, which serves as a REST API to interact with the smart contract. It provides a clean separation between the frontend and the Ethereum blockchain.
- Hardhat for Local Deployment: Hardhat is used to deploy and interact with the smart contracts on a local Ethereum network for testing. This makes it easier to simulate and test Ethereum transactions.
- Private Key Security: The private key for signing transactions should be securely managed and never exposed in production environments.

## Usage Examples

- Minting Tokens: The MyToken contract mints 100 tokens to the deployer's address during deployment. This is hardcoded for simplicity.
- Interacting with Token Contract: The backend API allows you to interact with the deployed token contract. You can approve another address to spend tokens on your behalf and execute token transfers