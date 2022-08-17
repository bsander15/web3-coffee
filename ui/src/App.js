import './App.css';
import abi from './utils/BuyMeACoffee.json';
import { ethers } from 'ethers';
import React, { useState, useEffect } from 'react';


function App() {

  const contractAddress = '0xbE2Ea55D8FD3870770e72F443e6E4022c941e21C';
  const contractABI = abi.abi;

  const [currentAccount, setCurrentAccount] = useState();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [withdrawlAddr, setWithdrawlAddr] = useState('');

  useEffect(() => {
    isWalletConnected();
  }, []);
  
  const contractInstance = async ethereum => {
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      const buyMeACoffee = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      return buyMeACoffee;
    }
  }

  // Wallet connection logic
  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({method: 'eth_accounts'})
      console.log("accounts: ", accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        console.log("wallet is connected! " + account);
      } else {
        console.log("make sure MetaMask is connected");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("install Metamask")
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      })

      setCurrentAccount(accounts[0]);
    } catch (e) {
      console.log(e);
    }
  }

  const buyCoffee = async () => {
    try {
      const { ethereum } = window;

      const contract = await contractInstance(ethereum);

        console.log('Buying Coffee, just a minute!');
        const txn = await contract.buyCoffee(
          name? name: "anon",
          message ? message: "",
          {value: ethers.utils.parseEther('0.001')}
        );

        await txn.wait();

        console.log("Coffee purchased");

        setName("");
        setMessage("");
    } catch (e) {
        console.log(e);
    }
  }

  const withdrawTips = async () => {
    try {
      const { ethereum } = window;

      const contract = await contractInstance(ethereum);

        console.log('Withdrawing tips...');
        const txn = await contract.withdrawTips();

        await txn.wait();

        console.log('Tips Withdrawn');
    } catch (e) {
      console.log(e)
    }
  }

  const changeWithdrawl = async e => {
    e.preventDefault();
    try {
      const {ethereum} = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        console.log(signer);
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log(`Changing address to ${withdrawlAddr}`);
        const txn = await buyMeACoffee.changeWithdraw(withdrawlAddr);
        await txn.wait();
        console.log(`Withdrawl address changed to ${withdrawlAddr}`);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const viewTips = async () => {
    try {
      const {ethereum} = window;

      const contract = await contractInstance(ethereum);
      const balance = await contract.getTips();
      console.log(`Contract balance: ${balance}`)
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="App">
      <button type='button' onClick={buyCoffee} >
        Buy Coffee
      </button>
      <button type='button' onClick={connectWallet} >
        Connect Wallet
      </button>
      <button type='button' onClick={withdrawTips}>
        Withdraw Tips
      </button>
      <form onSubmit={changeWithdrawl} id='form1'>
        <input type='text' value={withdrawlAddr} onChange={e => setWithdrawlAddr(e.target.value)} />
        <button type='submit' form='form1'>
          Change Address
        </button>
      </form>
      <button type='button' onClick={viewTips}>
        View Tips
      </button>
    </div>
  );
}

export default App;
