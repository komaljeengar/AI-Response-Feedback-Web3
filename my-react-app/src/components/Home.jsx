import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Rocket, Upload } from 'lucide-react'

const Home = ({ darkMode }) => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center mt-8 md:mt-16 text-center">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 mb-12">
        <h1 className={`text-6xl md:text-6xl font-semibold mb-6 ${
          darkMode ? 'text-white' : 'text-gray-900'
        } leading-tight`}>
          Experience the Future of <span className="text-blue-600">AI Chat</span>
        </h1>
        <p className={`text-xl md:text-2xl mb-8 ${
          darkMode ? 'text-gray-200' : 'text-gray-400'
        }`}>
          Connect your wallet and start meaningful conversations with our advanced AI. 
          Secure, intelligent, and tailored to your needs.
        </p>
        
        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/chat')}
            className={`
              px-8 py-4 rounded-lg text-lg font-semibold
              transform transition-all duration-300
              hover:scale-105 focus:outline-none focus:ring-4
              ${darkMode 
                ? 'bg-blue-600 hover:bg-blue-500 text-white focus:ring-blue-700/50' 
                : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-600/50'
              }
            `}
          >
            <div className="flex items-center gap-2">
              <Rocket className="w-5 h-5" />
              Start Chatting Now
            </div>
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto px mt-12">
        {[
          {
            icon: ShieldCheck,
            title: "Secure Conversations",
            description: "End-to-end encrypted chats with wallet authentication"
          },
          {
            icon: Rocket,
            title: "Advanced AI",
            description: "Powered by cutting-edge language models for intelligent responses"
          },
          {
            icon: Upload,
            title: "Seamless Integration",
            description: "Connect your wallet and start chatting instantly"
          }
        ].map(({ icon: Icon, title, description }, index) => (
          <div
            key={index}
            className={`
              ${darkMode ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-white hover:bg-gray-50'}
              p-6 rounded-xl shadow-lg border
              ${darkMode ? 'border-gray-700' : 'border-gray-200'}
              transition-all duration-300
            `}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center
                ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}
              `}>
                <Icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {title}
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home