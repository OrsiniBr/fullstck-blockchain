import {
  createWalletClient,
  custom,
  formatEther,
  createPublicClient,
  
  parseEther,
  defineChain,
} from "https://esm.sh/viem";
import { abi, contractAddress } from "./constants-js.js";

const connectButton = document.getElementById("connectButton");
const balanceButton = document.getElementById("balanceButton");
const fundButton = document.getElementById("fundButton");
const ethAmountInput = document.getElementById("ethAmount");
const withdrawButton = document.getElementById("withdrawButton");
const getAmountButton = document.getElementById("getAmountButton");

let walletClient;
let publicClient;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });
    await walletClient.requestAddresses();
    connectButton.innerHTML = "connected";
    console.log("Connecting to wallet...");
  } else {
    connectButton.innerHTML = "please install Metamask";
  }
}
async function fund() {
  const ethAmount = ethAmountInput.value;
  console.log(`funding with ${ethAmount}...`);
  if (typeof window.ethereum !== "undefined") {
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });
    const [connectedAccount] = await walletClient.requestAddresses();
    const currentChain = await getCurrentChain(walletClient);

    publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });

    const { request } = await publicClient.simulateContract({
      address: contractAddress,
      abi: abi,
      functionName: "fund",
      account: connectedAccount,
      chain: currentChain,
      value: parseEther(ethAmount),
    });

    const hash = await walletClient.writeContract(request);
    console.log(hash);

  } else {
    connectButton.innerHTML = "please install Metamask";
  }
}
async function withdraw() {
  console.log("Withdrawing funds...");
  if (typeof window.ethereum !== "undefined") {
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });
    const [connectedAccount] = await walletClient.requestAddresses();
    const currentChain = await getCurrentChain(walletClient);

    publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });

    const { request } = await publicClient.simulateContract({
      address: contractAddress,
      abi: abi,
      functionName: "withdraw",
      account: connectedAccount,
      chain: currentChain,
    });

    const hash = await walletClient.writeContract(request);
    console.log(hash);
  } else {
    connectButton.innerHTML = "please install Metamask";
  }
}
async function getCurrentChain(client) {
  const chainId = await client.getChainId();
  const currentChain = defineChain({
    id: chainId,
    name: "Custom Chain",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ["http://localhost:8545"],
      },
    },
  });
  return currentChain;
}
async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });
    const balance = await publicClient.getBalance({
     address: contractAddress
    });
    console.log(formatEther(balance));
  }
}




connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw;
// getAmountButton.onclick = getAddressToAmountFunded;
