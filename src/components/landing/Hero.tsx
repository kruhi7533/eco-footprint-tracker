import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
      {/* Left Content */}
      <div className="flex-1 text-center lg:text-left">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-6"
        >
          Track Your Carbon
          <span className="block font-medium text-ecoPrimary">Save Our Planet</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-gray-600 text-lg md:text-xl mb-8 max-w-xl mx-auto lg:mx-0"
        >
          Join thousands making a difference with EcoStep. Track, reduce, and offset your carbon footprint with our intuitive platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
        >
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full 
            bg-ecoPrimary text-white hover:bg-ecoSecondary transition-all duration-300 
            hover:scale-105 text-lg"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <a
            href="#learn-more"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full 
            border-2 border-gray-200 hover:border-ecoPrimary text-gray-600 
            hover:text-ecoPrimary transition-all duration-300 hover:scale-105 text-lg"
          >
            Learn More
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 flex items-center justify-center lg:justify-start gap-8"
        >
          <div className="text-center">
            <p className="text-2xl font-medium text-ecoPrimary">10K+</p>
            <p className="text-gray-600">Active Users</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-medium text-ecoPrimary">50K+</p>
            <p className="text-gray-600">Trees Planted</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-medium text-ecoPrimary">100K+</p>
            <p className="text-gray-600">CO₂ Reduced</p>
          </div>
        </motion.div>
      </div>

      {/* Right Image */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="flex-1"
      >
        <img
          src="https://images.unsplash.com/photo-1497250681960-ef046c08a56e"
          alt="Green leaf representing sustainability"
          className="w-full h-auto rounded-2xl shadow-2xl"
        />
      </motion.div>
    </div>
  );
} 