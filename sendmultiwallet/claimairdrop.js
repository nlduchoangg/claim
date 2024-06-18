const Web3 = require('web3');
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/');
// const web3 = new Web3('https://open-platform.nodereal.io/05d5da11488b42aa8c80908a7fb5fde7/arbitrum-nitro/');
const ether = new Web3('https://mainnet.infura.io/v3/1bfb34d605634d759b708a10fd1eb697');

const privateKey = '0x8f3dd0be80e479459206e91d9875858314d536dc37373187b4cd4ce4dda267ed';
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
const address = account.address;


const recipientn = ['0x33b78A513cCc81eDD61F0FdAFE4fcb11Ec1B20BE', '0xfd98df3B3890aD6D919b91F7189E094936450d4f', '0x83e101acb0400207bc26c65E73379Fb164eD3f20']
const amount = web3.utils.toWei('100', 'ether');
const amountsend = web3.utils.toWei('1', 'ether');


//contract arb token
const arb_token_abi = require('./abi/arbtoken.json');
const arb_token_address = "0xB18B4e088F8142AAC659E369364A5dEb4f0ED258";
const arbTokenContract = new web3.eth.Contract(arb_token_abi, arb_token_address, { from: address });
//contract arb token

// contract claim
const claim_abi = require('./abi/claimair.json');
const claim_address = "0x0e20584A5993805cA96DDf6b8b7D6d7A8D03F8e9";
const claimContract = new web3.eth.Contract(claim_abi, claim_address, { from: address });
// contract claim

async function claim(){
    try{
        var dataClaim = claimContract.methods.claim();
        var count = await web3.eth.getTransactionCount(address);
        var tx = {
            from:address,
            //gasPrice:web3.utils.toHex(5000000000),
            // gasLimit:web3.utils.toHex(750000),
            gas: 500000,
            to:claim_address,
            data:dataClaim.encodeABI(),
            nonce:web3.utils.toHex(count)
        };
        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        //console.log('receipt:', receipt)
    }
    catch(err){
        console.log("err", err);
        return
    }
    
}

async function send1tomultiplewallet() {
    try {
        var dataTransfer = [];
        for (let i = 0; i < recipientn.length; i++) {
            dataTransfer.push(recipientn[i]);
        }

        for (let k = 0; k < recipientn.length; k++) {
            console.log("vi dau tien:", dataTransfer[k]);
            dataTransfer[k] = arbTokenContract.methods.transfer(
                recipientn[k],
                amountsend
            );

            var count = await web3.eth.getTransactionCount(address);
            //console.log('address: ', address);
            //console.log(typeof ('kieu du lieu address: ', address));
            var tx = {
                from: address,
                gas: 501064,
                //gasPrice:web3.utils.toHex(5000000000),
                to: arb_token_address,
                data: dataTransfer[k].encodeABI(),
                nonce: web3.utils.toHex(count)
            };
            const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
            //console.log('privateKey: ', privateKey);
            //console.log(typeof ('kieu du lieu privateKey: ', privateKey));
            const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        }
    }
    catch (err) {
        console.log("err", err);
        return
    }
}

//claim();
send1tomultiplewallet();
