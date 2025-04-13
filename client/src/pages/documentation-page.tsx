import { useState } from 'react';
import { TickerBanner } from '@/components/layout/ticker-banner';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Terminal } from '@/components/ui/terminal';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FaServer, FaFileCode, FaPlug, FaBook, FaGithub, FaRobot, FaLaptopCode,
  FaCogs, FaCode, FaTerminal, FaCube, FaExchangeAlt } from 'react-icons/fa';
import { cn } from '@/lib/utils';

export default function DocumentationPage() {
  const [activePage, setActivePage] = useState('multi-model');

  const documentationPages = [
    {
      id: 'multi-model',
      icon: <FaRobot />,
      title: "Multi-Model Prompting",
      description:
          "Titan AI supports dynamic switching between models like GPT-4, Claude, and Mistral for tailored code generation, planning, and optimization.",
      bgColor: "bg-[#FF3370]/20",
      textColor: "text-[#FF3370]",
      hoverColor: "group-hover:text-[#FF3370]",
      content: {
        intro: "Titan AI's Multi-Model Prompting provides flexibility to choose the right AI model for each specific task in your workflow.",
        sections: [
          {
            title: 'Model Selection',
            content: 'Switch dynamically between GPT-4, Claude, and Mistral models based on their strengths. Use GPT-4 for complex reasoning, Claude for long-context tasks, and Mistral for speed-optimized workflows.'
          },
          {
            title: 'Context Preservation',
            content: 'When switching between models, Titan AI maintains your conversation history and project context, allowing for seamless transitions without losing progress.'
          },
          {
            title: 'Specialized Capabilities',
            content: 'Each model offers unique strengths: GPT-4 excels at complex problem-solving, Claude provides nuanced explanations, and Mistral delivers rapid code generation for simpler tasks.'
          }
        ],
        codeExample: `// Example of model switching in Titan AI
const titan = new TitanAI();

// Start with GPT-4 for planning
const projectPlan = await titan.generate({
  model: 'gpt-4',
  prompt: 'Design a React component architecture for a dashboard with real-time data visualization'
});

// Switch to Claude for detailed documentation
const documentation = await titan.generate({
  model: 'claude-3-opus',
  prompt: 'Generate detailed documentation for this component architecture',
  context: projectPlan // Previous context is preserved
});

// Use Mistral for rapid code implementation
const implementation = await titan.generate({
  model: 'mistral-large',
  prompt: 'Implement the React components based on this architecture',
  context: [projectPlan, documentation]
});`
      }
    },
    {
      id: 'webcontainer',
      icon: <FaLaptopCode />,
      title: "WebContainer Runtime Environment",
      description:
          "Understand how Titan AI runs full-stack applications inside the browser using virtualized Node.js environments powered by WebContainers.",
      bgColor: "bg-[#7928CA]/20",
      textColor: "text-[#7928CA]",
      hoverColor: "group-hover:text-[#7928CA]",
      content: {
        intro: "Titan AI's WebContainer technology allows for running full-stack Node.js applications directly in your browser without any server-side execution.",
        sections: [
          {
            title: 'Browser-Based Execution',
            content: 'WebContainers create a virtualized Node.js environment that runs entirely in your browser, enabling real-time code execution, npm package installation, and full application testing without deploying to a server.'
          },
          {
            title: 'Supported Technologies',
            content: 'Run various frameworks and libraries including React, Next.js, Express, and more. The environment supports npm, yarn, and pnpm for package management directly in the browser.'
          },
          {
            title: 'Performance Optimization',
            content: 'WebContainers are optimized for performance with intelligent caching, parallel processing, and memory management to provide a responsive development experience even for complex applications.'
          }
        ],
        codeExample: `// Initialize a WebContainer environment
const container = await titan.createWebContainer({
  template: 'node',
  packages: ['react', 'react-dom', 'express'],
  files: {
    'index.js': \`
      const express = require('express');
      const app = express();
      
      app.get('/', (req, res) => {
        res.send('Hello from WebContainer!');
      });
      
      app.listen(3000, () => {
        console.log('Server running at http://localhost:3000');
      });
    \`
  }
});

// Start the application
await container.run('node index.js');

// Access the running application
const url = container.getPreviewUrl(); // Returns http://localhost:3000`
      }
    },
    {
      id: 'error-detection',
      icon: <FaCogs />,
      title: "AI-Based Error Detection & Recovery",
      description:
          "Learn how terminal output is parsed and piped back to LLMs for auto-debugging. Titan AI detects errors and rewrites faulty code automatically.",
      bgColor: "bg-[#FFD700]/20",
      textColor: "text-[#FFD700]",
      hoverColor: "group-hover:text-[#FFD700]",
      content: {
        intro: "Titan AI features advanced error detection and automatic recovery capabilities that can identify issues in your code and fix them without manual intervention.",
        sections: [
          {
            title: 'Intelligent Error Parsing',
            content: 'The system monitors terminal output in real-time, identifying error patterns, stack traces, and compiler warnings across various languages and frameworks.'
          },
          {
            title: 'Self-Healing Code',
            content: 'When errors are detected, Titan AI automatically feeds the error context back to the language model, which generates fixes and improvements to resolve the issues.'
          },
          {
            title: 'Learning From Failures',
            content: 'The system tracks successful fixes and builds an internal knowledge base of common issues and their solutions, improving its debugging capabilities over time.'
          }
        ],
        codeExample: `// Example of error detection and recovery
try {
  await titan.executeCode(\`
    function calculateTotal(items) {
      return items.reduce((sum, item) => sum + item.price, 0);
    }
    
    // This will cause an error (items is undefined)
    console.log(calculateTotal());
  \`);
} catch (error) {
  // Titan AI automatically detects the error
  const diagnosis = await titan.diagnoseError(error);
  console.log(diagnosis);
  // Output: "The error occurred because 'items' is undefined in the 
  // calculateTotal function call. The function expects an array of 
  // items with price properties."
  
  // Auto-fix the code
  const fixedCode = await titan.fixCode(error);
  console.log(fixedCode);
  // Output: Updated code with proper parameter validation
}`
      }
    },
    {
      id: 'prompt-parsing',
      icon: <FaCode />,
      title: "Prompt Parsing & File Injection",
      description:
          "Explore how Titan AI converts natural language prompts into real, runnable project files — with directory management and file structure creation.",
      bgColor: "bg-[#00CED1]/20",
      textColor: "text-[#00CED1]",
      hoverColor: "group-hover:text-[#00CED1]",
      content: {
        intro: "Titan AI transforms natural language descriptions into complete project structures with multiple files, directories, and proper configurations.",
        sections: [
          {
            title: 'Natural Language to Code',
            content: 'Describe your project requirements in plain language, and Titan AI will parse your intent to generate appropriate file structures, code implementations, and configurations.'
          },
          {
            title: 'Directory Structure Generation',
            content: 'The system automatically creates appropriate directory structures based on best practices for the framework or language you\'re working with, organizing files logically.'
          },
          {
            title: 'Dependency Management',
            content: 'Titan AI identifies required dependencies from your prompt and automatically includes them in package.json, requirements.txt, or other appropriate configuration files.'
          }
        ],
        codeExample: `// Example of prompt to project conversion
const prompt = \`
Create a React application that fetches weather data from an API
and displays it in a responsive dashboard. Include dark/light mode.
\`;

// Generate a complete project structure
const project = await titan.createProject(prompt);

console.log(project.files);
/* Output:
[
  {path: 'src/App.jsx', content: '...'},
  {path: 'src/components/WeatherDashboard.jsx', content: '...'},
  {path: 'src/components/WeatherCard.jsx', content: '...'},
  {path: 'src/hooks/useWeatherData.js', content: '...'},
  {path: 'src/context/ThemeContext.jsx', content: '...'},
  {path: 'src/utils/api.js', content: '...'},
  {path: 'src/styles/global.css', content: '...'},
  {path: 'package.json', content: '...'},
]
*/`
      }
    },
    {
      id: 'integrated-terminal',
      icon: <FaTerminal />,
      title: "Integrated Terminal & Logs",
      description:
          "Use a real-time terminal inside Titan AI to run commands, monitor logs, and execute build tools without switching tabs or using a local machine.",
      bgColor: "bg-[#32CD32]/20",
      textColor: "text-[#32CD32]",
      hoverColor: "group-hover:text-[#32CD32]",
      content: {
        intro: "Titan AI provides a fully-functional terminal environment integrated directly into the browser, allowing you to execute commands and see real-time output.",
        sections: [
          {
            title: 'Command Execution',
            content: 'Run npm commands, build tools, tests, and any other CLI operations directly in the browser-based terminal with real-time output streaming.'
          },
          {
            title: 'Log Monitoring',
            content: 'View application logs, error messages, and debugging information in real-time as your application runs, with intelligent parsing and formatting.'
          },
          {
            title: 'Terminal History',
            content: 'Your command history is preserved throughout your session, allowing you to quickly rerun previous commands or modify them as needed.'
          }
        ],
        codeExample: `// Example of terminal integration in code
// Create a terminal instance
const terminal = titan.createTerminal({
  workingDirectory: '/app',
  environmentVariables: {
    NODE_ENV: 'development'
  }
});

// Execute commands with output streaming
const installProcess = await terminal.execute('npm install');
installProcess.on('output', (data) => {
  console.log(data); // Real-time npm install output
});

// Run the application with log capturing
const devProcess = await terminal.execute('npm run dev');
devProcess.logs.on('error', (error) => {
  // Automatically detect and respond to errors
  titan.suggestFix(error);
});

// Send user input to running process
devProcess.input('rs'); // For example, to restart a dev server`
      }
    },
    {
      id: 'filesystem',
      icon: <FaCube />,
      title: "File System Architecture",
      description:
          "Titan AI maintains a virtual project structure inside the browser. Learn how files are tracked, updated, and saved during generation and execution.",
      bgColor: "bg-[#00EAFF]/20",
      textColor: "text-[#00EAFF]",
      hoverColor: "group-hover:text-[#00EAFF]",
      content: {
        intro: "Titan AI implements a complete virtual file system in your browser, allowing for realistic project structures, file operations, and persistence.",
        sections: [
          {
            title: 'Virtual Directory Structure',
            content: 'Files and directories are represented in a tree structure that mirrors a real file system, complete with path resolution, file metadata, and directory navigation.'
          },
          {
            title: 'File Operations',
            content: 'Perform standard operations like create, read, update, delete, move, and copy on files and directories just as you would in a traditional development environment.'
          },
          {
            title: 'Persistence and Export',
            content: 'Files can be persisted across browser sessions and exported as ZIP archives or synchronized with GitHub, allowing you to continue your work across devices.'
          }
        ],
        codeExample: `// Example of file system operations
const fs = titan.fileSystem;

// Create directories
await fs.mkdir('/app/src/components', { recursive: true });

// Write a file
await fs.writeFile('/app/src/components/Button.jsx', \`
  import React from 'react';
  
  export const Button = ({ children, onClick }) => (
    <button 
      className="bg-blue-500 text-white px-4 py-2 rounded"
      onClick={onClick}
    >
      {children}
    </button>
  );
\`);

// Read file contents
const content = await fs.readFile('/app/src/components/Button.jsx', 'utf-8');

// List directory contents
const files = await fs.readdir('/app/src');
console.log(files); // ['components', 'App.jsx', 'index.js', ...]

// Export the project
const zipBlob = await fs.exportZip('/app');
// Can be downloaded or saved to cloud storage`
      }
    },
    {
      id: 'model-switching',
      icon: <FaExchangeAlt />,
      title: "Model Switching with Context Retention",
      description:
          "Switch models mid-task and retain prompt history and output context across different LLMs. Optimize workflows by choosing the right engine per task.",
      bgColor: "bg-[#FF8C00]/20",
      textColor: "text-[#FF8C00]",
      hoverColor: "group-hover:text-[#FF8C00]",
      content: {
        intro: "Titan AI allows you to seamlessly switch between different AI models during a workflow while maintaining full context and conversation history.",
        sections: [
          {
            title: 'Contextual Model Switching',
            content: 'Switch between models like GPT-4, Claude, and Mistral at any point in your workflow while preserving all previous interactions, code, and project context.'
          },
          {
            title: 'Task-Optimized Selection',
            content: 'Choose different models based on their strengths for specific tasks: planning with one model, generating code with another, and optimizing with a third.'
          },
          {
            title: 'Performance Profiling',
            content: 'The system tracks performance metrics for each model on different types of tasks, allowing you to make informed decisions about which model to use when.'
          }
        ],
        codeExample: `// Example of context-preserving model switching
const session = titan.createSession();

// Start with one model
await session.runWithModel('gpt-4', async (model) => {
  await model.chat("Design a schema for a blog API");
  // GPT-4 generates database schema and API endpoints
});

// Switch models but keep context
await session.runWithModel('claude-3-opus', async (model) => {
  await model.chat("Add authentication to this API design");
  // Claude adds auth while aware of previous schema
});

// Switch to optimization-focused model
await session.runWithModel('mistral-large', async (model) => {
  await model.chat("Optimize the database queries for performance");
  // Mistral optimizes with awareness of everything before
});

// Get the complete project with contributions from all models
const finalProject = session.getProject();`
      }
    },
    {
      id: 'api-integration',
      icon: <FaPlug />,
      title: "API Calls & External Fetch Integration",
      description:
          "Titan AI can write and test API calls using fetch, axios, or other libraries directly inside the sandboxed container. Test real API endpoints in real time.",
      bgColor: "bg-[#7CFC00]/20",
      textColor: "text-[#7CFC00]",
      hoverColor: "group-hover:text-[#7CFC00]",
      content: {
        intro: "Titan AI enables you to write, test, and debug API calls within its secure sandbox environment, allowing real interaction with external services.",
        sections: [
          {
            title: 'Secure API Testing',
            content: 'Make real HTTP requests to external APIs from within the sandbox environment, with appropriate security controls to prevent abuse or unauthorized access.'
          },
          {
            title: 'Mock API Responses',
            content: 'For APIs that require authentication or aren\'t publicly available, Titan AI can generate realistic mock responses based on API documentation or examples.'
          },
          {
            title: 'API Integration Workflows',
            content: 'Build and test complete API integration workflows, including authentication, error handling, rate limiting, and data processing logic.'
          }
        ],
        codeExample: `// Example of API testing in Titan AI
// Write code to interact with an API
const apiCode = \`
  async function fetchUserData(userId) {
    try {
      const response = await fetch(\`https://api.example.com/users/\${userId}\`);
      if (!response.ok) {
        throw new Error(\`API error: \${response.status}\`);
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      throw error;
    }
  }
  
  // Test the function
  fetchUserData(123)
    .then(data => console.log("User data:", data))
    .catch(err => console.error(err));
\`;

// Execute the API call in the sandbox
await titan.executeCode(apiCode);

// Alternatively, use mock mode for testing without real API calls
await titan.executeCode(apiCode, {
  mockApis: {
    'https://api.example.com/users/123': {
      status: 200,
      body: {
        id: 123,
        name: "Jane Doe",
        email: "jane@example.com"
      }
    }
  }
});`
      }
    }
  ];

  const activeSectionData = documentationPages.find(page => page.id === activePage);

  return (
      <div className="min-h-screen flex flex-col bg-background text-foreground bg-[radial-gradient(circle_at_10%_20%,rgba(121,40,202,0.1)_0%,transparent_30%),radial-gradient(circle_at_90%_80%,rgba(255,51,112,0.1)_0%,transparent_30%)] bg-grid-pattern">
        <TickerBanner />
        <Navbar />

        <main className="flex-grow py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar */}
              <motion.div
                  className="lg:w-64 shrink-0"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
              >
                <div className="sticky top-24 bg-background-secondary/70 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                  <div className="flex items-center mb-6">
                    <FaBook className="mr-2 text-[#FF3370]" />
                    <h2 className="text-xl font-bold">Documentation</h2>
                  </div>

                  <nav className="space-y-1">
                    {documentationPages.map(page => (
                        <button
                            key={page.id}
                            onClick={() => setActivePage(page.id)}
                            className={cn(
                                "flex items-center w-full px-3 py-2 text-left rounded-lg transition-colors",
                                activePage === page.id
                                    ? `${page.bgColor} ${page.textColor}`
                                    : "text-gray-400 hover:bg-[#7928CA]/10 hover:text-white"
                            )}
                        >
                          <span className="mr-2">{page.icon}</span>
                          <span>{page.title}</span>
                        </button>
                    ))}
                  </nav>

                  <div className="mt-6 pt-6 border-t border-gray-800">
                    <a
                        href="#"
                        className="flex items-center text-gray-400 hover:text-white transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                      <FaGithub className="mr-2" />
                      <span>View on GitHub</span>
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Main Content */}
              <motion.div
                  className="flex-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
              >
                {activeSectionData && (
                    <div className="bg-background-secondary/70 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8">
                      <div className="flex items-center mb-6">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${activeSectionData.bgColor} ${activeSectionData.textColor}`}>
                          {activeSectionData.icon}
                        </div>
                        <h1 className="text-3xl font-bold">{activeSectionData.title}</h1>
                      </div>

                      <p className="text-gray-300 text-lg mb-8">{activeSectionData.content.intro}</p>

                      <div className="space-y-8 mb-8">
                        {activeSectionData.content.sections.map((section, index) => (
                            <div key={index}>
                              <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
                              <p className="text-gray-400">{section.content}</p>
                            </div>
                        ))}
                      </div>

                      <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-4">Example Code</h2>
                        <Terminal code={activeSectionData.content.codeExample} title={`${activeSectionData.title.toLowerCase().replace(/\s+/g, '-')}-example.js`} />
                      </div>


                    </div>
                )}
              </motion.div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
  );
}