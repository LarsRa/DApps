//reference deployed smart contract
var contractABI = [
  {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "lockUser",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "unlockUser",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "_to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "sendMoney",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "deposit",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
var contractAddress = '0xaBa27AA33812c8C5fEEfE25D85F5fd7Fa11041c8';
var bankContract = new web3.eth.Contract(contractABI, contractAddress);
var contractOwner = "0x46e65c0d755c25e4b84e3e7b014f80b506a9cdba";

//update page on load
$(document).ready(function () {
    updateAccount();
});

//listen to account changing in metamask
window.ethereum.on('accountsChanged', function (accounts) {
    updateAccount();
});

//display current accounts address and balance
function updateAccount() {
    if (typeof currentAccount != "undefined") {
        $("#accAddress").text(currentAccount);
        getBalance();      
        if(currentAccount == contractOwner){
            $("#adminSection").show();
            console.log("object");
        }else{
            $("#adminSection").hide();
        }
    }else{
        setTimeout(updateAccount,100);
    }
}

//fetching balance of current account from smart contract
function getBalance() {
    bankContract.methods.getBalance().call({ from: currentAccount })
        .then(result => {
            console.log(result);
            var amount = web3.utils.fromWei(result, "ether");
            $('#balance').text(amount);
        });
}

//sending ether to smart contract
function depositEther() {
    var amount = $("#amount").val();
    var amountToSend = web3.utils.toWei(amount, "ether");
    bankContract.methods.deposit().send({ from: currentAccount, value: amountToSend })
        .then(() => {
            getBalance();
        });
}

//withdraw ether from the smart contract
function withdrawEther() {
    var amount = $("#amount").val();
    var amountToSend = web3.utils.toWei(amount, "ether");
    bankContract.methods.withdraw(amountToSend).send({ from: currentAccount })
        .then(() => {
            getBalance();
        });
}

//send ether of the smart contract to an other user
function sendEther() {
    var amount = $("#sendAmount").val();
    var amountToSend = web3.utils.toWei(amount, "ether");
    var addressTo = $("#addressTo").val();
    bankContract.methods.sendMoney(addressTo, amountToSend).send({ from: currentAccount })
        .then(() => {
            getBalance();
        });
}

function lockUser(){
    var addressLock = $("#addressLock").val();
    bankContract.methods.lockUser(addressLock).send({ from: currentAccount })
        .then(() => {
            console.log("locked");
        });
}