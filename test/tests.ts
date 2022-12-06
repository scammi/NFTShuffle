import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, BigNumberish, Contract, Wallet } from "ethers";
import { ethers, deployments, network, getNamedAccounts } from "hardhat";
import {
  LinkBasicToken,
  ShuffleOne,
  VRFCoordinatorV2Mock,
} from "../typechain-types";
import "@nomicfoundation/hardhat-chai-matchers/withArgs";
import "@nomicfoundation/hardhat-chai-matchers";

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
    describe("", async () => {});
    describe("", async () => {
      beforeEach(async () => {});
      it("", async () => {});
    });
  });

  describe("feature: randomness", function () {
    describe("scenario: a ruffle uses randomness", async () => {
      let accounts: Wallet[];
      let tickets: BigNumberish[]
      beforeEach(async () => {});
      describe("GIVEN a finished ruffle and every sold ticket redeemed", async () => {
        beforeEach(async () => {
          accounts = await createWallets(5);
          tickets = await Promise.all(
            accounts.map(async(acc, i) => {
              await raffle.connect(acc).buyTicket({ value: MINT_COST });
              return i;
            })
          );

          const request = await raffle.requestRandomness();
          await request.wait();

          const fullfil = await vrfCoordinatorV2Mock.fulfillRandomWords(
            raffle.getRequestId(),
            raffle.address
          );
          await fullfil.wait();
          await Promise.all(
            accounts.map((acc, i) => raffle.connect(acc).mint(i))
          );
        });
        it("THEN NFT's total supply should be x", async () => {
          await expect(raffle.ownerOf(accounts.length + 1)).to.be.revertedWith(
            "ERC721: invalid token ID"
          );
        });
        it("THEN ", async () => {});
        it("THEN ", async () => {});
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

      describe("WHEN user buys one ticket", async () => {
        describe("BUT sends the incorrect amount", async () => {
          it("THEN reverts because amount is not exactly X", async () => {
            await expect(
              raffle.buyTicket({ value: MINT_COST.sub(1) })
            ).to.be.revertedWithCustomError(raffle, "NotEnoughEther");
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
          it("THEN sold tickets counter increases", async () => {
            // beforeEach(async () => {})
            const soldTicketsCounterBefore = await raffle.getSoldTickets()
            await raffle.connect(anotherUser).buyTicket({ value: MINT_COST })
            expect(await raffle.getSoldTickets()).to.be.greaterThan(soldTicketsCounterBefore)
          });
          describe("WHEN user buys another ticket", async () => {
            it("THEN reverts because there is one ticket per address limit", async () => {
              await expect(
                raffle.buyTicket({ value: MINT_COST })
              ).to.be.revertedWithCustomError(raffle, "MaxTicketsPerAddress");
            });
          });
        });
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
      });

    });
  });

  // explain what the hardcoded numbers mean
  describe("feature: raffle life cycle", async () => {
    describe("GIVEN a new raffle with default params", async () => {
      beforeEach(async () => {});

      describe("WHEN raffle is OPEN", async () => {
        it("THEN raffle has available tickets to buy", async () => {
          expect(await raffle.getSoldTickets()).to.be.lessThan(5);
        });
        it("THEN block number is lower than configured", async () => {
          expect(await ethers.provider.getBlockNumber()).to.be.lessThan(1000);
        });
        it("THEN is not possible to mint even though you have a redeemable ticket", async () => {
          await expect(raffle.mint(0)).to.be.reverted;
        });
        describe("AND all tickets are sold", async () => {
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
          it("THEN raffle status is CLOSED", async () => {
            expect(await raffle.getStatus()).to.be.eq(1);
          });
        });
      });
      describe("WHEN raffle is CLOSED", async () => {
        beforeEach(async () => {
          await network.provider.send("hardhat_mine", ["0x3e8"]);
        });

        it("THEN is not possible to buy more tickets", async () => {
          await expect(raffle.buyTicket({ value: MINT_COST })).to.be.reverted;
        });
        it("THEN block number is greater than configured", async () => {
          expect(await ethers.provider.getBlockNumber()).to.be.greaterThan(
            1000
          );
        });
        it("THEN is not possible to mint", async () => {
          await expect(raffle.mint(0)).to.be.reverted;
        });
      });
      describe("WHEN raffle is REQUESTING", async () => {
        beforeEach(async () => {
          await network.provider.send("hardhat_mine", ["0x3e8"]);
          const request = await raffle.requestRandomness();
          await request.wait();
        });

        it("THEN requestId is not zero", async () => {
          expect(await raffle.getRequestId()).to.be.not.equal(0);
        });
        it("THEN is not possible to request randomness", async () => {
          await expect(raffle.requestRandomness()).to.be.reverted;
        });
        it("THEN is possible to fulfill request", async () => {
          const fullfil = await vrfCoordinatorV2Mock.fulfillRandomWords(
            raffle.getRequestId(),
            raffle.address
          );
          await fullfil.wait();
        });
        it("THEN is not possible to mint", async () => {
          await expect(raffle.mint(0)).to.be.reverted;
        });
      });
      describe("WHEN raffle is FINISHED", async () => {
        beforeEach(async () => {
          raffle = raffle.connect(user);
          await raffle.buyTicket({ value: MINT_COST });

          // replace with constant
          await network.provider.send("hardhat_mine", ["0x3e8"]);

          const request = await raffle.requestRandomness();
          await request.wait();

          const fullfil = await vrfCoordinatorV2Mock.fulfillRandomWords(
            raffle.getRequestId(),
            raffle.address
          );
          await fullfil.wait();
        });
        it("THEN entropy is not zero", async () => {
          expect(await raffle._entropy()).to.be.not.equal(0);
        });
        it("THEN is possible to mint", async () => {
          await expect(raffle.connect(user).mint(0)).emit(raffle, "Minted");
        });
      });

      it("", async () => {});
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
      beforeEach(async () => {
        raffle = raffle.connect(user);
        await raffle.buyTicket({ value: MINT_COST });
      });
      it("THEN ", async () => {});
      describe("AND a finished raffle", async () => {
        beforeEach(async () => {
          // replace with constant
          await network.provider.send("hardhat_mine", ["0x3e8"]);

          const request = await raffle.requestRandomness();
          await request.wait();

          const fullfil = await vrfCoordinatorV2Mock.fulfillRandomWords(
            raffle.getRequestId(),
            raffle.address
          );
          await fullfil.wait();
        });
        describe("WHEN a user redeems a ticket", async () => {
          beforeEach(async () => {
            await raffle.connect(user).mint(0);
          });
          it("THEN the user's amount of redeemable tickets decreases", async () => {
            expect(
              await (
                await raffle.participants(user.address)
              ).redeemableTickets
            ).to.be.equal(0);
          });
        });
      });
    });
    describe("GIVEN a user with zero redeemable tickets", async () => {
      it("THEN ", async () => {});
    });
  });

  describe("scenario: owner withdraw funds", async () => {
    describe("GIVEN a raffle with some funds in it", async () => {
      beforeEach(async () => {
        await raffle.connect(user).buyTicket({ value: MINT_COST });
      });
      it("THEN the owner can withdraw funds", async () => {
        await raffle.connect(admin).withdrawTo(anotherUser.address);
      });
      it("THEN non-owner cannot withdraw funds", async () => {
        await expect(
          raffle.connect(user).withdrawTo(anotherUser.address)
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });
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
      value: ethers.utils.parseEther("0.5"),
    });
    wallets.push(w);
  }

  return wallets;
}
