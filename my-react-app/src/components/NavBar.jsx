const Navbar = ({ walletAddress, balance, onConnect, darkMode }) => {
  return (
    <div className="flex items-center space-x-3">
      {walletAddress ? (
        <div className={`
          py-2 px-4 rounded-lg font-medium 
          ${darkMode
            ? 'bg-gray-700 text-gray-300 border border-gray-600'
            : 'bg-white text-gray-700 border border-gray-200'
          }
        `}>
          <span className="hidden sm:inline mr-2">Balance:</span>
          <span className="font-mono">
            {Number.parseFloat(balance).toFixed(2)} APT
          </span>
        </div>
      ) : (
        <button
          onClick={onConnect}
          className={`
            py-2 px-4 rounded-lg font-medium
            transition-colors duration-300
            ${darkMode
              ? 'bg-green-600 hover:bg-green-500 text-white'
              : 'bg-blue-500 hover:bg-blue-400 text-white'
            }
          `}
        >
          Connect Wallet
        </button>
      )}
    </div>
  )
}

export default Navbar