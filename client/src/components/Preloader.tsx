import { useEffect, useRef } from 'react';
import '../styles/preloader.css';

interface PreloaderProps {
    onComplete: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
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

        // Complete preloader after animations
        setTimeout(() => {
            onComplete();
        }, 10000);
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