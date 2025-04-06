import { motion } from 'framer-motion';

export function TickerBanner() {
  return (
    <div className="bg-gradient-to-r from-[#7928CA] to-[#FF3370] py-1 overflow-hidden">
      <div className="relative flex overflow-x-hidden">
        <motion.div
          className="whitespace-nowrap flex items-center"
          animate={{ x: "-50%" }}
          transition={{
            ease: "linear",
            duration: 15,
            repeat: Infinity,
          }}
        >
          <span className="inline-block px-4 text-white">
            🎉 Just released: Titan AI 2.0 - Faster model processing, improved code execution, and more! Check out the docs for details.
          </span>
          <span className="inline-block px-4 text-white">
            🎉 Just released: Titan AI 2.0 - Faster model processing, improved code execution, and more! Check out the docs for details.
          </span>
          <span className="inline-block px-4 text-white">
            🎉 Just released: Titan AI 2.0 - Faster model processing, improved code execution, and more! Check out the docs for details.
          </span>
        </motion.div>
      </div>
    </div>
  );
}
