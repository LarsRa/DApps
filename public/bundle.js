// Is there is an injected web3 instance?
if (typeof web3 !== 'undefined') {
    this.web3Provider = web3.currentProvider;
    web3 = new Web3(web3.currentProvider);
} else {
    // If no injected web3 instance is detected, fallback to Ganache.
    this.web3Provider = new web3.providers.HttpProvider('http://127.0.0.1:9545');
    web3 = new Web3(App.web3Provider);
}

//reference connected metamask account
var currentAccount;

//connect to metamask
function connectToMetamask() {
    // This is equivalent to ethereum.enable()
    web3.eth.getAccounts()
        .then(handleAccountsChanged)
        .catch(err => {
            if (err.code === 4001) { // EIP 1193 userRejectedRequest error
                console.log('Please connect to MetaMask.')
            } else {
                console.error(err)
            }
        });
}

//listen for changing metamask account
window.ethereum.on('accountsChanged', function (accounts) {
    handleAccountsChanged(accounts);
  });

//setting current metamask account
function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {

        // MetaMask is locked or the user has not connected any accounts
        console.log('Please connect to MetaMask.')

    } else if (accounts[0] !== currentAccount) {

        currentAccount = accounts[0]
        // Run any other necessary logic...
    }
}

$(document).ready(function () {
    connectToMetamask();
});


