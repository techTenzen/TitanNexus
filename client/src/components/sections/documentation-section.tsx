import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { FaServer, FaFileCode, FaPlug } from 'react-icons/fa';

export function DocumentationSection() {
  const docs = [
    {
      icon: <FaServer />,
      title: "Code Execution Engine",
      description: "Learn how Titan AI's secure sandboxed execution environment works to run and test generated code.",
      bgColor: "bg-[#FF3370]/20",
      textColor: "text-[#FF3370]",
      hoverColor: "group-hover:text-[#FF3370]",
    },
    {
      icon: <FaFileCode />,
      title: "Prompt Parsing & File Handling",
      description: "Understand how to structure prompts for optimal results and work with multiple files in your projects.",
      bgColor: "bg-[#7928CA]/20",
      textColor: "text-[#7928CA]",
      hoverColor: "group-hover:text-[#7928CA]",
    },
    {
      icon: <FaPlug />,
      title: "API Workflow in Titan AI",
      description: "Explore how to integrate Titan AI's capabilities into your own applications and services via API.",
      bgColor: "bg-[#00EAFF]/20",
      textColor: "text-[#00EAFF]",
      hoverColor: "group-hover:text-[#00EAFF]",
    }
  ];
  
  return (
    <section id="documentation" className="py-16 bg-background-secondary/80 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-12">Documentation</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {docs.map((doc, i) => (
            <Link key={i} href="/documentation">
              <motion.a
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-background-secondary/70 backdrop-blur-sm border border-white/10 p-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg block group"
              >
                <div className={`w-12 h-12 ${doc.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:bg-opacity-30 transition-colors`}>
                  <span className={`${doc.textColor} text-xl`}>{doc.icon}</span>
                </div>
                <h3 className={`text-xl font-bold mb-2 transition-colors ${doc.hoverColor}`}>
                  {doc.title}
                </h3>
                <p className="text-gray-400 mb-4">{doc.description}</p>
                <span className={`${doc.textColor} group-hover:underline transition-all`}>
                  Read more →
                </span>
              </motion.a>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
