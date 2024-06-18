const Web3 = require('web3');
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/'); // 

const privateKey = 'a5ceb4f9c2aca38c0849389febe897bf48ede3c5ef6562912d0425607e3dfd26';
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
const address = account.address;
console.log(address);
// ==========ABI======================
const router_abi = require('./abi/router.json');

// ==========ADDRESS==================

const router_address = "0x9a489505a00cE272eAa5e07Dba6491314CaE3796";    // router pancake v2
const tokenAddess = "0xB18B4e088F8142AAC659E369364A5dEb4f0ED258";       // address token Example: USDT
const WBNBAddress = "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd";       //contract wbnb 

const pancakeRouter = new web3.eth.Contract(router_abi, router_address, {from: address});

//console.log(pancakeRouter);

//router pancake
// const pancakerouterv2 = '0x9a489505a00cE272eAa5e07Dba6491314CaE3796'
// //token test
// const tokentobuy = '0xB18B4e088F8142AAC659E369364A5dEb4f0ED258'
// //token tbnb
// const spend = '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd'

// const sender_adress = '0xE37135c08478375C38a7b83D9618957F28cB0d84'



////////////// MUST CHANGE ///////////////
async function swap(){
    try{

        var dataSwap = pancakeRouter.methods(
            web3.utils.toWei('0.0000000001', 'ether'),   // Amount out min, mean amount token min is 0.01
            [WBNBAddress,
             tokenAddess],
             address,
            web3.utils.toHex(Math.round(Date.now()/1000)+60*5),
            );
        var count = await web3.eth.getTransactionCount(address);
        var tx = {
            from:address,
            gasPrice:web3.utils.toHex(10000000000),
            gasLimit:web3.utils.toHex(400000),              // gas limit
            // gas: 1001060,
            to:router_address,
            value: web3.utils.toWei('0.001', 'ether'),  // value 0.0001 BNB
            data:dataSwap.encodeABI(),
            nonce:web3.utils.toHex(count)
        };
        
        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        
        web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log("=================== swap done =================")
    }
    catch(err){
        console.log("!!!!!!!!!!!! err !!!!!!!!!!!!!!", err)
    }
    
}
swap()





