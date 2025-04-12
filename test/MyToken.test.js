const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken", function () {
    let Token, token, owner, addr1, addr2;

    beforeEach(async function () {
        // Deploy a new token contract before each test
        Token = await ethers.getContractFactory("MyToken");
        [owner, addr1, addr2] = await ethers.getSigners();
        token = await Token.deploy("AliceCoin", "ALC", 18);
        await token.waitForDeployment();
    });

    describe("Basic token functionality", function () {
        it("should have the correct name, symbol, and total supply", async function () {
            expect(await token.name()).to.equal("AliceCoin");
            expect(await token.symbol()).to.equal("ALC");
            expect(await token.totalSupply()).to.equal(BigInt(100) * BigInt(10 ** 18));
        });

        it("should assign the total supply to the deployer's address", async function () {
            expect(await token.balanceOf(owner.address)).to.equal(BigInt(100) * BigInt(10 ** 18));
        });

        it("should transfer tokens correctly", async function () {
            await token.transfer(addr1.address, BigInt(50) * BigInt(10 ** 18));
            expect(await token.balanceOf(addr1.address)).to.equal(BigInt(50) * BigInt(10 ** 18));
        });
    });

    describe("Approval mechanism", function () {
        it("should approve and transfer tokens correctly using transferFrom", async function () {
            await token.approve(addr1.address, BigInt(100) * BigInt(10 ** 18));
            expect(await token.allowance(owner.address, addr1.address)).to.equal(BigInt(100) * BigInt(10 ** 18));

            await token.connect(addr1).transferFrom(owner.address, addr2.address, BigInt(100) * BigInt(10 ** 18));
            expect(await token.balanceOf(addr2.address)).to.equal(BigInt(100) * BigInt(10 ** 18));
        });
    });

    describe("Minting and burning", function () {
        it("should mint tokens correctly", async function () {
            await token.mint(addr1.address, BigInt(100) * BigInt(10 ** 18));
            expect(await token.balanceOf(addr1.address)).to.equal(BigInt(100) * BigInt(10 ** 18));
        });

        it("should burn tokens correctly", async function () {
            await token.burn(owner.address, BigInt(50) * BigInt(10 ** 18));
            expect(await token.balanceOf(owner.address)).to.equal(BigInt(50) * BigInt(10 ** 18));
        });
    });

    describe("Edge cases", function () {
        it("should prevent transfer when the balance is insufficient", async function () {
            await expect(token.transfer(addr1.address, BigInt(200) * BigInt(10 ** 18))).to.be.revertedWith("ERC20: transfer amount exceeds balance");
        });

        it("should prevent approval of zero allowance", async function () {
            await token.approve(addr1.address, 0);
            expect(await token.allowance(owner.address, addr1.address)).to.equal(0);
        });
    });
});
