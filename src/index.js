const express = require('express');
const { createPublicClient, createWalletClient, http, parseUnits, formatUnits } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');

// Load contract ABI
const abi = require('../abi/MyToken.json');

require('dotenv').config();

// Environment configuration
const tokenAddress = process.env.TOKEN_ADDRESS;
const rpcUrl = process.env.RPC_URL;
const privateKey = process.env.PRIVATE_KEY;

// Setup Viem clients
const account = privateKeyToAccount(privateKey);
const walletClient = createWalletClient({
    account,
    transport: http(rpcUrl),
});
const publicClient = createPublicClient({
    transport: http(rpcUrl),
});

const app = express();
app.use(express.json());

// Error handling middleware
app.get("/token", async (req, res) => {
    try {
        const [name, symbol, totalSupply] = await Promise.all([
            publicClient.readContract({ address: tokenAddress, abi, functionName: "name" }),
            publicClient.readContract({ address: tokenAddress, abi, functionName: "symbol" }),
            publicClient.readContract({ address: tokenAddress, abi, functionName: "totalSupply" }),
        ]);

        res.json({
            name,
            symbol,
            totalSupply: formatUnits(totalSupply, 18),
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 1. Get Token Info
app.get('/token', async (req, res) => {
    const [name, symbol, totalSupply] = await Promise.all([
        publicClient.readContract({ address: tokenAddress, abi, functionName: 'name' }),
        publicClient.readContract({ address: tokenAddress, abi, functionName: 'symbol' }),
        publicClient.readContract({ address: tokenAddress, abi, functionName: 'totalSupply' }),
    ]);

    res.json({
        name,
        symbol,
        totalSupply: formatUnits(totalSupply, 18),
    });
});

// 2. Get Balance
app.get("/balance/:address", async (req, res) => {
    const { address } = req.params;
    try {
        const balance = await publicClient.readContract({
            address: tokenAddress,
            abi,
            functionName: "balanceOf",
            args: [address],
        });
        res.json({
            address,
            balance: formatUnits(balance, 18),
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 3. Approve
app.post("/approve", async (req, res) => {
    const { spender, amount } = req.body;

    try {
        const result = await walletClient.writeContract({
            address: tokenAddress,
            abi,
            functionName: "approve",
            args: [spender, parseUnits(amount, 18)],
        });
        res.json({ success: true, txHash: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


// 4. Execute transferFrom
app.post("/transferFrom", async (req, res) => {
    const { from, to, amount } = req.body;

    try {
        const result = await walletClient.writeContract({
            address: tokenAddress,
            abi,
            functionName: "transferFrom",
            args: [from, to, parseUnits(amount, 18)],
        });
        res.json({ success: true, txHash: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(3000, () => {
    console.log('✅ API listening at http://localhost:3000');
});
