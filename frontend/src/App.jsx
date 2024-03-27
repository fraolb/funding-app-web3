import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";

function App() {
  let signer = null;
  let provider;

  const ContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const ABI = [
    {
      inputs: [
        {
          internalType: "address",
          name: "priceFeedAddress",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "FundMe__NotOwner",
      type: "error",
    },
    {
      stateMutability: "payable",
      type: "fallback",
    },
    {
      inputs: [],
      name: "MINIMUM_USD",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "cheaperWithdraw",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "fund",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "i_owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "s_addressToAmountFunded",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "s_funders",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "s_priceFeed",
      outputs: [
        {
          internalType: "contract AggregatorV3Interface",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "withdrawFunc",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      stateMutability: "payable",
      type: "receive",
    },
  ];

  //user data
  const [userWalletAddress, setUserWalletAddress] = useState("");
  const [userETHBalance, setUserETHBalance] = useState(0);

  ///fund ETH
  const [sendETH, setSendETH] = useState("1");
  const [contractETH, setContractETH] = useState(0);

  async function connect() {
    if (window.ethereum == null) {
      console.log("MetaMask not installed; using read-only defaults");
      provider = ethers.getDefaultProvider();
    } else {
      provider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.enable();
      signer = await provider.getSigner();

      //fetch and store user Data
      const userAddress = await signer.getAddress();
      setUserWalletAddress(userAddress);
      const userBalance = await GetETHBalance(userAddress);
      setUserETHBalance(userBalance);

      //fetch and store contract data
      const contractBalance = await GetETHBalance(ContractAddress);
      setContractETH(contractBalance);

      console.log("connected!");
    }
  }

  const GetETHBalance = async (e) => {
    if (window.ethereum != null) {
      provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(e);
      const actualValue = ethers.formatEther(balance);
      return actualValue;
    } else {
      console.log("Please install metamask");
    }
  };

  const Fund = async () => {
    if (window.ethereum != null) {
      provider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.enable();
      signer = await provider.getSigner();

      const contract = new ethers.Contract(ContractAddress, ABI, signer);
      console.log("the contract is ", contract);
      try {
        const FundAccount = await contract.fund({
          value: ethers.parseEther(sendETH),
        });

        const receipt = await FundAccount.wait();
        console.log("the receipt is ", receipt);
        console.log("Done!");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const Withdraw = async () => {
    if (window.ethereum != null) {
      provider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.enable();
      signer = await provider.getSigner();

      const contract = new ethers.Contract(ContractAddress, ABI, signer);
      console.log("the contract is ", contract);
      try {
        const Withdraw = await contract.withdrawFunc();

        const receipt = await Withdraw.wait();
        console.log("the receipt is ", receipt);
        console.log("Done!");
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    connect();
  });
  return (
    <>
      A Simple Funding APP
      <div>
        <div>The contract ETH is: {contractETH}</div>
      </div>
      <div>The user address is: {userWalletAddress}</div>
      <div>The user ETH balance is: {userETHBalance}</div>
      <div style={{ display: "flex" }}>
        <div>{sendETH}</div>
        <button onClick={() => Fund()}>Fund</button>
      </div>
      <div>
        <button onClick={() => Withdraw()}>Withdraw</button>
      </div>
    </>
  );
}

export default App;
