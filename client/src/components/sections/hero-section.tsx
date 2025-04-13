import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal } from '@/components/ui/terminal';
import { GradientButton } from '@/components/ui/gradient-button';
import { FaGithub, FaComments } from 'react-icons/fa';
import { Link } from 'wouter';

export function HeroSection() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check authentication status directly
  useEffect(() => {
    fetch('/api/user')
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('Not authenticated');
        })
        .then(user => {
          setCurrentUser(user);
          setIsCheckingAuth(false);
        })
        .catch(() => {
          setCurrentUser(null);
          setIsCheckingAuth(false);
        });
  }, []);

  const terminalCode = `import { TitanAI } from '@titan-ai/core';
import { WebContainer } from '@titan-ai/containers';

// Initialize the Titan AI instance with configuration
const titan = new TitanAI({
  models: ['gpt-4', 'claude-3', 'gemini-pro'],
  container: new WebContainer(),
  collaborative: true
});

// Define a task for the AI to execute
async function createReactComponent() {
  const prompt = \`
    Create a React component for a dashboard card that displays:
    - A metric with title
    - A trend indicator (up/down)
    - A sparkline chart of recent values
    Use Tailwind CSS for styling.
  \`;

  const result = await titan.execute({
    prompt,
    outputFormat: 'jsx',
    dependencies: ['react', 'tailwindcss']
  });

  return result.code;
}

// Execute and display the result
createReactComponent().then(code => {
  console.log('Generated Component:', code);
  titan.preview(code); // Open preview in container
});`;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
      <section className="relative py-12 md:py-20 overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-1/4 right-0 w-1/3 h-1/3 bg-[#7928CA] opacity-10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-1/4 h-1/3 bg-[#FF3370] opacity-10 rounded-full filter blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
              className="text-center mb-10 md:mb-16"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
          >
            <div className="inline-flex items-center justify-center px-4 py-1 mb-4 rounded-full text-sm font-medium text-[#6f3fc9] bg-[#f3e8ff] animate-fade-in">
              <span className="mr-2 text-[#6f3fc9] text-base">●</span>
              <a
                  href="https://titan1.pages.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
              >
                Just released: Titan AI 2.0 with multi-model support
              </a>
            </div>

            <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight"
                variants={itemVariants}
            >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF3370] via-[#7928CA] to-[#00EAFF]">
              The open-source AI-powered development environment
            </span>
            </motion.h1>

            <motion.p
                className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto"
                variants={itemVariants}
            >
              Build, collaborate, and deploy intelligent applications with our community-driven platform.
            </motion.p>

            <motion.div
                className="mt-8 flex flex-wrap justify-center gap-4"
                variants={itemVariants}
            >
              {currentUser ? (
                  // Show Join Discussion button for logged-in users
                  <Link href="/forum">
                    <GradientButton size="lg" icon={<FaComments />}>
                      Join Discussion
                    </GradientButton>
                  </Link>
              ) : (
                  // Show Get Started button for non-logged in users
                  <Link href="/auth">
                    <GradientButton size="lg">Get Started</GradientButton>
                  </Link>
              )}

              <GradientButton
                  variant="secondary"
                  size="lg"
                  icon={<FaGithub />}
                  onClick={() => window.open('https://github.com/techTenzen/Titan', '_blank')}
              >
                View on GitHub
              </GradientButton>
            </motion.div>
          </motion.div>

          {/* Terminal Component */}
          <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="max-w-4xl mx-auto mt-8 mb-16"
          >
            <Terminal code={terminalCode} />
          </motion.div>
        </div>
      </section>
  );
}