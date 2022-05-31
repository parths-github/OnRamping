import { ethers } from "ethers";
import dotenv from 'dotenv';
import { legos } from "@studydefi/money-legos";
import { count } from "console";
dotenv.config();
declare var process: {
    env: {
        PRIV_KEY: string,
        PROVIDER_URL: string,
    }
}
const privKey: string = process.env["PRIV_KEY"];
const providerURL = process.env["PROVIDER_URL"];
const provider = new ethers.providers.JsonRpcProvider(providerURL);
const wallet = new ethers.Wallet(privKey,provider);
const weth = new ethers.Contract(   
                                legos.erc20.weth.address, 
                                legos.erc20.weth.abi, 
                                wallet
)
const dai = new ethers.Contract(
                                legos.erc20.dai.address, 
                                legos.erc20.dai.abi, 
                                wallet
)
function main(
    transferAmount: number,
    receiverAddress: string,
    contractAddress?: string,
){
    if(typeof contractAddress !== 'undefined'){
        console.log("ERC20token transfer calling")
        let contract = new ethers.Contract(
            contractAddress,
            legos.erc20.dai.abi,
            wallet
        )
        console.log(receiverAddress)
        contract.transfer(
            receiverAddress, 
            transferAmount.toString()
        )
        .then(async(transferResult: any)=>
        {
            console.dir(transferResult)
            console.log('txHash', transferResult.hash)
        })
    }
    else {
        console.log("eth transfer calling")
        console.log(wallet.address)
        const tx = {
            to: receiverAddress,
            value: ethers.utils.parseEther(transferAmount.toString()),
            gasLimit: 21000
        }
        wallet.sendTransaction(tx)
        .then(async (txObj) => 
        {
            console.log('txHash', txObj.hash)
            console.log((await provider.waitForTransaction(txObj.hash)).cumulativeGasUsed.toString())
        })
    } 
}
main(0.01,'0x48F528cE86BEc210bc5D1A5e0cd6d60eEA801a8D')
