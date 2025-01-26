import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { Moon, Sun, ShieldCheck, Rocket, Search, Upload } from "lucide-react"
import Navbar from "./components/Navbar"
import Home from "./components/Home"
import ChatInterface from "./components/ChatInterface"
import { connectWallet, getBalance } from "./utils/walletUtils"

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null)
  const [balance, setBalance] = useState("0")
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (walletAddress) {
      updateBalance()
    }
    document.documentElement.classList.toggle('dark', darkMode)
  }, [walletAddress, darkMode])

  const handleConnect = async () => {
    const { address } = await connectWallet()
    setWalletAddress(address)
  }

  const updateBalance = async () => {
    if (walletAddress) {
      const newBalance = await getBalance(walletAddress)
      setBalance(newBalance)
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <Router>
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode
          ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100'
          : 'bg-gradient-to-br from-blue-50 to-blue-100 text-gray-900'
        }`}>
        {/* Header */}
        <header className={`sticky top-0 z-50 w-full border-b ${darkMode ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'
          } backdrop-blur-md`}>
          <div className="container mx-auto flex h-16 items-center px-4 md:px-6 justify-between">
            <div className="flex items-center space-x-2 font-bold text-xl">
              <ShieldCheck className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              IntelliChat
            </div>
            <nav className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${darkMode
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <Navbar
                walletAddress={walletAddress}
                balance={balance}
                onConnect={handleConnect}
                darkMode={darkMode}
              />
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-4 md:px-6 py-12">
          <div className="h-full flex items-center justify-center">
            <Routes>
              <Route path="/" element={<Home darkMode={darkMode} />} />
              <Route
                path="/chat"
                element={
                  <ChatInterface
                    updateBalance={updateBalance}
                    darkMode={darkMode}
                  />
                }
              />
            </Routes>
          </div>
        </main>

        {/* Footer */}
        <footer className={`
          mt-auto w-full
          ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}
          border-t py-6
        `}>
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4 md:mb-0`}>
              ©️ 2024 IntelliChat. All rights reserved.
            </p>
            <nav className="flex gap-4">
              {['Terms of Service', 'Privacy Policy'].map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className={`
                    text-sm 
                    ${darkMode
                      ? 'text-gray-300 hover:text-blue-400'
                      : 'text-gray-600 hover:text-blue-600'
                    }
                  `}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App