const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ShuffleOne", function() {
  const ticketPaymentOver = {
    value: ethers.utils.parseEther("0.1")
  };

  let raffle, AVAILABLE_SUPPLY;
  
  beforeEach(async() => {
    const Raffle = await ethers.getContractFactory("ShuffleOne");
    raffle = await Raffle.deploy(5, ethers.utils.parseEther("0.1"));
    await raffle.deployed();

    AVAILABLE_SUPPLY = await raffle.AVAILABLE_SUPPLY(); 
  });

  describe("BuyTicket", function() {

    it("Should buy a ticket", async() => {
      const ticket = await raffle.buyTicket(ticketPaymentOver);
      await ticket.wait();
  
      const participant = await raffle.participants(await ethers.provider.getSigner().getAddress());
      expect(participant.ownedTickets).to.equal(1);
    });
    
    it("should revert on incorrect payment", async() => {
      const insufficientFee = {value:ethers.utils.parseEther('.01')};

      await expect(raffle.buyTicket(insufficientFee)).to.be.revertedWith("Insufficient payment");
    });
  
    it("Cannot buy more than maximum per address", async() => {
      const max_per_address = await raffle.MAX_PER_ADDRESS();
  
      for(let i = 0; i < max_per_address.toNumber(); i++ ) {
        await raffle.buyTicket(ticketPaymentOver);
      }
      await expect(raffle.buyTicket(ticketPaymentOver)).to.be.revertedWith("Address owns ticket");
    });
  
    it("Revert when buying more than the available supply", async() => {
      
      const accounts = await createWallets(AVAILABLE_SUPPLY);
  
      await Promise.all(accounts.map(acc => raffle.connect(acc).buyTicket(ticketPaymentOver)))

      await expect(raffle.buyTicket(ticketPaymentOver)).to.be.revertedWith("All tickets sold");
    });

    it("Gets tickets sold", async() => {
      const accounts = await createWallets(5);

      for(let i = 0; i < AVAILABLE_SUPPLY.toNumber(); i++) { 
        await raffle.connect(accounts[i]).buyTicket(ticketPaymentOver);

        expect(await raffle.geSoldTickets()).to.be.equal(i +1);
      }
    });
  });

  describe("Mint token", function() {

    it("Should revert on mint if not all tokens have been sold", async() => {
      const ticket = await raffle.buyTicket(ticketPaymentOver);
      await ticket.wait();

      await expect(raffle.mint()).to.be.revertedWith("Raffle still open")
    });
    
    it("Mints single token", async() => {

      const accounts = await createWallets(4);
      await Promise.all(accounts.map(acc => raffle.connect(acc).buyTicket(ticketPaymentOver)));

      const ticket = await raffle.buyTicket(ticketPaymentOver);
      await ticket.wait();

      const mint = await raffle.mint();
      await mint.wait();

      const participant = await raffle.participants(await ethers.provider.getSigner().getAddress());
      expect(participant.minted).to.equal(1);
    });

    it("Can't mint with no ticket", async() => {
      await expect(raffle.mint()).to.be.revertedWith("Address does not own a ticket");
    });

    it("Ticket owned by participant decreases on mint", async() => {
      const accounts = await createWallets(4);
      await Promise.all(accounts.map(acc => raffle.connect(acc).buyTicket(ticketPaymentOver)));

      const ticket = await raffle.buyTicket(ticketPaymentOver);
      await ticket.wait();

      const mint = await raffle.mint();
      await mint.wait();

      await expect(raffle.mint()).to.be.revertedWith("Address does not own a ticket");
      const participant = await raffle.participants(await ethers.provider.getSigner().getAddress());
      expect(participant.minted).to.equal(1);
    });

    it("NFTsIds to be minted should have a length equal to the numbers of tickets bought", async() => {
      const accounts = await createWallets(AVAILABLE_SUPPLY);

      await Promise.all(accounts.map(acc => raffle.connect(acc).buyTicket(ticketPaymentOver)));
      expect(await raffle.getNFTsIdLength()).to.equal(AVAILABLE_SUPPLY);
    });

    it("NFTsId length should decrease on every mint", async() => {
      const accounts = await createWallets(5);

      await Promise.all(accounts.map(acc => raffle.connect(acc).buyTicket(ticketPaymentOver)));
      
      // available supply less one since contract index starts at 0
      for(let i = AVAILABLE_SUPPLY.toNumber()-1; i >= 0; i--) {

        const mint = await raffle.connect(accounts[i]).mint();
        await mint.wait();
        
        // console.log(await raffle.participants(accounts[i].getAddress()));
        // console.log(await raffle.getNFTsIdLength());
        
        expect(await raffle.getNFTsIdLength()).to.be.equal(i);
      }
    });

    it("has no repeated IDs for NFTs", async() => {
      const accounts = await createWallets(AVAILABLE_SUPPLY);
      await Promise.all(accounts.map(acc => raffle.connect(acc).buyTicket(ticketPaymentOver)));

      await Promise.all(accounts.map(acc => raffle.connect(acc).mint()))

      let participants = await Promise.all(accounts.map(acc=>raffle.participants(acc.getAddress())))

      let uniqueNFTsIds = [];
      let duplicatesNFTsIds = [];

      participants.forEach((participant) => {
        const NFTId = participant.tokenId.toNumber();

        if(uniqueNFTsIds.includes(NFTId)) {
          duplicatesNFTsIds.push(NFTId);
        } else {
          uniqueNFTsIds.push(NFTId);
        }
      });

      expect(duplicatesNFTsIds).be.be.empty;
    });
  });

  describe("Payable", function() {
    it("Should withdraw", async() => {
      const accounts = await createWallets(AVAILABLE_SUPPLY);
      await Promise.all(accounts.map(acc => raffle.connect(acc).buyTicket(ticketPaymentOver)));
      await Promise.all(accounts.map(acc => raffle.connect(acc).mint()));

      let raffleBalance = await ethers.provider.getBalance(raffle.address);
      let parsedRaffleBalance = ethers.utils.formatEther(raffleBalance.toString());
      
      expect(parsedRaffleBalance).to.equal("0.5");

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
