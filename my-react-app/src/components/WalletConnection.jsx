import React from "react";

const WalletConnection = ({ address, onConnect }) => {
  return (
    <div className="mb-4">
      {address ? (
        <p>Connected: {address}</p>
      ) : (
        <button 
          onClick={onConnect} 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default WalletConnection;
