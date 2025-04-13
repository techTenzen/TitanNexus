import { motion } from 'framer-motion';
import { FaRobot, FaLaptopCode, FaCogs, FaCode, FaTerminal, FaCube } from 'react-icons/fa';

export function DocumentationSection() {
  const docs = [
    {
      icon: <FaRobot />,
      title: "Multi-Model Prompting",
      description:
          "Titan AI supports dynamic switching between models like GPT-4, Claude, and Mistral for tailored code generation, planning, and optimization.",
      bgColor: "bg-[#FF3370]/20",
      textColor: "text-[#FF3370]",
      hoverColor: "group-hover:text-[#FF3370]",
    },
    {
      icon: <FaLaptopCode />,
      title: "WebContainer Runtime Environment",
      description:
          "Understand how Titan AI runs full-stack applications inside the browser using virtualized Node.js environments powered by WebContainers.",
      bgColor: "bg-[#7928CA]/20",
      textColor: "text-[#7928CA]",
      hoverColor: "group-hover:text-[#7928CA]",
    },
    {
      icon: <FaCogs />,
      title: "AI-Based Error Detection & Recovery",
      description:
          "Learn how terminal output is parsed and piped back to LLMs for auto-debugging. Titan AI detects errors and rewrites faulty code automatically.",
      bgColor: "bg-[#FFD700]/20",
      textColor: "text-[#FFD700]",
      hoverColor: "group-hover:text-[#FFD700]",
    },
    {
      icon: <FaCode />,
      title: "Prompt Parsing & File Injection",
      description:
          "Explore how Titan AI converts natural language prompts into real, runnable project files — with directory management and file structure creation.",
      bgColor: "bg-[#00CED1]/20",
      textColor: "text-[#00CED1]",
      hoverColor: "group-hover:text-[#00CED1]",
    },
    {
      icon: <FaTerminal />,
      title: "Integrated Terminal & Logs",
      description:
          "Use a real-time terminal inside Titan AI to run commands, monitor logs, and execute build tools without switching tabs or using a local machine.",
      bgColor: "bg-[#32CD32]/20",
      textColor: "text-[#32CD32]",
      hoverColor: "group-hover:text-[#32CD32]",
    },
    {
      icon: <FaCube />,
      title: "File System Architecture",
      description:
          "Titan AI maintains a virtual project structure inside the browser. Learn how files are tracked, updated, and saved during generation and execution.",
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
                <motion.div
                    key={i}
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
                  <p className="text-gray-400">{doc.description}</p>
                </motion.div>
            ))}
          </div>
        </div>
      </section>
  );
}