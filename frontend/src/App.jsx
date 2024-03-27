import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";

function App() {
  let signer = null;
  let provider;

  let ContractAddress;

  //user data
  const [userWalletAddress, setUserWalletAddress] = useState("");
  const [userETHBalance, setUserETHBalance] = useState(0);

  async function connect() {
    if (window.ethereum == null) {
      console.log("MetaMask not installed; using read-only defaults");
      provider = ethers.getDefaultProvider();
    } else {
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();

      //fetch and store user Data
      const userAddress = await signer.getAddress();
      setUserWalletAddress(userAddress);
      const userBalance = await GetETHBalance(userAddress);
      setUserETHBalance(userBalance);

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
      signer = await provider.getSigner();

      const contract = new ethers.Contract(ContractAddress, ABI, signer);
    }
  };

  const Withdraw = async () => {};

  useEffect(() => {
    connect();
  });
  return (
    <>
      hello
      <div>The user address is: {userWalletAddress}</div>
      <div>The user ETH balance is: {userETHBalance}</div>
    </>
  );
}

export default App;
