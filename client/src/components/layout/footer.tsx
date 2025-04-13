import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Footer() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_KEY = 'pub_801303769c462368ffc998b50a57cfd6d9f48';

    async function fetchNews() {
      try {
        setLoading(true);
        const url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=artificial+intelligence&language=en&category=technology`;

        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`API responded with status: ${res.status}`);
        }

        const data = await res.json();

        if (data.results && data.results.length > 0) {
          setNews(data.results);
        } else {
          const fallbackUrl = `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=tech+innovation&language=en&category=technology`;
          const fallbackRes = await fetch(fallbackUrl);

          if (!fallbackRes.ok) {
            throw new Error(`Fallback API responded with status: ${fallbackRes.status}`);
          }

          const fallbackData = await fallbackRes.json();
          setNews(fallbackData.results || []);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setError('Unable to fetch latest news. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
    const refreshInterval = setInterval(fetchNews, 30 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, []);

  const neonGlowKeyframes = `
    @keyframes neonGlow {
      0% {
        box-shadow: 0 0 10px rgba(255, 0, 255, 0.6), 0 0 20px rgba(255, 0, 255, 0.4), 0 0 30px rgba(255, 0, 255, 0.2);
      }
      50% {
        box-shadow: 0 0 20px rgba(255, 0, 255, 0.8), 0 0 30px rgba(255, 0, 255, 0.6), 0 0 40px rgba(255, 0, 255, 0.4);
      }
      100% {
        box-shadow: 0 0 10px rgba(255, 0, 255, 0.6), 0 0 20px rgba(255, 0, 255, 0.4), 0 0 30px rgba(255, 0, 255, 0.2);
      }
    }
  `;

  const duplicatedNews = [...news, ...news.slice(0, 3)];

  return (
      <footer className="bg-background border-t border-gray-800 py-12">
        <motion.div
            className="max-w-3xl mx-auto text-center px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="text-3xl font-extrabold mb-6 text-gradient">🔮 Latest in AI & Tech</h3>
          <div
              className="bg-gray-900/60 backdrop-blur p-6 rounded-2xl border border-purple-500 shadow-lg transform hover:scale-105 transition-all duration-300 overflow-hidden relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                boxShadow: '0 0 10px rgba(255, 0, 255, 0.8), 0 0 20px rgba(255, 0, 255, 0.6), 0 0 30px rgba(255, 0, 255, 0.4)',
                animation: 'neonGlow 1.5s ease-in-out infinite alternate',
                height: '300px',
              }}
          >
            {loading ? (
                <div className="flex items-center justify-center py-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                  <span className="ml-3 text-gray-300">Fetching the future...</span>
                </div>
            ) : error ? (
                <p className="text-red-400 py-4">{error}</p>
            ) : (
                <motion.ul
                    className="space-y-4 text-left text-gray-300 absolute w-full left-0 px-6"
                    animate={{
                      y: isHovered ? 0 : ['0%', '-100%'],
                    }}
                    transition={{
                      repeat: isHovered ? 0 : Infinity,
                      repeatType: 'loop',
                      duration: 19,
                      ease: 'linear',
                      ...(isHovered
                          ? {
                            type: 'spring',
                            stiffness: 100,
                            damping: 10,
                          }
                          : {}),
                    }}
                >
                  {duplicatedNews.length > 0 ? (
                      duplicatedNews.map((item, idx) => (
                          <motion.li
                              key={idx}
                              className="p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200"
                              whileHover={{
                                scale: 1.02,
                                textShadow: '0px 0px 8px rgba(168, 85, 247, 0.6)',
                              }}
                          >
                            <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block hover:text-purple-400 transition-all"
                            >
                              <span className="text-purple-400">📡</span>{' '}
                              <span className="font-semibold">{item.title}</span>
                              <p className="text-xs text-gray-400 mt-1 ml-5">
                                {item.source_id || 'Unknown Source'} •{' '}
                                {item.pubDate ? new Date(item.pubDate).toLocaleDateString() : ''}
                              </p>
                            </a>
                          </motion.li>
                      ))
                  ) : (
                      <li className="text-gray-500 italic text-center py-4">No fresh news found.</li>
                  )}
                </motion.ul>
            )}
          </div>

          <motion.p
              className="mt-12 pt-8 border-t border-gray-800 text-gray-400 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
          >
            © {new Date().getFullYear()} Titan AI. Open-source with ❤️
          </motion.p>

          <motion.p
              className="mt-2 text-gray-400 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
          >
            Coded by{' '}
            <a
                href="https://github.com/techTenzen"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gradient hover:text-white transition-colors"
            >
              Tenz ⚡
            </a>
          </motion.p>
        </motion.div>

        <style>{neonGlowKeyframes}</style>
      </footer>
  );
}
