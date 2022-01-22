const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});

describe("ShuffleOne", function() {
  it("should deploy the contract and initialize the raffle", async function() {
    const Raffle = await ethers.getContractFactory("ShuffleOne");
    const raffle = await Raffle.deploy();
    const deployed = await raffle.deployed();


    // console.log(ethers.provider.getSigner())
    const ticket = await raffle.buyTicket()


    // const mint = await raffle.mint()

    // const participants = await raffle.participants(ethers.getSigner().address)

    // console.log(mint)
    console.log(ticket)
    // console.log(ethers.getSigner())
  })
})
