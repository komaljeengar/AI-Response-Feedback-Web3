import React, { useState } from "react";

const WalletButton = ({ connectWallet }) => {
  const [loading, setLoading] = useState(false);


  const handleClick = async () => {
    try {
      setLoading(true);
      const { address } = await connectWallet(); // Get address from connectWallet
      
      if (address) {
        localStorage.setItem("userId", address); // Store userId in local storage
        console.log(localStorage.getItem("userId"));
        alert("Wallet connected successfully!");
      } else {
        throw new Error("Failed to retrieve wallet address.");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect to Petra Wallet. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      aria-disabled={loading}
    >
      {loading ? "Connecting..." : "Connect Petra Wallet"}
    </button>
  );
};

export default WalletButton;

