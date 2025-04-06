import { useState } from 'react';
import { TickerBanner } from '@/components/layout/ticker-banner';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Terminal } from '@/components/ui/terminal';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FaServer, FaFileCode, FaPlug, FaBook, FaGithub } from 'react-icons/fa';
import { cn } from '@/lib/utils';

export default function DocumentationPage() {
  const [activePage, setActivePage] = useState('execution');

  const documentationPages = [
    {
      id: 'execution',
      title: 'Code Execution Engine',
      icon: <FaServer />,
      description: 'Learn how Titan AI\'s secure sandboxed execution environment works to run and test generated code.',
      content: {
        intro: 'The Titan AI Code Execution Engine is a secure, sandboxed environment that allows you to run and test generated code directly in your browser.',
        sections: [
          {
            title: 'How It Works',
            content: 'Titan AI uses a WebContainer architecture to provide a full Node.js environment right in your browser. This allows you to execute code, install npm packages, and run full-stack applications without any server-side execution.'
          },
          {
            title: 'Security Features',
            content: 'Our execution engine runs in an isolated sandbox with strict resource limits and security boundaries. All code execution happens locally in your browser, ensuring your data remains private and secure.'
          },
          {
            title: 'Supported Runtimes',
            content: 'Currently supported runtimes include Node.js, Python (via Pyodide), and WebAssembly. This allows you to run JavaScript, TypeScript, Python, and other languages that compile to WebAssembly.'
          }
        ],
        codeExample: `// Initialize the execution engine
const engine = new TitanAI.ExecutionEngine({
  runtime: 'node', // 'node', 'python', or 'wasm'
  memoryLimit: '512mb',
  timeoutMs: 30000,
});

// Execute some code
const result = await engine.execute(\`
  const answer = 42;
  console.log("The answer is:", answer);
  return { result: answer };
\`);

console.log(result.stdout); // "The answer is: 42"
console.log(result.returnValue); // { result: 42 }`
      }
    },
    {
      id: 'prompts',
      title: 'Prompt Parsing & File Handling',
      icon: <FaFileCode />,
      description: 'Understand how to structure prompts for optimal results and work with multiple files in your projects.',
      content: {
        intro: 'Effective prompt engineering is essential for getting the best results from Titan AI. This guide covers best practices for structuring prompts and working with multiple files.',
        sections: [
          {
            title: 'Prompt Structure',
            content: 'Start with a clear, specific instruction about what you want to build. Include details about functionality, architecture, and any specific libraries or patterns you want to use.'
          },
          {
            title: 'Multi-file Projects',
            content: 'Titan AI can generate and manage multiple files in a project. You can specify file paths and relationships between files in your prompts to create complete project structures.'
          },
          {
            title: 'Context Management',
            content: 'The system automatically maintains context between prompts, allowing you to iteratively build and refine your project through multiple interactions.'
          }
        ],
        codeExample: `// Example of a structured prompt for Titan AI
const prompt = \`
Create a React component for a dashboard card that displays:
- A metric with title
- A trend indicator (up/down)
- A sparkline chart of recent values

Use the following structure:
- components/DashboardCard.tsx for the main component
- components/Sparkline.tsx for the chart
- utils/formatters.ts for data formatting helpers

Use Tailwind CSS for styling and React Query for data fetching.
\`;

const files = await titan.generateFiles(prompt);
console.log(files); // Array of generated file objects`
      }
    },
    {
      id: 'api',
      title: 'API Workflow in Titan AI',
      icon: <FaPlug />,
      description: 'Explore how to integrate Titan AI\'s capabilities into your own applications and services via API.',
      content: {
        intro: 'The Titan AI API allows you to integrate AI-powered code generation, execution, and analysis directly into your applications and workflows.',
        sections: [
          {
            title: 'Authentication',
            content: 'All API requests require authentication using an API key. You can generate API keys in your account dashboard, with options for different permission levels and rate limits.'
          },
          {
            title: 'Code Generation',
            content: 'The core of the API is the /generate endpoint, which accepts natural language prompts and returns generated code. You can specify parameters like model, temperature, and output format.'
          },
          {
            title: 'Execution API',
            content: 'The /execute endpoint allows you to run code directly and get the results. This is useful for testing generated code or running scripts in a secure environment.'
          }
        ],
        codeExample: `// Example of using the Titan AI API with fetch
async function generateCode(prompt) {
  const response = await fetch('https://api.titan-ai.dev/v1/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify({
      prompt: prompt,
      model: 'titan-1',
      temperature: 0.7,
      output_format: 'json'
    })
  });
  
  return await response.json();
}

const result = await generateCode(
  "Create a function that calculates Fibonacci numbers"
);
console.log(result.code);`
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
                          ? "bg-[#7928CA]/20 text-white" 
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
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 
                      ${activePage === 'execution' ? 'bg-[#FF3370]/20 text-[#FF3370]' : 
                        activePage === 'prompts' ? 'bg-[#7928CA]/20 text-[#7928CA]' : 
                        'bg-[#00EAFF]/20 text-[#00EAFF]'}`}>
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
                    <Terminal code={activeSectionData.content.codeExample} title={`${activeSectionData.title.toLowerCase()}-example.js`} />
                  </div>
                  
                  <div className="mt-8 pt-8 border-t border-gray-800">
                    <h3 className="text-lg font-semibold mb-4">Additional Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <a href="#" className="p-4 bg-background-tertiary/50 rounded-lg hover:bg-background-tertiary transition-colors">
                        <h4 className="font-medium">Full API Reference</h4>
                        <p className="text-sm text-gray-400">Complete documentation of all available API endpoints and parameters.</p>
                      </a>
                      <a href="#" className="p-4 bg-background-tertiary/50 rounded-lg hover:bg-background-tertiary transition-colors">
                        <h4 className="font-medium">Tutorial: Building your first Titan AI app</h4>
                        <p className="text-sm text-gray-400">Step-by-step guide to creating an application using Titan AI.</p>
                      </a>
                    </div>
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
