import { AptosClient } from "aptos";

// Initialize the Aptos Client
const NODE_URL = "https://fullnode.testnet.aptoslabs.com/v1";
const aptosClient = new AptosClient(NODE_URL);

// Function to connect the Petra Wallet
export const connectWallet = async () => {
  if (window.aptos) {
    try {
      const account = await window.aptos.connect(); // Connect to Petra Wallet
      return { address: account.address };
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      throw new Error("Failed to connect wallet");
    }
  } else {
    alert("Petra Wallet not installed. Please install it.");
    throw new Error("Petra Wallet not installed");
  }
};

// Function to get the balance of the connected wallet
export const getBalance = async (address) => {
  try {
    // Fetch resources from the blockchain
    const resources = await aptosClient.getAccountResources(address);

    // Find the resource containing the balance
    const coinStore = resources.find((resource) =>
      resource.type.includes("0x1::coin::CoinStore")
    );

    if (coinStore) {
      const balance = coinStore.data.coin.value;
      return balance; // Balance in smallest unit
    } else {
      return 0; // No balance found
    }
  } catch (error) {
    console.error("Error fetching balance:", error);
    throw new Error("Failed to fetch balance");
  }
};
