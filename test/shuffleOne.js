const { expect } = require("chai");
const { ethers, deployments } = require("hardhat");

describe("ShuffleOne", function () {

  let raffle, vrfCoordinatorV2Mock, AVAILABLE_SUPPLY;

  let MINT_COST = ethers.utils.parseEther("0.1");

  const ticketPaymentOver = {
    value: MINT_COST
  };

  beforeEach(async () => {
    await deployments.fixture(["ShuffleOne"]);

    raffle = await ethers.getContract("ShuffleOne");
    vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")

    AVAILABLE_SUPPLY = await raffle.AVAILABLE_SUPPLY();
  });

  describe("BuyTicket", function () {
    it("Should buy a ticket", async () => {
      const ticket = await raffle.buyTicket(ticketPaymentOver);
      await ticket.wait();

      const participant = await raffle.participants(await ethers.provider.getSigner().getAddress());
      expect(participant.ownedTickets).to.equal(1);
    });

    it("should revert on incorrect payment", async () => {
      const insufficientFee = "0.001";

      await expect(raffle.buyTicket(
        { value: ethers.utils.parseEther(insufficientFee) }
      )).to.be.revertedWith("Insufficient payment");
    });

    it("Cannot buy more than maximum per address", async () => {
      const max_per_address = await raffle.MAX_PER_ADDRESS();

      for (let i = 0; i < max_per_address.toNumber(); i++) {
        await raffle.buyTicket(ticketPaymentOver);
      }
      await expect(raffle.buyTicket(ticketPaymentOver)).to.be.revertedWith("Address owns ticket");
    });

    it("Revert when buying more than the available supply", async () => {

      const accounts = await createWallets(AVAILABLE_SUPPLY);

      await Promise.all(accounts.map(acc => raffle.connect(acc).buyTicket(ticketPaymentOver)))

      await expect(raffle.buyTicket(ticketPaymentOver)).to.be.revertedWith("All tickets sold");
    });

    it("Gets tickets sold", async () => {
      const accounts = await createWallets(5);

      for (let i = 0; i < AVAILABLE_SUPPLY.toNumber(); i++) {
        await raffle.connect(accounts[i]).buyTicket(ticketPaymentOver);

        expect(await raffle.getSoldTickets()).to.be.equal(i + 1);
      }
    });

    it("Should disallow buying ticket after block number", async () => {
      // get RAFFLE_FINALIZATION_BLOCKNUMBER
      const raffleEndBlock = await raffle.RAFFLE_FINALIZATION_BLOCKNUMBER();
      expect(raffleEndBlock.toNumber()).to.equal(1007);

      const accounts = await createWallets(2);

      // buy ticket before time lock should be enabled
      const ticket = await raffle.connect(accounts[0]).buyTicket(ticketPaymentOver);
      await ticket.wait();
      const participant = await raffle.participants(await accounts[0].getAddress());
      expect(participant.ownedTickets).to.equal(1);

      // should revert with message if buying after timelock.
      // mine 1000 blocks with an interval of 1 minute
      await hre.network.provider.send("hardhat_mine", ["0x3e8"]);
      await expect(raffle.connect(accounts[1]).buyTicket(ticketPaymentOver)).to.be.revertedWith("Raffle has ended");
    });
  });

  describe("Mint token", function () {
    it("Should revert on mint if not all tokens have been sold", async () => {
      const ticket = await raffle.buyTicket(ticketPaymentOver);
      await ticket.wait();

      await expect(raffle.mint()).to.be.revertedWith("Raffle still open")
    });

    it("Allows to mint and request randomness after block finalization, even though not all tickets are sold", async () => {
      await expect(raffle.requestRandomness()).to.be.revertedWith("Raffle still open")
      const ticket = await raffle.buyTicket(ticketPaymentOver);
      await ticket.wait();

      await hre.network.provider.send("hardhat_mine", ["0x3e8"]);

      // request randomness 
      await (await raffle.requestRandomness()).wait();
      const requestId = await raffle.getRequestId();
      // fulfill request
      await (await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, raffle.address)).wait()

      const mint = await raffle.mint();
      await mint.wait();

      const participant = await raffle.participants(await ethers.provider.getSigner().getAddress());
      expect(participant.minted).to.equal(1);
    });

    it("Mints single token", async () => {
      const accounts = await createWallets(4);
      await Promise.all(accounts.map(acc => raffle.connect(acc).buyTicket(ticketPaymentOver)));

      const ticket = await raffle.buyTicket(ticketPaymentOver);
      await ticket.wait();

      // request randomness 
      await (await raffle.requestRandomness()).wait();
      const requestId = await raffle.getRequestId();
      // fulfill request
      await (await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, raffle.address)).wait()

      const mint = await raffle.mint();
      await mint.wait();

      const participant = await raffle.participants(await ethers.provider.getSigner().getAddress());
      expect(participant.minted).to.equal(1);
    });

    it("Can't mint with no ticket", async () => {
      await expect(raffle.mint()).to.be.revertedWith("Address does not own a ticket");
    });

    it("Ticket owned by participant decreases on mint", async () => {
      const accounts = await createWallets(4);
      await Promise.all(accounts.map(acc => raffle.connect(acc).buyTicket(ticketPaymentOver)));

      const ticket = await raffle.buyTicket(ticketPaymentOver);
      await ticket.wait();

      // request randomness 
      await (await raffle.requestRandomness()).wait();
      const requestId = await raffle.getRequestId()
      // fulfill request
      await (await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, raffle.address)).wait()

      const mint = await raffle.mint();
      await mint.wait();

      await expect(raffle.mint()).to.be.revertedWith("Address does not own a ticket");
      const participant = await raffle.participants(await ethers.provider.getSigner().getAddress());
      expect(participant.minted).to.equal(1);
    });

    it("NFTsIds to be minted should have a length equal to the numbers of tickets bought", async () => {
      const accounts = await createWallets(AVAILABLE_SUPPLY);

      await Promise.all(accounts.map(acc => raffle.connect(acc).buyTicket(ticketPaymentOver)));
      expect(await raffle.getNFTsIdLength()).to.equal(AVAILABLE_SUPPLY);
    });

    it("NFTsId length should decrease on every mint", async () => {
      const accounts = await createWallets(5);

      await Promise.all(accounts.map(acc => raffle.connect(acc).buyTicket(ticketPaymentOver)));

      // request randomness 
      await (await raffle.requestRandomness()).wait();
      const requestId = await raffle.getRequestId()
      // fulfill request
      await (await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, raffle.address)).wait()

      // available supply less one since contract index starts at 0
      for (let i = AVAILABLE_SUPPLY.toNumber() - 1; i >= 0; i--) {
        const mint = await raffle.connect(accounts[i]).mint();
        await mint.wait();

        // console.log(await raffle.participants(accounts[i].getAddress()));
        // console.log(await raffle.getNFTsIdLength());

        expect(await raffle.getNFTsIdLength()).to.be.equal(i);
      }
    });

    it("Raffle closes when all tickets are bougth", async () => {
      const accounts = await createWallets(AVAILABLE_SUPPLY - 1);

      console.log(await raffle.AVAILABLE_SUPPLY())
      console.log(await raffle.getSoldTickets())
      await Promise.all(
        accounts
        .map(
          acc => raffle.connect(acc).buyTicket({value: MINT_COST})
        )
      );

      console.log(await raffle.getSoldTickets())
      expect(await raffle.isRaffleOpen()).to.be.equal(true)
      await raffle.buyTicket({value: MINT_COST})
      console.log(await raffle.AVAILABLE_SUPPLY())
      expect(await raffle.isRaffleOpen()).to.be.equal(false)

    });

    it ("Raffle closes after a certain block number", async () => {
      // const accounts = await createWallets(AVAILABLE_SUPPLY - 1);
      expect(await raffle.isRaffleOpen()).to.be.equal(true)
      console.log(await raffle.RAFFLE_FINALIZATION_BLOCKNUMBER());
      await raffle.buyTicket({value: MINT_COST})
      
      // advance 1000 blocks
      await hre.network.provider.send("hardhat_mine", ["0x3e6"]);
    
      expect(await raffle.isRaffleOpen()).to.be.equal(false)
    });


    it("has no repeated IDs for NFTs", async () => {
      const accounts = await createWallets(AVAILABLE_SUPPLY);
      await Promise.all(accounts.map(acc => raffle.connect(acc).buyTicket(ticketPaymentOver)));

      // request randomness 
      await (await raffle.requestRandomness()).wait();
      const requestId = await raffle.getRequestId()
      // fulfill request
      await (await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, raffle.address)).wait()

      await Promise.all(accounts.map(acc => raffle.connect(acc).mint()));

      let participants = await Promise.all(accounts.map(acc => raffle.participants(acc.getAddress())));

      let uniqueNFTsIds = [];
      let duplicatesNFTsIds = [];

      participants.forEach((participant) => {
        const NFTId = participant.tokenId.toNumber();

        if (uniqueNFTsIds.includes(NFTId)) {
          duplicatesNFTsIds.push(NFTId);
        } else {
          uniqueNFTsIds.push(NFTId);
        }
      });

      expect(duplicatesNFTsIds).be.be.empty;
    });
  });

  describe("Payable", function () {
    it("Should withdraw", async () => {
      const accounts = await createWallets(AVAILABLE_SUPPLY);
      await Promise.all(accounts.map(acc => raffle.connect(acc).buyTicket(ticketPaymentOver)));

      // request randomness 
      await (await raffle.requestRandomness()).wait();
      const requestId = await raffle.getRequestId()
      // fulfill request
      await (await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, raffle.address)).wait()

      await Promise.all(accounts.map(acc => raffle.connect(acc).mint()));

      let raffleBalance = await ethers.provider.getBalance(raffle.address);
      // let parsedRaffleBalance = ethers.utils.formatEther(raffleBalance.toString());

      expect(raffleBalance.toString()).to.equal(MINT_COST.mul(5));

      const withdraw = await raffle.withdrawRaffleProceeds();
      await withdraw.wait();

      raffleBalance = await ethers.provider.getBalance(raffle.address);
      parsedRaffleBalance = ethers.utils.formatEther(raffleBalance.toString());

      expect(parsedRaffleBalance).to.equal("0.0");
    })
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
      value: ethers.utils.parseEther('0.2')
    })
    wallets.push(w)
  }

  return wallets
}
