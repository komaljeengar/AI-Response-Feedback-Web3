import React from "react";

const BalanceDisplay = ({ balance }) => {
  return (
    <div className="mb-4 text-center sm:text-left">
      <h2 className="text-base sm:text-xl font-bold">Balance:</h2>
      <p className="text-sm sm:text-base">{balance} APT</p>
    </div>
  );
};


export default BalanceDisplay;
