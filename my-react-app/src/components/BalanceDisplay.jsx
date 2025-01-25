import React from "react";

const BalanceDisplay = ({ balance }) => {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold">Balance:</h2>
      <p>{balance} APT</p>
    </div>
  );
};

export default BalanceDisplay;
