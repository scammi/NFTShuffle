const { expect } = require("chai");
const { ethers } = require("hardhat");

// describe("Greeter", function () {
//   it("Should return the new greeting once it's changed", async function () {
//     const Greeter = await ethers.getContractFactory("Greeter");
//     const greeter = await Greeter.deploy("Hello, world!");
//     await greeter.deployed();

//     expect(await greeter.greet()).to.equal("Hello, world!");

//     const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

//     // wait until the transaction is mined
//     await setGreetingTx.wait();

//     expect(await greeter.greet()).to.equal("Hola, mundo!");
//   });
// });

describe("ShuffleOne", function() {
  let raffle;

  beforeEach(async() => {
    const Raffle = await ethers.getContractFactory("ShuffleOne");
    raffle = await Raffle.deploy();
    await raffle.deployed();

  });

  it("Should buy a ticket", async function() {

    const ticket = await raffle.buyTicket();
    await ticket.wait();

    const participant = await raffle.participants(await ethers.provider.getSigner().getAddress());
    expect(participant.ownTickets).to.equal(1);
  })

  it("Cannot buy more than maximum per address", async ()=> {
    const max_per_address = await raffle.MAX_PER_ADDRESS();

    for(let i = 0; i < max_per_address.toNumber(); i++ ) {
      await raffle.buyTicket();
    }
    await expect(raffle.buyTicket()).to.be.revertedWith("Address owns ticket");
  })
})
