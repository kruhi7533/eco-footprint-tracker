import { motion } from 'framer-motion';
import { Car, Lightbulb, Leaf, Recycle } from 'lucide-react';

const categories = [
  {
    title: 'Transportation',
    description: 'Track and reduce emissions from your daily commute and travel.',
    icon: Car,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136',
    color: 'bg-blue-500',
  },
  {
    title: 'Energy Usage',
    description: 'Monitor and optimize your household energy consumption.',
    icon: Lightbulb,
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e',
    color: 'bg-yellow-500',
  },
  {
    title: 'Diet & Food',
    description: 'Make sustainable food choices for a healthier planet.',
    icon: Leaf,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    color: 'bg-green-500',
  },
  {
    title: 'Waste Management',
    description: 'Reduce, reuse, and recycle to minimize your waste footprint.',
    icon: Recycle,
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b',
    color: 'bg-purple-500',
  },
];

export function CategoryGrid() {
  return (
    <div>
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-light mb-4"
        >
          Track Your Impact
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gray-600 max-w-2xl mx-auto"
        >
          Monitor and reduce your carbon footprint across different aspects of your daily life.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
          >
            <div
              className="group relative overflow-hidden rounded-2xl cursor-pointer 
              transform transition-all duration-500 hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 z-10" />
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-64 object-cover transition-transform duration-500 
                group-hover:scale-110"
              />
              <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-full ${category.color}`}>
                    <category.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl text-white font-medium">{category.title}</h3>
                </div>
                <p className="text-white/90">{category.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 