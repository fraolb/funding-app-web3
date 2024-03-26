const { assert, expect } = require("chai");
const { deployments, getNamedAccounts } = require("hardhat");
require("ethers");
const hre = require("hardhat");

describe("FundeMe", async function () {
  let fundMe;
  let priceFeedAddressLocal = "0x694AA1769357215DE4FAC081bf1f309aDC325306";
  const sendValue = ethers.parseEther("1");

  beforeEach(async function () {
    fundMe = await hre.ethers.deployContract("FundMe", [
      "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    ]);
  });

  describe("constructor", function () {
    it("check the price feed address", async function () {
      const priceFeedAddress = await fundMe.priceFeed();

      assert.equal(priceFeedAddress, priceFeedAddressLocal);
    });
  });

  describe("fund", function () {
    it("Fails if you dont send enough ETh", async function () {
      // const fund = await fundMe.fund();

      await expect(fundMe.fund({ value: 0 })).to.be.revertedWith(
        "Didnt send enough"
      );
    });

    it("updates the amount funded", async function () {
      console.log(sendValue);
      await fundMe.fund({ value: sendValue });

      const response = await fundMe.priceFeed();

      assert.equal(response.toString(), sendValue.toString());
    });

    // it("Adds funder to array of funders", async () => {
    //   await fundMe.fund({ value: sendValue });

    //   const response = await fundMe.funders[0];

    //   assert.equal(response, priceFeedAddressLocal);
    // });
  });
});
