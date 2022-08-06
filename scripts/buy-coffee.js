const hre = require('hardhat');

//Return balance of given address
async function getBalance(address) {
    const balanceBigInt = await hre.ethers.provider.getBalance(address);
    return hre.ethers.utils.formatEther(balanceBigInt);
}

//Print blances of addresses
async function printBalances(addresses) {
    for (const address of addresses) {
        console.log(`Address ${address} has balance: ${await getBalance(address)}`);
    }
}

//print memos
async function printMemos(memos) {
    for (const memo of memos) {
        const timestamp = memo.timestamp;
        const tipper = memo.name;
        const tipperAddress = memo.from;
        const message = memo.message;
        console.log(`At ${timestamp}, ${tipper} @ ${tipperAddress} said, "${message}"`)
    }
}

async function main() {
    //get test accounts
    const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

    //deploy
    const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
    const buyMeACoffee = await BuyMeACoffee.deploy();
    await buyMeACoffee.deployed();
    console.log("BuyMeACoffee deployed to ", buyMeACoffee.address);

    const addresses = [owner.address, tipper.address, buyMeACoffee.address];
    console.log("== start ==");
    await printBalances(addresses);

    const tip = {value: hre.ethers.utils.parseEther("1")};
    await buyMeACoffee.connect(tipper).buyCoffee("Aquafina", "Here's your coffee",tip);
    console.log("== bought coffee ==");
    await printBalances(addresses);

    await buyMeACoffee.withdrawTips();
    console.log("== withdraw tips ==");
    await printBalances(addresses);

    console.log("== memos ==");
    const memos = await buyMeACoffee.getMemos();
    printMemos(memos);

    



}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });