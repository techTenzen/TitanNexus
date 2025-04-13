import { useEffect, useRef } from 'react';
import '../styles/preloader.css';

interface PreloaderProps {
    onComplete: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
    const mainHeaderRef = useRef<HTMLHeadingElement>(null);
    const taglineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Import libraries
        const loadLibraries = async () => {
            // Import GSAP properly
            const gsap = await import('gsap');

            // Try different import approaches for anime.js
            let anime;
            try {
                // Try standard import first
                const animeModule = await import('animejs');
                anime = animeModule.default;
            } catch (err) {
                console.error("Error importing anime.js:", err);
                // If that fails, fallback to CDN
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js';
                script.async = true;
                document.body.appendChild(script);

                // Wait for script to load
                await new Promise((resolve) => {
                    script.onload = resolve;
                });

                // Use the global anime object
                anime = (window as any).anime;
            }

            // Increased animation speed by reducing durations and delays
            gsap.gsap.fromTo(
                ".titles > div",
                {
                    x: "-60",
                    opacity: 0
                },
                {
                    x: "0",
                    opacity: 1,
                    duration: 0.5,
                    ease: "power3.inOut",
                    stagger: 1
                }
            );

            gsap.gsap.to(
                ".titles > div",
                {
                    x: "60",
                    opacity: 0,
                    duration: 0.5,
                    ease: "power3.inOut",
                    delay: 0.8,
                    stagger: 1
                }
            );

            gsap.gsap.fromTo(
                "li.block",
                { x: "-1600" },
                {
                    x: "0",
                    duration: 2,
                    delay: 2.5,
                    ease: "expo.inOut",
                    stagger: 0.12
                }
            );

            gsap.gsap.to(
                "li.block",
                {
                    x: "1600",
                    duration: 2,
                    delay: 4.5,
                    ease: "expo.inOut",
                    stagger: 0.12
                }
            );

            // Text animation for main header
            if (mainHeaderRef.current) {
                const textWrapper = mainHeaderRef.current;
                textWrapper.innerHTML = textWrapper.textContent?.replace(
                    /\S/g,
                    "<span class='letter'>$&</span>"
                ) || '';
            }

            // Main header animation
            if (anime) {
                anime.timeline().add({
                    targets: ".main-header .letter",
                    opacity: [0, 1],
                    translateY: [60, 0],
                    translateZ: 0,
                    easing: "easeOutExpo",
                    duration: 1500,
                    delay: (el: any, i: number) => 5800 + 20 * i,
                });

                // Main header fade out when tagline comes in
                anime.timeline().add({
                    targets: ".main-header",
                    opacity: [1, 0.1],
                    easing: "easeOutExpo",
                    duration: 1000,
                    delay: 7200
                });

                // Tagline animation - fade in after main header
                anime.timeline().add({
                    targets: ".tagline",
                    opacity: [0, 1],
                    translateY: [20, 0],
                    easing: "easeOutExpo",
                    duration: 1000,
                    delay: 7300
                });
            } else {
                // Fallback to GSAP for text animation if anime.js is not available
                gsap.gsap.fromTo(
                    ".main-header .letter",
                    { opacity: 0, y: 60 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1.5,
                        ease: "expo.out",
                        stagger: 0.02,
                        delay: 5.8
                    }
                );

                // Main header fade out
                gsap.gsap.to(
                    ".main-header",
                    {
                        opacity: 0.1,
                        duration: 1,
                        ease: "expo.out",
                        delay: 7.2
                    }
                );

                gsap.gsap.fromTo(
                    ".tagline",
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: "expo.out",
                        delay: 7.3
                    }
                );
            }

            // Complete preloader after animations
            setTimeout(() => {
                onComplete();
            }, 10000);
        };

        loadLibraries();
    }, [onComplete]);

    return (
        <div id="preloader">
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