import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal } from '@/components/ui/terminal';
import { GradientButton } from '@/components/ui/gradient-button';
import { FaGithub, FaComments } from 'react-icons/fa';
import { Link } from 'wouter';
import gsap from 'gsap';

export function HeroSection() {
    const [currentUser, setCurrentUser] = useState(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [showSecondText, setShowSecondText] = useState(false);
    const textOneRef = useRef(null);
    const textTwoRef = useRef(null);
    const [hideFirstText, setHideFirstText] = useState(false);

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

    // Fixed text transition animation
    useEffect(() => {
        const timer = setTimeout(() => {
            if (textOneRef.current && textTwoRef.current) {
                // First, hide the first text
                gsap.to(textOneRef.current, {
                    duration: 0.3,
                    opacity: 0,
                    y: -10,
                    onComplete: () => {
                        // After first text is hidden, update states
                        setHideFirstText(true);
                        setShowSecondText(true);

                        // Make sure the second text is properly initialized for animation
                        gsap.set(textTwoRef.current, {
                            opacity: 0,
                            y: 10
                        });

                        // Then animate the second text in
                        gsap.to(textTwoRef.current, {
                            duration: 0.5,
                            opacity: 1,
                            y: 0,
                            ease: "power2.out"
                        });
                    }
                });
            }
        }, 800);  // timeout duration

        return () => clearTimeout(timer);
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
            {/* Background Blobs */}
            <div className="absolute top-1/4 right-0 w-1/3 h-1/3 bg-[#7928CA] opacity-10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-1/4 w-1/4 h-1/3 bg-[#FF3370] opacity-10 rounded-full filter blur-3xl"></div>

            {/* Gradient Text Animation Styles */}
            <style jsx global>{`
                /* Gradient Text Animation Styles */
                @import url('https://fonts.googleapis.com/css2?family=Geist+Sans:wght@400;500;600;700&display=swap');

                @font-face {
                    font-family: "Geist Sans";
                    src: url("https://assets.codepen.io/605876/GeistVF.ttf") format("truetype");
                }

                :root {
                    --highlight: 2;
                    --spread: 1;
                    --primary: #ffffff;
                    --secondary: #606060;
                    --angle: 180deg;
                }

                .gradient-text {
                    font-family: "Inter", sans-serif; /* Using a cleaner font */
                    font-weight: 700;
                    line-height: 1.1;
                    background:
                            conic-gradient(from var(--angle) at 50% 50%,
                            #30EFFF 0deg,
                            #7928CA 120deg,
                            #FF3370 240deg,
                            #30EFFF 360deg);
                    background-clip: text;
                    -webkit-background-clip: text;
                    color: transparent;
                    animation: rotate 8s infinite linear;
                    letter-spacing: -0.02em;
                }

                @property --angle {
                    inherits: true;
                    initial-value: 0deg;
                    syntax: '<angle>';
                }

                @keyframes rotate {
                    to { --angle: 360deg; }
                }
            `}</style>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <motion.div
                    className="text-center mb-10 md:mb-16 relative"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ zIndex: 5 }}
                >
                    {/* Release Badge */}
                    <div className="inline-flex items-center justify-center px-4 py-1 mb-4 rounded-full text-sm font-medium text-[#6f3fc9] bg-[#f3e8ff] animate-fade-in">
                        <span className="mr-2 text-[#6f3fc9] text-base">●</span>
                        <a
                            href="https://62966f99.titan-5cd.pages.dev/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                        >
                            Just released: Titan AI 2.0 with multi-model support
                        </a>
                    </div>

                    {/* Headline Section with Animated Gradient Effect */}
                    <div className="relative h-40 sm:h-44 md:h-52 overflow-visible">
                        {/* First tagline text */}
                        {!hideFirstText && (
                            <h1
                                ref={textOneRef}
                                className="gradient-text text-4xl sm:text-5xl md:text-6xl font-bold leading-tight absolute top-0 left-0 w-full tracking-tight transition-opacity duration-500"
                            >
                                <span className="text-2xl sm:text-3xl md:text-4xl block mb-1 font-medium">Build</span>
                                SOFTWARE WITH AI <span className="font-extrabold">COLLABORATION</span>
                            </h1>
                        )}

                        {/* Second tagline text */}
                        <h1
                            ref={textTwoRef}
                            className={`gradient-text text-4xl sm:text-5xl md:text-6xl font-bold leading-tight absolute top-0 left-0 w-full tracking-tight ${!showSecondText ? 'opacity-0' : ''}`}
                        >
                            <span className="text-2xl sm:text-3xl md:text-4xl block mb-1 font-medium">The</span>
                            OPEN-SOURCE <span className="font-extrabold italic">AI-POWERED</span> DEV PLATFORM
                        </h1>
                    </div>

                    {/* Subtext */}
                    <motion.p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto" variants={itemVariants}>
                        Build, collaborate, and deploy intelligent applications with our community-driven platform.
                    </motion.p>

                    {/* Buttons */}
                    <motion.div className="mt-12 flex flex-wrap justify-center gap-4" variants={itemVariants}>
                        {currentUser ? (
                            <Link href="/forum">
                                <GradientButton size="lg" icon={<FaComments />}>
                                    Join Discussion
                                </GradientButton>
                            </Link>
                        ) : (
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

                {/* Terminal */}
                <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-4xl mx-auto mt-8 mb-16 relative"
                    style={{ zIndex: 5 }}
                >
                    <Terminal code={terminalCode} />
                </motion.div>
            </div>
        </section>
    );
}