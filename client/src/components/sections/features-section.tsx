import { motion } from 'framer-motion';
import { FaMicrochip, FaCube, FaUsers } from 'react-icons/fa';

export function FeaturesSection() {
  const features = [
    {
      icon: <FaMicrochip />,
      title: "Multi-model Architecture",
      description: "Seamlessly switch between multiple AI models or run them in parallel for comparing outputs and capabilities.",
      bgColor: "bg-[#FF3370]/20",
      textColor: "text-[#FF3370]",
    },
    {
      icon: <FaCube />,
      title: "Web Container Execution",
      description: "Execute and test generated code directly in your browser with our secure sandboxed container environment.",
      bgColor: "bg-[#7928CA]/20",
      textColor: "text-[#7928CA]",
    },
    {
      icon: <FaUsers />,
      title: "Collaborative Intelligence",
      description: "Build AI projects together with real-time collaboration, shared prompts, and team-based development workflows.",
      bgColor: "bg-[#00EAFF]/20",
      textColor: "text-[#00EAFF]",
    }
  ];
  
  return (
    <section className="py-16 bg-background relative ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Powerful AI Development Features</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-background-secondary/70 backdrop-blur-sm border border-white/10 p-6 rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                <span className={`${feature.textColor} text-xl`}>{feature.icon}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
