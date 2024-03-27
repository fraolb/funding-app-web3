const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("FundMeModule", (m) => {
  const fund = m.contract("FundMe", [
    "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  ]);

  return { fund };
});
