"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const dotenv_1 = __importDefault(require("dotenv"));
const money_legos_1 = require("@studydefi/money-legos");
dotenv_1.default.config();
// so we need to fetch the metamask address from the frontend and code their address here 
// const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
// // Prompt user for account connections
// await provider.send("eth_requestAccounts", []);
// const signer = provider.getSigner();
// console.log("Account:", await signer.getAddress());
// this above code is the main code to fetch the provider will have to add that in the frontend 
const addree = '0x48F528cE86BEc210bc5D1A5e0cd6d60eEA801a8D';
const privKey = process.env["PRIV_KEY"];
const providerURL = process.env["PROVIDER_URL"];
const provider = new ethers_1.ethers.providers.JsonRpcProvider(providerURL);
const wallet = new ethers_1.ethers.Wallet(privKey, provider);
const weth = new ethers_1.ethers.Contract(money_legos_1.legos.erc20.weth.address, money_legos_1.legos.erc20.weth.abi, wallet);
const dai = new ethers_1.ethers.Contract(money_legos_1.legos.erc20.dai.address, money_legos_1.legos.erc20.dai.abi, wallet);
function main(transferAmount, receiverAddress, contractAddress) {
    if (typeof contractAddress !== 'undefined') {
        console.log("ERC20token transfer calling");
        let contract = new ethers_1.ethers.Contract(contractAddress, money_legos_1.legos.erc20.dai.abi, wallet);
        console.log(receiverAddress);
        contract.transfer(receiverAddress, transferAmount.toString())
            .then((transferResult) => __awaiter(this, void 0, void 0, function* () {
            console.dir(transferResult);
            console.log('txHash', transferResult.hash);
        }));
    }
    else {
        console.log("eth transfer calling");
        console.log("wallet", wallet.toString());
        const tx = {
            to: receiverAddress,
            value: ethers_1.ethers.utils.parseEther(transferAmount.toString()),
            gasLimit: 21000
        };
        wallet.sendTransaction(tx)
            .then((txObj) => __awaiter(this, void 0, void 0, function* () {
            console.log('txHash', txObj.hash);
            console.log((yield provider.waitForTransaction(txObj.hash)).cumulativeGasUsed.toString());
        }));
    }
}
main(1000000, wallet.address);
