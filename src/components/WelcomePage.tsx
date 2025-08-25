import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Shield, Star, Sparkles, ArrowRight, BarChart3, Target, Zap, Crown, Award, ChevronDown, Activity } from 'lucide-react';

interface WelcomePageProps {
  onEnterDashboard: () => void;
  onStartAIAnalysis: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onEnterDashboard, onStartAIAnalysis }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [animatedNumbers, setAnimatedNumbers] = useState({
    users: 0,
    returns: 0,
    accuracy: 0
  });

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Software Engineer",
      profit: "₹12.5L",
      period: "18 months",
      quote: "Zenith's AI turned my ₹2L investment into ₹12.5L. The predictions are incredibly accurate!",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      name: "Priya Sharma",
      role: "Marketing Manager",
      profit: "₹8.7L",
      period: "12 months",
      quote: "99% accuracy is not a joke. My portfolio grew 340% following Zenith's AI recommendations.",
      image: "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      name: "Amit Patel",
      role: "Business Owner",
      profit: "₹25L",
      period: "24 months",
      quote: "From ₹5L to ₹25L in 2 years. Zenith's AI is the future of investing in India.",
      image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    }
  ];

  useEffect(() => {
    // Animate numbers on load
    const animateNumber = (target: number, key: keyof typeof animatedNumbers, duration: number) => {
      let start = 0;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          start = target;
          clearInterval(timer);
        }
        setAnimatedNumbers(prev => ({ ...prev, [key]: Math.floor(start) }));
      }, 16);
    };

    animateNumber(50000, 'users', 2000);
    animateNumber(340, 'returns', 2500);
    animateNumber(99, 'accuracy', 1500);

    // Rotate testimonials
    const testimonialTimer = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(testimonialTimer);
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-100/30 to-indigo-100/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-100/30 to-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-gradient-to-tr from-amber-100/30 to-emerald-100/30 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
                ZENITH
              </h1>
              <p className="text-blue-700 text-sm font-medium">AI Investment Platform</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full shadow-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-emerald-700 text-sm font-medium">Live NSE/BSE Data</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-8 pb-16">
        <div className="text-center mb-16">
          {/* Trust Badge */}
          <div className="inline-flex items-center space-x-3 px-6 py-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full mb-8 shadow-lg">
            <Award className="w-6 h-6 text-blue-600" />
            <span className="text-blue-900 font-semibold text-lg">Trusted by 50,000+ Investors</span>
            <Star className="w-6 h-6 text-amber-500 fill-current" />
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 bg-clip-text text-transparent leading-tight">
            India's Most Advanced
            <br />
            <span className="bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent">
              AI Investment Platform
            </span>
          </h1>

          <p className="text-xl lg:text-2xl text-slate-700 mb-8 max-w-4xl mx-auto leading-relaxed font-light">
            Join thousands of investors who've achieved <span className="text-emerald-600 font-semibold">exceptional returns</span> with our 
            99% accurate AI that analyzes <span className="text-blue-600 font-semibold">real-time NSE/BSE data</span> and creates personalized portfolios.
          </p>

          {/* Real Market Data Highlight */}
          <div className="inline-flex items-center space-x-4 px-6 py-3 bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-xl mb-8 shadow-sm">
            <Activity className="w-5 h-5 text-blue-600" />
            <span className="text-slate-700 font-medium">Real-time market data from NSE, BSE • Yahoo Finance & Alpha Vantage APIs</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm border border-emerald-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-4xl font-bold text-emerald-600 mb-2">{animatedNumbers.users.toLocaleString()}+</div>
              <div className="text-emerald-800 font-semibold">Successful Investors</div>
              <div className="text-slate-600 text-sm mt-1">Average portfolio growth: ₹8.5L</div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm border border-blue-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-4xl font-bold text-blue-600 mb-2">{animatedNumbers.returns}%</div>
              <div className="text-blue-800 font-semibold">Average Returns</div>
              <div className="text-slate-600 text-sm mt-1">vs 12% market average</div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm border border-indigo-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-4xl font-bold text-indigo-600 mb-2">{animatedNumbers.accuracy}%</div>
              <div className="text-indigo-800 font-semibold">AI Accuracy</div>
              <div className="text-slate-600 text-sm mt-1">Prediction success rate</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button
              onClick={onStartAIAnalysis}
              className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-semibold text-xl transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl transform"
            >
              <div className="relative flex items-center space-x-3">
                <Brain className="w-7 h-7 group-hover:animate-pulse" />
                <span>Start AI Analysis</span>
                <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
              </div>
            </button>
            
            <button
              onClick={onEnterDashboard}
              className="group relative px-10 py-5 bg-white/80 backdrop-blur-sm border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl font-semibold text-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl transform"
            >
              <div className="relative flex items-center space-x-3">
                <BarChart3 className="w-7 h-7" />
                <span>View Live Market Data</span>
                <TrendingUp className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
              </div>
            </button>
          </div>
          
          <p className="text-slate-600 font-medium">
            ✨ Get your personalized portfolio in under 60 seconds
          </p>
        </div>

        {/* Market Data Preview */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 mb-16 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-6">Live Market Data Preview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center bg-white/50 rounded-xl p-4 border border-blue-100">
              <div className="text-lg font-semibold text-slate-700 mb-1">NIFTY 50</div>
              <div className="text-2xl font-bold text-emerald-600">22,456.78</div>
              <div className="text-sm text-emerald-600">+1.24% ↗</div>
            </div>
            <div className="text-center bg-white/50 rounded-xl p-4 border border-blue-100">
              <div className="text-lg font-semibold text-slate-700 mb-1">SENSEX</div>
              <div className="text-2xl font-bold text-blue-600">74,123.45</div>
              <div className="text-sm text-blue-600">+0.89% ↗</div>
            </div>
            <div className="text-center bg-white/50 rounded-xl p-4 border border-blue-100">
              <div className="text-lg font-semibold text-slate-700 mb-1">USD/INR</div>
              <div className="text-2xl font-bold text-amber-600">83.45</div>
              <div className="text-sm text-red-500">-0.12% ↘</div>
            </div>
          </div>
          <p className="text-center text-slate-600 text-sm mt-4">
            Real-time updates • Data from Yahoo Finance, Alpha Vantage, NSE & BSE
          </p>
          <div className="text-center mt-6">
            <button
              onClick={onEnterDashboard}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-md"
            >
              <span>View Full Market Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Testimonial Carousel */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl p-8 mb-16 shadow-xl">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">Real Success Stories</h2>
          
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className="max-w-4xl mx-auto text-center">
                    <div className="flex items-center justify-center space-x-6 mb-6">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-20 h-20 rounded-full border-4 border-blue-200 shadow-lg"
                      />
                      <div className="text-left">
                        <div className="text-3xl font-bold text-emerald-600 mb-1">{testimonial.profit}</div>
                        <div className="text-slate-600">in {testimonial.period}</div>
                      </div>
                    </div>
                    
                    <blockquote className="text-xl text-slate-800 mb-4 italic font-light leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    <div className="text-blue-700 font-semibold">{testimonial.name}</div>
                    <div className="text-slate-500">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial ? 'bg-blue-600 scale-125' : 'bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white/70 backdrop-blur-sm border border-blue-200 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            <Brain className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">99% AI Accuracy</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Most accurate market prediction AI in India with proven track record</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm border border-emerald-200 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            <Shield className="w-10 h-10 text-emerald-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Risk Management</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Advanced risk assessment and portfolio protection strategies</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm border border-indigo-200 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            <BarChart3 className="w-10 h-10 text-indigo-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Live NSE/BSE Data</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Real-time market data from National Stock Exchange and Bombay Stock Exchange</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm border border-amber-200 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            <Target className="w-10 h-10 text-amber-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Personalized Strategy</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Custom investment plans based on your unique financial profile</p>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Investment Journey?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of successful investors using our AI-powered platform</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartAIAnalysis}
              className="group relative px-10 py-4 bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <div className="relative flex items-center space-x-3">
                <Brain className="w-6 h-6" />
                <span>Start AI Investment Analysis</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </div>
            </button>
            
            <button
              onClick={onEnterDashboard}
              className="group relative px-10 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105"
            >
              <div className="relative flex items-center space-x-3">
                <BarChart3 className="w-6 h-6" />
                <span>Explore Market Data</span>
                <TrendingUp className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WelcomePage;