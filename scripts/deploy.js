const hre = require("hardhat");

async function main() {
  const [alice, bob] = await hre.ethers.getSigners();

  const Token = await hre.ethers.getContractFactory("MyToken");

  const tokenA = await Token.deploy("AliceCoin", "ALC", 18);
  await tokenA.waitForDeployment();
  console.log(`AliceCoin deployed at: ${await tokenA.getAddress()}`);

  const tokenB = await Token.deploy("BobCoin", "BOB", 18);
  await tokenB.waitForDeployment();
  console.log(`BobCoin deployed at: ${await tokenB.getAddress()}`);

  const TokenSwap = await hre.ethers.getContractFactory("TokenSwap");

  const amountA = hre.ethers.parseUnits("10", 18);
  const amountB = hre.ethers.parseUnits("20", 18);

  const swap = await TokenSwap.deploy(
    await tokenA.getAddress(), alice.address, amountA,
    await tokenB.getAddress(), bob.address, amountB
  );
  await swap.waitForDeployment();

  console.log(`TokenSwap deployed at: ${await swap.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
