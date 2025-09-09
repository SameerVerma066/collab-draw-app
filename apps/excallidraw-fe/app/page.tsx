"use client"

import React, { useState } from 'react';
import { 
  Pen, 
  Users, 
  Zap, 
  Smartphone, 
  Download, 
  Share2, 
  Star,
  ArrowRight,
  Check,
  Menu,
  X,
  Github,
  Twitter,
  Mail
} from 'lucide-react';
import { useRouter } from 'next/navigation';


function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const handleClick = () => {
    router.push('/Signup');
  }


  const features = [
    {
      icon: <Pen className="w-6 h-6" />,
      title: "Intuitive Drawing",
      description: "Create beautiful diagrams and sketches with our hand-drawn aesthetic that feels natural and engaging."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Real-time Collaboration",
      description: "Work together seamlessly with your team. See changes in real-time and collaborate effortlessly."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Optimized for performance with instant loading and smooth interactions, even with complex drawings."
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Cross Platform",
      description: "Works perfectly on desktop, tablet, and mobile. Your drawings are always accessible."
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Export Anywhere",
      description: "Export to PNG, SVG, or share directly. Your creations are never locked in."
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: "Easy Sharing",
      description: "Share your drawings with a simple link. No accounts required for viewers."
    }
  ];

  const useCases = [
    {
      title: "Developers",
      description: "Sketch system architectures, API flows, and technical diagrams",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      title: "Designers",
      description: "Create wireframes, user flows, and brainstorm visual concepts",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      title: "Educators",
      description: "Explain complex concepts with visual aids and interactive lessons",
      gradient: "from-green-500 to-teal-600"
    },
    {
      title: "Teams",
      description: "Collaborate on ideas, plan projects, and visualize strategies",
      gradient: "from-orange-500 to-red-600"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Designer",
      content: "This tool has revolutionized how I create wireframes. The hand-drawn style makes everything feel more approachable.",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Software Engineer",
      content: "Perfect for sketching out system architectures. The collaboration features are fantastic for team discussions.",
      rating: 5
    },
    {
      name: "Lisa Thompson",
      role: "Educator",
      content: "My students love the visual explanations I create. It's so much better than traditional presentation tools.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="backdrop-blur-md border-b sticky top-0 z-50 bg-gray-900/80 border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Pen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">DrawFlow</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#use-cases" className="text-gray-300 hover:text-white transition-colors">Use Cases</a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Reviews</a>
              
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-105">
                Try Now
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-800">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
                <a href="#use-cases" className="text-gray-300 hover:text-white transition-colors">Use Cases</a>
                <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Reviews</a>
                
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium w-full">
                  Try Now
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
              Draw Ideas
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent block">
                Share Stories
              </span>
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed text-gray-300">
              The most intuitive drawing and diagramming tool for teams. Create beautiful, 
              hand-drawn style diagrams that bring your ideas to life with effortless collaboration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button onClick={handleClick} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center space-x-2">
                <span>Start Drawing Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-800 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2">
                <Github className="w-5 h-5" />
                <span>View on GitHub</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Hero Background Pattern */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600 opacity-10 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-600 opacity-10 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-600 opacity-10 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Powerful Features</h2>
            <p className="text-xl max-w-2xl mx-auto text-gray-300">
              Everything you need to create, collaborate, and share your visual ideas
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-8 rounded-2xl border bg-gray-800 border-gray-700 hover:border-gray-600 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="leading-relaxed text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-24 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Perfect For Everyone</h2>
            <p className="text-xl max-w-2xl mx-auto text-gray-300">
              From developers to designers, educators to entrepreneurs - DrawFlow adapts to your needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <div 
                key={index}
                className="p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gray-700"
              >
                <div className={`w-full h-32 bg-gradient-to-r ${useCase.gradient} rounded-xl mb-6 flex items-center justify-center`}>
                  <div className="text-white text-4xl font-bold opacity-80">
                    {useCase.title.charAt(0)}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{useCase.title}</h3>
                <p className="leading-relaxed text-gray-300">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Loved by Thousands</h2>
            <p className="text-xl max-w-2xl mx-auto text-gray-300">
              Join the growing community of creators who trust DrawFlow for their visual communication
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="p-8 rounded-2xl transition-all duration-300 bg-gray-800 hover:bg-gray-700"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="mb-6 leading-relaxed text-gray-300">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Bring Your Ideas to Life?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of creators who are already using DrawFlow to visualize, 
            collaborate, and share their ideas with the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
              <span>Start Creating Today</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 text-white bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Pen className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">DrawFlow</span>
              </div>
              <p className="mb-6 max-w-md text-gray-500">
                The most intuitive drawing and diagramming tool for teams. 
                Create, collaborate, and share your visual ideas effortlessly.
              </p>
              <div className="flex space-x-4">
                <button className="w-10 h-10 bg-gray-900 hover:bg-gray-800 rounded-lg flex items-center justify-center transition-colors">
                  <Twitter className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-gray-900 hover:bg-gray-800 rounded-lg flex items-center justify-center transition-colors">
                  <Github className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-gray-900 hover:bg-gray-800 rounded-lg flex items-center justify-center transition-colors">
                  <Mail className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-3 text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Updates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-3 text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>&copy; 2024 DrawFlow. All rights reserved. Built with ❤️ for creators everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;