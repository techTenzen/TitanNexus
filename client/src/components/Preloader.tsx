import { useEffect, useRef } from 'react';
import '../styles/preloader.css';

interface PreloaderProps {
    onComplete: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
    const preloaderRef = useRef<HTMLDivElement>(null);
    const mainHeaderRef = useRef<HTMLHeadingElement>(null);
    const taglineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Text animation for main header
        if (mainHeaderRef.current) {
            const textWrapper = mainHeaderRef.current;
            textWrapper.innerHTML = textWrapper.textContent?.replace(
                /\S/g,
                "<span class='letter'>$&</span>"
            ) || '';
        }

        // Define our animation sequences using standard DOM manipulation and CSS
        const animateHeader = () => {
            const letters = document.querySelectorAll('.main-header .letter');

            // Animate the letters in sequence
            letters.forEach((letter, index) => {
                setTimeout(() => {
                    (letter as HTMLElement).style.opacity = '1';
                    (letter as HTMLElement).style.transform = 'translateY(0)';
                }, 5800 + (index * 20));
            });

            // Fade out the main header after animation completes
            setTimeout(() => {
                if (mainHeaderRef.current) {
                    mainHeaderRef.current.style.opacity = '0.1';
                }
            }, 7200);

            // Animate in the tagline
            setTimeout(() => {
                if (taglineRef.current) {
                    taglineRef.current.style.opacity = '1';
                    taglineRef.current.style.transform = 'translateY(0)';
                }
            }, 7300);
        };

        const animateBlocks = () => {
            const animateTitles = () => {
                const titleDivs = document.querySelectorAll('.titles > div');

                // Animate in
                titleDivs.forEach((div, index) => {
                    setTimeout(() => {
                        (div as HTMLElement).style.transform = 'translateX(0)';
                        (div as HTMLElement).style.opacity = '1';
                    }, index * 1000);

                    // Animate out
                    setTimeout(() => {
                        (div as HTMLElement).style.transform = 'translateX(60px)';
                        (div as HTMLElement).style.opacity = '0';
                    }, 800 + index * 1000);
                });
            };

            const animateColorBlocks = () => {
                const blocks = document.querySelectorAll('li.block');

                // Animate in
                blocks.forEach((block, index) => {
                    setTimeout(() => {
                        (block as HTMLElement).style.transform = 'translateX(0)';
                    }, 2500 + index * 120);

                    // Animate out
                    setTimeout(() => {
                        (block as HTMLElement).style.transform = 'translateX(1600px)';
                    }, 4500 + index * 120);
                });
            };

            animateTitles();
            animateColorBlocks();
        };

        // Start animations
        animateBlocks();
        animateHeader();

        // Fade out the entire preloader
        setTimeout(() => {
            if (preloaderRef.current) {
                preloaderRef.current.style.opacity = '0';
            }
        }, 9000);

        // Complete preloader after fade out
        setTimeout(() => {
            onComplete();
        }, 11000); // Extended from 10000 to 11000 to allow for fade out
    }, [onComplete]);

    return (
        <div id="preloader" ref={preloaderRef}>
            <div className="container">
                <div className="text-container">
                    <h1 className="main-header" ref={mainHeaderRef}>
                        STEP INTO NEXUS
                    </h1>
                    <div className="tagline" ref={taglineRef}>
                        CONNECTING IDEAS • INSPIRING INNOVATION • CREATING FUTURE
                    </div>
                </div>

                <div className="titles">
                    <div className="title title-1"><h1>Make</h1></div>
                    <div className="title title-2"><h1>A</h1></div>
                    <div className="title title-3"><h1>Difference</h1></div>
                </div>
                <ul className="blocks">
                    <li className="block-1 block"></li>
                    <li className="block-2 block"></li>
                    <li className="block-3 block"></li>
                    <li className="block-4 block"></li>
                    <li className="block-5 block"></li>
                    <li className="block-6 block"></li>
                </ul>
            </div>
        </div>
    );
};

export default Preloader;

// CAR DRIFT PRELOADER
//
// import React, { useEffect, useRef, useState } from 'react';
// import gsap from 'gsap';
// import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
//
// // Register GSAP plugins
// if (typeof window !== 'undefined') {
//     gsap.registerPlugin(MotionPathPlugin);
// }
//
// export default function TitanNexusCarDriftPreloader({ isLoading = true, onComplete = () => {} }) {
//     const containerRef = useRef(null);
//     const carRef = useRef(null);
//     const svgRef = useRef(null);
//
//     useEffect(() => {
//         if (!containerRef.current || !carRef.current || !svgRef.current) return;
//
//         const container = containerRef.current;
//         const car = carRef.current;
//         const svg = svgRef.current;
//
//         // Create smoke container
//         const smokeContainer = document.createElement('div');
//         smokeContainer.className = 'absolute inset-0 pointer-events-none';
//         container.appendChild(smokeContainer);
//
//         // Create the main timeline
//         const mainTl = gsap.timeline({
//             repeat: isLoading ? -1 : 0,
//             onComplete: () => {
//                 if (!isLoading) {
//                     gsap.to(container, {
//                         opacity: 0,
//                         duration: 0.8,
//                         onComplete
//                     });
//                 }
//             }
//         });
//
//         // Get all path elements
//         const paths = svg.querySelectorAll('path');
//
//         // Function to create smoke particles
//         const createSmoke = (x, y) => {
//             const smoke = document.createElement('div');
//             smoke.className = 'absolute rounded-full bg-white opacity-70';
//             smoke.style.width = '10px';
//             smoke.style.height = '10px';
//             smoke.style.left = `${x}px`;
//             smoke.style.top = `${y}px`;
//             smokeContainer.appendChild(smoke);
//
//             // Animate the smoke
//             gsap.to(smoke, {
//                 width: '25px',
//                 height: '25px',
//                 opacity: 0,
//                 duration: 1.5,
//                 onComplete: () => {
//                     if (smoke.parentNode) {
//                         smoke.parentNode.removeChild(smoke);
//                     }
//                 }
//             });
//
//             return smoke;
//         };
//
//         // Set initial car position
//         const firstPath = paths[0];
//         if (firstPath) {
//             const pathLength = firstPath.getTotalLength();
//             const startPoint = firstPath.getPointAtLength(0);
//             gsap.set(car, {
//                 x: startPoint.x,
//                 y: startPoint.y,
//                 transformOrigin: "center center"
//             });
//         }
//
//         // Create timeline for car following paths and generating smoke
//         paths.forEach((path, index) => {
//             const pathLength = path.getTotalLength();
//             const pathDuration = pathLength / 300; // Adjust duration based on path length
//
//             // Add car animation following the path
//             mainTl.to(car, {
//                 duration: pathDuration,
//                 motionPath: {
//                     path: path,
//                     align: path,
//                     alignOrigin: [0.5, 0.5],
//                     autoRotate: true,
//                 },
//                 ease: "power1.inOut",
//                 onUpdate: function() {
//                     // Get current position of car
//                     const carPosition = this.targets()[0].getBoundingClientRect();
//                     const containerPosition = container.getBoundingClientRect();
//
//                     // Create smoke effect
//                     if (Math.random() < 0.3) { // Adjust frequency of smoke particles
//                         const relativeX = carPosition.left - containerPosition.left + carPosition.width/2;
//                         const relativeY = carPosition.top - containerPosition.top + carPosition.height/2;
//                         createSmoke(relativeX, relativeY);
//                     }
//                 }
//             });
//
//             // Add small pause between groups of paths
//             if ((index + 1) % 3 === 0) {
//                 mainTl.to(car, { duration: 0.1 });
//             }
//         });
//
//         // Add final pause before repeating
//         mainTl.to(car, { duration: 0.5 });
//
//         return () => {
//             mainTl.kill();
//             if (smokeContainer.parentNode) {
//                 smokeContainer.parentNode.removeChild(smokeContainer);
//             }
//         };
//     }, [isLoading, onComplete]);
//
//     return (
//         <div
//             ref={containerRef}
//             className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 overflow-hidden"
//         >
//             {/* Title shown at the top */}
//             <div className="absolute top-10 left-0 right-0 text-center">
//                 <h2 className="text-xl text-white font-bold">Loading Titan Nexus</h2>
//                 <p className="text-blue-400 text-sm mt-2">Burning rubber to get you there...</p>
//             </div>
//
//             {/* SVG with paths for the car to follow */}
//             <svg
//                 ref={svgRef}
//                 className="absolute inset-0 w-full h-full"
//                 viewBox="0 0 1200 600"
//                 style={{ opacity: 0.1 }} // Nearly invisible paths, just for animation
//             >
//                 {/* T */}
//                 <path d="M100,400 L100,200" stroke="white" strokeWidth="2" fill="none" />
//                 <path d="M50,200 L150,200" stroke="white" strokeWidth="2" fill="none" />
//
//                 {/* I */}
//                 <path d="M200,200 L200,400" stroke="white" strokeWidth="2" fill="none" />
//
//                 {/* T */}
//                 <path d="M300,400 L300,200" stroke="white" strokeWidth="2" fill="none" />
//                 <path d="M250,200 L350,200" stroke="white" strokeWidth="2" fill="none" />
//
//                 {/* A */}
//                 <path d="M400,400 C420,240 430,240 450,400" stroke="white" strokeWidth="2" fill="none" />
//                 <path d="M410,320 L440,320" stroke="white" strokeWidth="2" fill="none" />
//
//                 {/* N */}
//                 <path d="M500,400 L500,200 L550,400 L550,200" stroke="white" strokeWidth="2" fill="none" />
//
//                 {/* Space */}
//
//                 {/* N */}
//                 <path d="M650,400 L650,200 L700,400 L700,200" stroke="white" strokeWidth="2" fill="none" />
//
//                 {/* E */}
//                 <path d="M750,200 L750,400" stroke="white" strokeWidth="2" fill="none" />
//                 <path d="M750,200 L800,200" stroke="white" strokeWidth="2" fill="none" />
//                 <path d="M750,300 L790,300" stroke="white" strokeWidth="2" fill="none" />
//                 <path d="M750,400 L800,400" stroke="white" strokeWidth="2" fill="none" />
//
//                 {/* X */}
//                 <path d="M850,200 L900,400" stroke="white" strokeWidth="2" fill="none" />
//                 <path d="M850,400 L900,200" stroke="white" strokeWidth="2" fill="none" />
//
//                 {/* U */}
//                 <path d="M950,200 L950,360 C950,400 980,400 980,360 L980,200" stroke="white" strokeWidth="2" fill="none" />
//
//                 {/* S */}
//                 <path d="M1030,200 C1070,200 1070,280 1030,300 C990,320 990,400 1030,400" stroke="white" strokeWidth="2" fill="none" />
//             </svg>
//
//             {/* Car element */}
//             <div
//                 ref={carRef}
//                 className="absolute"
//                 style={{ zIndex: 10 }}
//             >
//                 <svg width="40" height="20" viewBox="0 0 40 20">
//                     {/* Car body */}
//                     <rect x="5" y="10" width="30" height="6" rx="2" fill="#333" />
//                     <rect x="10" y="5" width="20" height="5" rx="2" fill="#555" />
//                     <rect x="7" y="16" width="26" height="2" rx="1" fill="#222" />
//
//                     {/* Windows */}
//                     <rect x="12" y="6" width="6" height="4" rx="1" fill="#88ccff" />
//                     <rect x="22" y="6" width="6" height="4" rx="1" fill="#88ccff" />
//
//                     {/* Wheels */}
//                     <circle cx="10" cy="18" r="2" fill="#111" />
//                     <circle cx="30" cy="18" r="2" fill="#111" />
//
//                     {/* Headlights */}
//                     <rect x="32" y="11" width="3" height="2" rx="1" fill="#ffee99" />
//                     <rect x="5" y="11" width="3" height="2" rx="1" fill="#ff3333" />
//                 </svg>
//             </div>
//
//             {/* Visual guide for the text (faded background text) */}
//             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10">
//                 <h1 className="text-white text-7xl font-bold tracking-wider">TITAN NEXUS</h1>
//             </div>
//
//             {/* Loading indicator */}
//             <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center">
//                 <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
//                     <div
//                         className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
//                         style={{
//                             width: '60%',
//                             animation: 'loading-progress 2s ease-in-out infinite alternate'
//                         }}
//                     ></div>
//                 </div>
//                 <div className="text-gray-400 text-sm mt-3">Initializing systems...</div>
//             </div>
//
//             {/* Global Styles */}
//             <style jsx>{`
//         @keyframes loading-progress {
//           0% { width: 5%; }
//           100% { width: 75%; }
//         }
//       `}</style>
//         </div>
//     );
// }
//
// // Usage example
// export function App() {
//     const [loading, setLoading] = useState(true);
//
//     useEffect(() => {
//         // Simulate loading time - replace with your actual loading logic
//         const timer = setTimeout(() => {
//             setLoading(false);
//         }, 8000);
//
//         return () => clearTimeout(timer);
//     }, []);
//
//     return (
//         <div className="app">
//             {loading && <TitanNexusCarDriftPreloader isLoading={loading} onComplete={() => console.log('Loading complete')} />}
//             {!loading && <YourMainContent />}
//         </div>
//     );
//}