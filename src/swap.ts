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
const WETH = "0xc778417E063141139Fce010982780140Aa0cD5Ab"; 
const DAI = "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa";


const router = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

const privKey: string = process.env["PRIV_KEY"];
const providerURL = process.env["PROVIDER_URL"];
const provider = new ethers.providers.JsonRpcProvider(providerURL);
const wallet = new ethers.Wallet(privKey,provider);
const erc20 = new ethers.Contract(legos.erc20.dai.address, legos.erc20.dai.abi, wallet);
const routerContract = new ethers.Contract(
    router,
    [
        'function getAmountsOut(uint256 amountIn, address[] memory path) public view returns(uint[] memory amounts)',
        'function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
        'function WETH() external pure returns (address)'
    ],
    wallet
);

const daiContract = new ethers.Contract(
    DAI,
    [
        'function approve(address spender, uint256 amount) external returns (bool)'
    ],
    wallet
)

async function main() {
    console.log("swaping started")
    const DAIamountIn = ethers.utils.parseUnits('10', 18);
    let amounts = await routerContract.getAmountsOut(DAIamountIn, [DAI, WETH]);
    const WETHamountOutMin = amounts[1].sub(amounts[1].div(10));

    console.log(ethers.utils.formatEther(DAIamountIn).toString());
    console.log(ethers.utils.formatEther(WETHamountOutMin).toString());

    const approveTx = await daiContract.approve(
        router,
        DAIamountIn
    );


    const swapTx = await routerContract.swapExactTokensForTokens(
        DAIamountIn,
        WETHamountOutMin,
        [DAI, WETH],
        wallet.address,
        Date.now() + 1000 * 60 * 10,
        {gasLimit: 250000}
    )
    //console.log(swapTx)
    let tx = await swapTx.wait();
    console.log(tx)
    console.log(swapTx.hash)
}

main()