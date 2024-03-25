const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("FundMeModule", (m) => {
  const fund = m.contract("FundMe");

  return { fund };
});
