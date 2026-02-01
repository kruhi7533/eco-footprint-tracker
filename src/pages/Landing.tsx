import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';

export default function Landing() {
  const { scrollY } = useScroll();

  // Transform values for the main logo with smoother transitions
  const mainLogoScale = useTransform(scrollY, 
    [0, window.innerHeight], // Full viewport height for transition
    [1, 0.18], // Scale down to navbar size
    { clamp: true }
  );
  
  // Keep logo centered until second section appears
  const mainLogoY = useTransform(scrollY,
    [0, window.innerHeight], 
    [window.innerHeight * 0.4, 5], // Add slight padding at the top
    { clamp: true }
  );

  // Show nav items when second section appears
  const navOpacity = useTransform(scrollY,
    [window.innerHeight * 0.8, window.innerHeight],
    [0, 1],
    { clamp: true }
  );

  return (
    <div className="bg-[#1C1C1C] relative">
      {/* Logo Container - Always on top */}
      <motion.div
        className="fixed left-1/2 w-full z-[9999] top-0"
        style={{
          y: mainLogoY,
          scale: mainLogoScale,
          transformOrigin: '50% 0%',
          x: '-50%',
          willChange: 'transform'
        }}
      >
        <div className="w-full">
          <h1 className="text-[10vw] font-bold tracking-wider text-white text-center whitespace-nowrap">
            EcoStep
          </h1>
        </div>
      </motion.div>

      {/* First Section - Full screen */}
      <div className="relative h-screen">
        {/* Background Image */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2913&auto=format&fit=crop")',
            filter: 'brightness(0.4)'
          }}
        />

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="container mx-auto px-4 py-8 flex justify-between items-center text-white/80">
            <span className="text-sm tracking-wider"></span>
            <span className="text-sm tracking-wider">TRACK YOUR IMPACT</span>
          </div>
          <div className="w-full h-[1px] bg-white/20" />
        </div>
      </div>

      {/* Second Section - With Navigation */}
      <div className="relative min-h-screen bg-[#222222]">
        {/* Header in second section */}
        <div className="sticky top-0 left-0 right-0 z-[50] bg-[#222222]">
          <div className="w-full h-[1px] bg-white/20" />
          <nav className="container mx-auto px-4">
            <div className="flex items-center justify-between py-5">
              <motion.div 
                className="flex items-center space-x-8"
                style={{ opacity: navOpacity }}
              >
                <a href="#articles" className="text-sm tracking-wider text-white hover:text-white/70 transition-colors">
                  ARTICLES
                </a>
                <a href="#about" className="text-sm tracking-wider text-white hover:text-white/70 transition-colors">
                  ABOUT
                </a>
                <a href="#mission" className="text-sm tracking-wider text-white hover:text-white/70 transition-colors">
                  MISSION
                </a>
              </motion.div>
              <div className="invisible">
                <span className="text-lg font-light tracking-wider text-white">EcoStep</span>
              </div>
              <motion.div 
                className="flex items-center space-x-8"
                style={{ opacity: navOpacity }}
              >
                <a href="#contact" className="text-sm tracking-wider text-white hover:text-white/70 transition-colors">
                  CONTACT
                </a>
                <a href="/login" className="text-sm tracking-wider text-white hover:text-white/70 transition-colors">
                  LOGIN
                </a>
              </motion.div>
            </div>
          </nav>
          <div className="w-full h-[1px] bg-white/20" />
        </div>
        
        {/* Content Sections */}
        <div className="pt-32">
          {/* Articles Section */}
          <section id="articles" className="py-32">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-7xl font-light mb-16 text-white text-center"
                >
                  Latest Articles
                </motion.h2>
                <div className="grid md:grid-cols-3 gap-12">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="group cursor-pointer"
                  >
                    <a href="https://www.treehugger.com/sustainable-living-4862329" className="block">
                      <div className="aspect-[4/5] bg-gray-800 rounded-lg overflow-hidden mb-6">
                        <img 
                          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09" 
                          alt="Sustainable Living"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <h3 className="text-xl font-light text-white mb-3 group-hover:text-green-400 transition-colors">Sustainable Living Guide</h3>
                      <p className="text-gray-400">Discover practical tips for reducing your carbon footprint.</p>
                    </a>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="group cursor-pointer"
                  >
                    <a href="https://www.ecowatch.com/environmental-impact-guide" className="block">
                      <div className="aspect-[4/5] bg-gray-800 rounded-lg overflow-hidden mb-6">
                        <img 
                          src="https://images.unsplash.com/photo-1470115636492-6d2b56f9146d" 
                          alt="Environmental Impact"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <h3 className="text-xl font-light text-white mb-3 group-hover:text-green-400 transition-colors">Environmental Impact</h3>
                      <p className="text-gray-400">Understanding your daily choices and their effects.</p>
                    </a>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="group cursor-pointer"
                  >
                    <a href="https://eartheasy.com/blog/2024/03/green-technology-innovations" className="block">
                      <div className="aspect-[4/5] bg-gray-800 rounded-lg overflow-hidden mb-6">
                        <img 
                          src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e" 
                          alt="Green Technology"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <h3 className="text-xl font-light text-white mb-3 group-hover:text-green-400 transition-colors">Green Technology</h3>
                      <p className="text-gray-400">Exploring innovations in sustainable technology.</p>
                    </a>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5"></div>
            <div className="container mx-auto px-4 relative">
              <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <h2 className="text-7xl font-light mb-8 text-white">About Us</h2>
                    <div className="prose prose-lg text-gray-300">
                      <p className="text-xl leading-relaxed">
                        We are dedicated to making environmental sustainability accessible and measurable. 
                        Our platform helps individuals and organizations track and reduce their carbon footprint 
                        through innovative solutions and data-driven insights.
                      </p>
                      <p className="text-xl leading-relaxed mt-6">
                        Join us in our journey towards a more sustainable future, where every small action 
                        contributes to significant environmental impact.
                      </p>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1497250681960-ef046c08a56e" 
                        alt="About EcoStep"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>

          {/* Mission Section */}
          <section id="mission" className="py-32">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-7xl font-light mb-16 text-white text-center"
                >
                  Our Mission
                </motion.h2>
                <div className="grid md:grid-cols-3 gap-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-center"
                  >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-3xl">🌱</span>
                    </div>
                    <h3 className="text-xl font-light text-white mb-4">Sustainability</h3>
                    <p className="text-gray-400">Promoting sustainable practices and lifestyle choices.</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center"
                  >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-3xl">📊</span>
                    </div>
                    <h3 className="text-xl font-light text-white mb-4">Measurement</h3>
                    <p className="text-gray-400">Providing accurate tools to track environmental impact.</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-center"
                  >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-3xl">🌍</span>
                    </div>
                    <h3 className="text-xl font-light text-white mb-4">Impact</h3>
                    <p className="text-gray-400">Creating meaningful change for our planet's future.</p>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-32">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-5xl font-light mb-12 text-white">Contact Us</h2>
                <div className="prose prose-lg text-gray-300">
                  <p>Get in touch with us to learn more about our initiatives.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
} 