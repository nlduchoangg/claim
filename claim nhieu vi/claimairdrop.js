const Web3 = require('web3');
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/');
// const web3 = new Web3('https://open-platform.nodereal.io/05d5da11488b42aa8c80908a7fb5fde7/arbitrum-nitro/');
const ether = new Web3('https://mainnet.infura.io/v3/1bfb34d605634d759b708a10fd1eb697');

const privateKey = ['8f3dd0be80e479459206e91d9875858314d536dc37373187b4cd4ce4dda267ed', '0x7b589214a6996c711d200597a729464771b932942692ca3afd57510aebf42ebe', '0x9fe7461181776f39922404b7096f82ca7467a1128202df30a10460b29e251dae'];
// get every address from privatekey array
var account = [];
// push address and private key into account object
for (let i = 0; i < privateKey.length; i++) {
    account.push(web3.eth.accounts.privateKeyToAccount(privateKey[i]));
}
// print address
var address = []
for (let i = 0; i < privateKey.length; i++) {
    address.push(account[i].address);
}
//address recipient token airdrop
const recipient = '0x83e101acb0400207bc26c65E73379Fb164eD3f20';

const amount = web3.utils.toWei('100', 'ether');

//console.log(typeof(account));
//console.log(account);
//console.log(addresss)

//contract arb token
const arb_token_abi = require('./abi/arbtoken.json');
const arb_token_address = "0xB18B4e088F8142AAC659E369364A5dEb4f0ED258";
//creat list arbtokencontract
var arbTokenContract = [];

for (let j = 0; j < address.length; j++) {
    arbTokenContract.push(new web3.eth.Contract(arb_token_abi, arb_token_address, { from: address[j] }));
    continue;
}

//arbTokenContract = new web3.eth.Contract(arb_token_abi, arb_token_address, {from: address[0]});
//console.log(arbTokenContract);

//contract arb token

// contract claim
const claim_abi = require('./abi/claimair.json');
const claim_address = "0x0e20584A5993805cA96DDf6b8b7D6d7A8D03F8e9";
var claimContract = [];

for (let j = 0; j < address.length; j++) {
    claimContract.push(new web3.eth.Contract(claim_abi, claim_address, { from: address[j] }));
    continue;
}


//console.log('adress: ', arbTokenContract)
// console.log(arbTokenContract.length);

// async function jobs() {
//     let index = 0;
//     while (true) {
//         await claimAndSend();
//         index++;
//         console.log("=======index=======: ", index)
//     }
// }

async function claimAndSend() {
    const blockNumber = await ether.eth.getBlockNumber();
    console.log("blockNumber", blockNumber);
    if (true) {
        console.log("=======haha=========");
        await claim();
        await send();
    }
}

async function claim() {
    try {
        for (i = 0; i < address.length; i++) {
            var dataClaim = claimContract[i].methods.claim();
            var count = await web3.eth.getTransactionCount(address[i]);
            //console.log(typeof (address[i]));
            var tx = {
                from: address[i],
                //gasPrice:web3.utils.toHex(5000000000),
                // gasLimit:web3.utils.toHex(750000),
                gas: 500000,
                to: claim_address,
                data: dataClaim.encodeABI(),
                nonce: web3.utils.toHex(count)

            };
            const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey[i]);
            const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            //console.log('receipt:', receipt)
        }
    }
    catch (err) {
        console.log("err", err);
        return
    }
}

async function send() {
    try {
        for (i = 0; i < address.length; i++) {
            var dataTransfer = arbTokenContract[i].methods.transfer(
                recipient,
                amount
            );
            //console.log(arbTokenContract);
            //console.log(typeof('kieu du lieu arbTokenContract: ', arbTokenContract[i]));

            var count = await web3.eth.getTransactionCount(address[i]);
            //console.log('address: ', address);
            //console.log(typeof('kieu du lieu address: ', address[i]));
            var tx = {
                from: address[i],
                gas: 501064,
                //gasPrice:web3.utils.toHex(5000000000),
                to: arb_token_address,
                data: dataTransfer.encodeABI(),
                nonce: web3.utils.toHex(count)
            };
            const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey[i]);
            //console.log('privateKey: ', privateKey[i]);
            //console.log(typeof('kieu du lieu privateKey: ', privateKey[i]));
            const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        }
        //console.log('receipt:', receipt)
    }
    catch (err) {
        console.log("err", err);
        return
    }
}


claimAndSend()

