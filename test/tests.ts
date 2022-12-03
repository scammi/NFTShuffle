import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, BigNumberish, Contract, Wallet } from "ethers";
import { ethers, deployments, network, getNamedAccounts } from "hardhat";
import {
  LinkBasicToken,
  ShuffleOne,
  VRFCoordinatorV2Mock,
} from "../typechain-types";
// import {} from "hardhat/config"
import "@nomicfoundation/hardhat-chai-matchers/withArgs";
import "@nomicfoundation/hardhat-chai-matchers";

// const chainlinkSetup = deployments.createFixture(
//   async ({deployments, getNamedAccounts, ethers}, options) => {
//     await deployments.fixture(); // ensure you start from a fresh deployments
//     const { coordinator } = await getNamedAccounts();
//     const Coordinator = await (await ethers.getContractFactory('VRFCoordinatorV2Interface', deployer)).attach(coordinator);
//     // return {
//     //   tokenOwner: {
//     //     address: tokenOwner,
//     //     TokenContract,
//     //   },
//     // };
//   }, "chainlink"
// );

describe("ShuffleOne", function () {
  let raffle: ShuffleOne,
    vrfCoordinatorV2Mock: VRFCoordinatorV2Mock,
    AVAILABLE_SUPPLY: number;

  let MINT_COST = ethers.utils.parseEther("0.1");

  const ticketPaymentOver = {
    value: MINT_COST,
  };
  let user: SignerWithAddress,
    anotherUser: SignerWithAddress,
    admin: SignerWithAddress;

  beforeEach(async () => {
    await network.provider.send("hardhat_reset");

    // await chainlinkSetup()
    const fixtures = await deployments.fixture(["all", "ShuffleOne"]);
    raffle = await ethers.getContractAt(
      "ShuffleOne",
      fixtures["ShuffleOne"].address
    );
    vrfCoordinatorV2Mock = await ethers.getContractAt(
      "VRFCoordinatorV2Mock",
      fixtures["VRFCoordinatorV2Mock"].address
    );

    AVAILABLE_SUPPLY = (await raffle.TICKETS_AMOUNT()).toNumber();

    [admin, user, anotherUser] = await ethers.getSigners();
  });

  // useful lines to copy
  describe("", async () => {
    describe("", async () => {
      beforeEach(async () => {});
      it("", async () => {});
    });
  });

  describe.only("RandomArray", async () => {
    describe("with N == 50", async () => {
      let amount = 50;
      let entropy = BigNumber.from(777);
      let lib: Contract;
      beforeEach(async () => {
        lib = await ethers.deployContract("RandomArray");
        await lib.deployed();
        lib = await ethers.getContractAt("RandomArray", lib.address);
      });
      function hasDuplicates(arr: any[]): boolean {
        return arr.some((item, index) => arr.indexOf(item) !== index);
      }
      it("", async () => {
        const ids = new Array(amount).fill(null).map((_, i) => i + 1);
        const newArray = [];
        let n: BigNumber;
        let prev: BigNumber = entropy;
        for (const id of ids) {
          // n = await lib.next(prev);
          newArray.push(entropy.mul(id).mod(amount))
          // newArray.push(n.add(id).mod(amount).toNumber());
          // prev = n;
          // newArray.push()
        }
        // console.log(newArray)
        expect(hasDuplicates(newArray)).be.false;
      });
      it("", async () => {});
      it("", async () => {});
    });
  });

  describe.skip("feature: randomness", function () {
    it("requestRandom can only be called when raffle is CLOSED", async () => {});
    it("when request", async () => {});
    describe("scenario: a ruffle uses randomness", async () => {
      let accounts: Wallet[];
      beforeEach(async () => {
        accounts = await createWallets(5);
        await Promise.all(
          accounts.map((acc) =>
            raffle.connect(acc).buyTicket({ value: MINT_COST })
          )
        );

        const request = await raffle.requestRandomness();
        await request.wait();

        const fullfil = await vrfCoordinatorV2Mock.fulfillRandomWords(
          raffle.getRequestId(),
          raffle.address
        );
        await fullfil.wait();
      });
      describe("GIVEN a ruffle with status finished", async () => {
        describe("WHEN all tickets are redeemed", async () => {
          beforeEach(async () => {
            await Promise.all(
              accounts.map((acc) => raffle.connect(acc).mint())
            );
          });

          it("THEN NFT's total supply should be x", async () => {
            await expect(
              raffle.ownerOf(accounts.length + 1)
            ).to.be.revertedWith("ERC721: invalid token ID");
          });
          it("THEN ", async () => {});
          it("THEN ", async () => {});
        });
      });
    });
  });

  describe("scenario: new raffle with default params", function () {
    describe("GIVEN a new raffle", function () {
      beforeEach(async () => {});
      it("THEN raffle status is OPEN", async () => {
        // use enum / constant
        expect(await raffle.getStatus()).to.be.equal(0);
      });
      describe("WHEN raffle ends because time's up", async () => {
        beforeEach(async () => {
          // replace with constant
          await network.provider.send("hardhat_mine", ["0x3e8"]);
        });

        it("THEN raffle status is CLOSED", async () => {
          // use enum / constant
          expect(await raffle.getStatus()).to.be.equal(1);
        });

        it("THEN no one can buy more tickets", async () => {
          await expect(
            raffle.buyTicket({ value: MINT_COST })
          ).to.be.revertedWithCustomError(raffle, "RaffleHasEnded");
        });

        it("THEN anyone can call requestRandomness", async () => {
          await expect(raffle.requestRandomness()).to.emit(
            vrfCoordinatorV2Mock,
            "RandomWordsRequested"
          );
        });
        describe("AND requestRandomness is called", async () => {
          let requestId: BigNumber;
          beforeEach(async () => {
            // const fullfil = await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, raffle.address)
            // await fullfil.wait()
            const request = await raffle.requestRandomness();
            await request.wait();
            requestId = await raffle.getRequestId();
          });
          it("THEN raffle status is REQUESTING", async () => {
            expect(await raffle.getStatus()).to.be.equal(2);
          });
          it("THEN raffle requestId is non-zero", async () => {
            expect(await raffle.getRequestId()).to.be.not.equal(0);
          });
          it("THEN after the request is fulfill the entropy is not zero", async () => {
            const fullfil = await vrfCoordinatorV2Mock.fulfillRandomWords(
              raffle.getRequestId(),
              raffle.address
            );
            await fullfil.wait();
            // check entropy is non zero
          });
        });
      });

      describe("WHEN user buys one ticket", async () => {
        describe("BUT sends the incorrect amount", async () => {
          it("THEN reverts because amount is lower than required", async () => {
            await expect(
              raffle.buyTicket({ value: MINT_COST.sub(1) })
            ).to.be.revertedWithCustomError(raffle, "NotEnoughEther");
          });
          it("THEN reverts because amount is greater than required", async () => {
            await expect(
              raffle.buyTicket({ value: MINT_COST.add(1) })
            ).to.be.revertedWithCustomError(raffle, "NotEnoughEther");
          });
        });

        describe("AND sends the correct amount", async () => {
          beforeEach(async () => {
            raffle = raffle.connect(user);
            const ticket = await raffle.buyTicket({ value: MINT_COST });
            await ticket.wait();
          });
          it("THEN user has one redeemable ticket", async () => {
            // beforeEach(async () => {})
            const participant = await raffle.participants(user.address);
            expect(participant.redeemableTickets).to.equal(1);
          });
          describe("WHEN user buys another ticket", async () => {
            it("THEN reverts because there is one ticket per address limit", async () => {
              await expect(
                raffle.buyTicket({ value: MINT_COST })
              ).to.be.revertedWithCustomError(raffle, "MaxTicketsPerAddress");
            });
          });
        });
        // it('AND there are no tickets left to buy', async() => {})
        // it('BUT msg.value is too low', async() => {})
      });

      describe("WHEN all tickets were sold", async () => {
        let accounts: Wallet[];
        beforeEach(async () => {
          accounts = await createWallets(4);
          await Promise.all(
            accounts.map((acc) =>
              raffle.connect(acc).buyTicket({ value: MINT_COST })
            )
          );
          raffle = raffle.connect(user);
          const ticket = await raffle.buyTicket({ value: MINT_COST });
          await ticket.wait();
        });
        it("THEN anyone can request randomness", async () => {});
        it("THEN it is not possible to buy a ticket", async () => {});

        // describe('BUT entropy is not set', async() => {
        describe("BUT randomness is not requested", async () => {
          it("THEN anyone can request randomness", async () => {});
        });

        describe("AND randomness is requested", async () => {
          it("THEN request randomness reverts", async () => {});
        });
        describe("AND entropy is not set", async () => {
          it("THEN reverts", async () => {});
        });

        describe("AND entropy is set", async () => {
          beforeEach(async () => {
            const request = await raffle.requestRandomness();
            await request.wait();
            const requestId = await raffle.getRequestId();
            // fulfill request
            const fullfil = await vrfCoordinatorV2Mock.fulfillRandomWords(
              requestId,
              raffle.address
            );
            await fullfil.wait();
          });
          it("THEN entropy is not zero", async () => {
            expect(raffle._entropy()).to.be.not.equal(0);
          });

          describe("AND user redeem a ticket", async () => {
            beforeEach(async () => {
              await raffle.mint();
            });
            it("THEN user has zero redeemable tickets left", async () => {
              const participant = await raffle.participants(user.address);
              expect(participant.redeemableTickets).to.equal(0);
              expect(await raffle.balanceOf(user.address)).to.equal(1);
            });
            it("THEN NFT is minted to user", async () => {
              expect(await raffle.balanceOf(user.address)).to.equal(1);
            });
            it("THEN it is not possible to buy a ticket", async () => {});
          });
        });
      });
    });
  });

  describe("scenario: users redeem tickets", async () => {
    describe("GIVEN a sold out raffle", async () => {
      let accounts: Wallet[];
      beforeEach(async () => {
        accounts = await createWallets(5);
        await Promise.all(
          accounts.map((acc) =>
            raffle.connect(acc).buyTicket({ value: MINT_COST })
          )
        );
        raffle = raffle.connect(user);
      });

      it("THEN anyone can request randomness", async () => {
        const [anyUser] = await createWallets(1);

        await raffle.connect(anyUser).requestRandomness();
      });
      it("THEN it is not possible to buy a ticket", async () => {
        await expect(
          raffle.buyTicket({ value: MINT_COST })
        ).to.be.revertedWithCustomError(raffle, "TicketsSoldOut");
      });

      describe("BUT randomness is not requested", async () => {
        it("THEN anyone can request randomness", async () => {});
      });

      describe("AND randomness is requested", async () => {
        it("THEN request randomness reverts", async () => {});
      });
      describe("AND entropy is not set", async () => {
        it("THEN reverts", async () => {});
      });

      describe("WHEN all tickets are redeemed", async () => {
        it("THEN ", async () => {});
      });
    });
    describe("GIVEN a user with some redeemable tickets", async () => {
      it("THEN ", async () => {});
      it("THEN ", async () => {});
      describe("WHEN a user redeems a ticket", async () => {
        it("THEN the user's amount of redeemable tickets decreases", async () => {});
      });
    });
    describe("GIVEN a user with zero redeemable tickets", async () => {
      it("THEN ", async () => {});
    });
  });

  describe.skip("BuyTicket", function () {
    it("Should buy a ticket", async () => {
      const ticket = await raffle.buyTicket(ticketPaymentOver);
      await ticket.wait();

      const participant = await raffle.participants(
        await ethers.provider.getSigner().getAddress()
      );
      // expect(participant.ownedTickets).to.equal(1);
      expect(participant).to.equal(1);
    });

    it("should revert on incorrect payment", async () => {
      const insufficientFee = "0.001";

      await expect(
        raffle.buyTicket({ value: ethers.utils.parseEther(insufficientFee) })
      ).to.be.revertedWith("Insufficient payment");
    });

    it("Cannot buy more than maximum per address", async () => {
      const max_per_address = await raffle.MAX_PER_ADDRESS();

      for (let i = 0; i < max_per_address.toNumber(); i++) {
        await raffle.buyTicket(ticketPaymentOver);
      }
      await expect(raffle.buyTicket(ticketPaymentOver)).to.be.revertedWith(
        "Address owns ticket"
      );
    });

    it("Revert when buying more than the available supply", async () => {
      const accounts = await createWallets(AVAILABLE_SUPPLY);

      await Promise.all(
        accounts.map((acc) => raffle.connect(acc).buyTicket(ticketPaymentOver))
      );

      await expect(raffle.buyTicket(ticketPaymentOver)).to.be.revertedWith(
        "All tickets sold"
      );
    });

    it("Gets tickets sold", async () => {
      const accounts = await createWallets(5);

      for (let i = 0; i < AVAILABLE_SUPPLY; i++) {
        await raffle.connect(accounts[i]).buyTicket(ticketPaymentOver);

        expect(await raffle.getSoldTickets()).to.be.equal(i + 1);
      }
    });

    it("Should disallow buying ticket after block number", async () => {
      // get RAFFLE_FINALIZATION_BLOCKNUMBER

      const raffleEndBlock = await raffle.FINALIZATION_BLOCKNUMBER();
      expect(raffleEndBlock.toNumber()).to.equal(1007);

      const accounts = await createWallets(2);

      // buy ticket before time lock should be enabled
      const ticket = await raffle
        .connect(accounts[0])
        .buyTicket(ticketPaymentOver);
      await ticket.wait();
      const participant = await raffle.participants(
        await accounts[0].getAddress()
      );
      expect(participant).to.equal(1);

      // should revert with message if buying after timelock.
      // mine 1000 blocks with an interval of 1 minute
      await network.provider.send("hardhat_mine", ["0x3e8"]);
      await expect(
        raffle.connect(accounts[1]).buyTicket(ticketPaymentOver)
      ).to.be.revertedWith("Raffle has ended");
    });
  });

  describe.skip("Mint token", function () {
    it.skip("Should revert on mint if not all tokens have been sold", async () => {
      const ticket = await raffle.buyTicket(ticketPaymentOver);
      await ticket.wait();

      await expect(raffle.mint()).to.be.revertedWith("Raffle still open");
    });

    it("Allows to mint and request randomness after block finalization, even though not all tickets are sold", async () => {
      await expect(raffle.requestRandomness()).to.be.revertedWith(
        "Raffle still open"
      );
      const ticket = await raffle.buyTicket(ticketPaymentOver);
      await ticket.wait();

      await network.provider.send("hardhat_mine", ["0x3e8"]);

      // request randomness
      await (await raffle.requestRandomness()).wait();
      const requestId = await raffle.getRequestId();
      // fulfill request
      await (
        await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, raffle.address)
      ).wait();

      const mint = await raffle.mint();
      await mint.wait();

      const participant = await raffle.participants(
        await ethers.provider.getSigner().getAddress()
      );
      expect(participant).to.equal(0);
    });

    it("Mints single token", async () => {
      const accounts = await createWallets(4);
      await Promise.all(
        accounts.map((acc) => raffle.connect(acc).buyTicket(ticketPaymentOver))
      );

      const ticket = await raffle.buyTicket(ticketPaymentOver);
      await ticket.wait();

      // request randomness
      await (await raffle.requestRandomness()).wait();
      const requestId = await raffle.getRequestId();
      // fulfill request
      await (
        await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, raffle.address)
      ).wait();

      const mint = await raffle.mint();
      await mint.wait();

      const participant = await raffle.participants(
        await ethers.provider.getSigner().getAddress()
      );
      expect(participant).to.equal(1);
    });

    it("Can't mint with no ticket", async () => {
      await expect(raffle.mint()).to.be.revertedWith(
        "Address does not own a ticket"
      );
    });

    it("Ticket owned by participant decreases on mint", async () => {
      const accounts = await createWallets(4);
      await Promise.all(
        accounts.map((acc) => raffle.connect(acc).buyTicket(ticketPaymentOver))
      );

      const ticket = await raffle.buyTicket(ticketPaymentOver);
      await ticket.wait();

      // request randomness
      await (await raffle.requestRandomness()).wait();
      const requestId = await raffle.getRequestId();
      // fulfill request
      await (
        await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, raffle.address)
      ).wait();

      const mint = await raffle.mint();
      await mint.wait();

      await expect(raffle.mint()).to.be.revertedWith(
        "Address does not own a ticket"
      );
      const participant = await raffle.participants(
        await ethers.provider.getSigner().getAddress()
      );
      expect(participant).to.equal(1);
    });

    it("NFTsIds to be minted should have a length equal to the numbers of tickets bought", async () => {
      const accounts = await createWallets(AVAILABLE_SUPPLY);

      await Promise.all(
        accounts.map((acc) => raffle.connect(acc).buyTicket(ticketPaymentOver))
      );
      expect(await raffle.getNFTsIdLength()).to.equal(AVAILABLE_SUPPLY);
    });

    it("NFTsId length should decrease on every mint", async () => {
      const accounts = await createWallets(5);

      await Promise.all(
        accounts.map((acc) => raffle.connect(acc).buyTicket(ticketPaymentOver))
      );

      // request randomness
      await (await raffle.requestRandomness()).wait();
      const requestId = await raffle.getRequestId();
      // fulfill request
      await (
        await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, raffle.address)
      ).wait();

      // available supply less one since contract index starts at 0
      for (let i = AVAILABLE_SUPPLY - 1; i >= 0; i--) {
        const mint = await raffle.connect(accounts[i]).mint();
        await mint.wait();

        // console.log(await raffle.participants(accounts[i].getAddress()));
        // console.log(await raffle.getNFTsIdLength());

        expect(await raffle.getNFTsIdLength()).to.be.equal(i);
      }
    });

    it("Raffle closes when all tickets are bougth", async () => {
      const accounts = await createWallets(AVAILABLE_SUPPLY - 1);

      console.log(await raffle.TICKETS_AMOUNT());
      console.log(await raffle.getSoldTickets());
      await Promise.all(
        accounts.map((acc) =>
          raffle.connect(acc).buyTicket({ value: MINT_COST })
        )
      );

      console.log(await raffle.getSoldTickets());
      expect(await raffle.isRaffleOpen()).to.be.equal(true);
      await raffle.buyTicket({ value: MINT_COST });
      console.log(await raffle.TICKETS_AMOUNT());
      expect(await raffle.isRaffleOpen()).to.be.equal(false);
    });

    it("Raffle closes after a certain block number", async () => {
      // const accounts = await createWallets(AVAILABLE_SUPPLY - 1);
      expect(await raffle.isRaffleOpen()).to.be.equal(true);
      // console.log(await raffle.<s/<());
      await raffle.buyTicket({ value: MINT_COST });

      // advance 1000 blocks
      await network.provider.send("hardhat_mine", ["0x3e6"]);

      expect(await raffle.isRaffleOpen()).to.be.equal(false);
    });

    it("has no repeated IDs for NFTs", async () => {
      const accounts = await createWallets(AVAILABLE_SUPPLY);
      await Promise.all(
        accounts.map((acc) => raffle.connect(acc).buyTicket(ticketPaymentOver))
      );

      // request randomness
      await (await raffle.requestRandomness()).wait();
      const requestId = await raffle.getRequestId();
      // fulfill request
      await (
        await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, raffle.address)
      ).wait();

      await Promise.all(accounts.map((acc) => raffle.connect(acc).mint()));

      let participants = await Promise.all(
        accounts.map((acc) => raffle.participants(acc.getAddress()))
      );

      let uniqueNFTsIds: BigNumberish[] = [];
      let duplicatesNFTsIds: BigNumberish[] = [];

      // participants.forEach((participant) => {
      //   const NFTId = participant.tokenId.toNumber();

      //   if (uniqueNFTsIds.includes(NFTId)) {
      //     duplicatesNFTsIds.push(NFTId);
      //   } else {
      //     uniqueNFTsIds.push(NFTId);
      //   }
      // });

      expect(duplicatesNFTsIds).be.be.empty;
    });
  });

  describe.skip("Payable", function () {
    it("Should withdraw", async () => {
      const accounts = await createWallets(AVAILABLE_SUPPLY);
      await Promise.all(
        accounts.map((acc) => raffle.connect(acc).buyTicket(ticketPaymentOver))
      );

      // request randomness
      await (await raffle.requestRandomness()).wait();
      const requestId = await raffle.getRequestId();
      // fulfill request
      await (
        await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, raffle.address)
      ).wait();

      await Promise.all(accounts.map((acc) => raffle.connect(acc).mint()));

      let raffleBalance = await ethers.provider.getBalance(raffle.address);
      let parsedRaffleBalance = ethers.utils.formatEther(
        raffleBalance.toString()
      );

      expect(raffleBalance.toString()).to.equal(MINT_COST.mul(5));

      const withdraw = await raffle.withdrawRaffleProceeds();
      await withdraw.wait();

      raffleBalance = await ethers.provider.getBalance(raffle.address);
      parsedRaffleBalance = ethers.utils.formatEther(raffleBalance.toString());

      expect(parsedRaffleBalance).to.equal("0.0");
    });
  });
});

async function createWallets(amount: number) {
  const accounts = await ethers.getSigners();
  const wallets = [];
  const wallet = ethers.Wallet.createRandom().connect(ethers.provider);
  const mnemonic = wallet._mnemonic();
  const prefix = mnemonic.path.substr(0, mnemonic.path.length - 1);

  for (let i = 0; i < amount; i++) {
    const path = prefix + i.toString();

    const w = ethers.Wallet.fromMnemonic(mnemonic.phrase, path).connect(
      ethers.provider
    );
    await accounts[7].sendTransaction({
      to: w.address,
      value: ethers.utils.parseEther("0.2"),
    });
    wallets.push(w);
  }

  return wallets;
}
