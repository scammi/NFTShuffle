const { expect } = require("chai");
const { ethers } = require("hardhat");

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
  });

  it("Cannot buy more than maximum per address", async() => {
    const max_per_address = await raffle.MAX_PER_ADDRESS();

    for(let i = 0; i < max_per_address.toNumber(); i++ ) {
      await raffle.buyTicket();
    }
    await expect(raffle.buyTicket()).to.be.revertedWith("Address owns ticket");
  });

  it("Revert when buying more than AVAILABLE_SUPPLY", async() => {
    const available_supply = await raffle.AVAILABLE_SUPPLY();
    
    const accounts = await createWallets(available_supply.toNumber());

    await Promise.all(accounts.map(acc => raffle.connect(acc).buyTicket()))

    await expect(raffle.buyTicket()).to.be.revertedWith("All tickets sold");
  });
})

async function createWallets(amount) {
  const accounts = await ethers.getSigners()
  const wallets = []
  const wallet = ethers.Wallet.createRandom().connect(ethers.provider)
  const mnemonic = wallet._mnemonic()
  const prefix = mnemonic.path.substr(0, mnemonic.path.length - 1)

  for (let i = 0; i < amount; i++) {
    const path = prefix + i.toString()

    const w = ethers.Wallet.fromMnemonic(mnemonic.phrase, path).connect(ethers.provider)
    await accounts[7].sendTransaction({
      to: w.address,
      value: ethers.utils.parseEther('0.1')
    })
    wallets.push(w)
  }

  return wallets
}
