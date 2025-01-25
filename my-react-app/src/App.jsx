import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Navbar from "./components/NavBar"
import Home from "./components/Home"
import ChatInterface from "./components/ChatInterface"
import { connectWallet, getBalance } from "./utils/walletUtils"

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null)
  const [balance, setBalance] = useState("0")

  useEffect(() => {
    if (walletAddress) {
      updateBalance()
    }
  }, [walletAddress])

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

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar walletAddress={walletAddress} balance={balance} onConnect={handleConnect} />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<ChatInterface updateBalance={updateBalance} />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App

