import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Zap, RefreshCw } from 'lucide-react';

function HomePage() {
  const features = [
    {
      icon: <Clock className="w-12 h-12 text-blue-400" />,
      title: 'Time-Based Automation',
      description: 'Schedule and execute tasks at specific times or intervals with precision and reliability.'
    },
    {
      icon: <Zap className="w-12 h-12 text-purple-400" />,
      title: 'Condition-Based Automation', 
      description: 'Trigger actions based on specific blockchain conditions and price changes automatically.'
    },
    {
      icon: <RefreshCw className="w-12 h-12 text-green-400" />,
      title: 'Event-Based Automation',
      description: 'React to blockchain events instantly with automated task execution and monitoring.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white">
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-purple-600/20" />
        <div className="absolute top-0 left-1/2 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl -translate-x-1/2" />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Advanced Cross-Chain Automation
            </h1>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Empowering blockchain developers with seamless automation across multiple chains.
              Built on Keeper Network and Eigenlayer for ultimate reliability and efficiency.
            </p>
            <div className="flex justify-center gap-6">
              <Link 
                to="/create-job"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2"
              >
                Get Started <ArrowRight size={20} />
              </Link>
              <a 
                href="https://triggerx.notion.site/135f72e32db38016a723e415639398b6?v=136f72e32db380308d1e000c35bdd096"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white/10 rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-[#0A0F1C] to-[#141B2D]">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#141B2D]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">Project Vision</h2>
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl p-8 backdrop-blur-xl border border-white/10">
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                TriggerX revolutionizes blockchain automation by extending Keeper Network's capabilities across multiple chains.
                Our platform enables decentralized keepers to execute automated tasks seamlessly, reducing manual intervention
                and enhancing operational efficiency.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                By leveraging Eigenlayer and LayerZero Protocol, we create a robust cross-chain AVS solution that bridges
                the gap between different blockchain ecosystems, making automation accessible and efficient for all.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-t from-[#0A0F1C] to-[#141B2D]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Automate?</h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join the future of blockchain automation and streamline your operations with TriggerX.
          </p>
          <Link 
            to="/create-job"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 gap-2"
          >
            Launch App <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;