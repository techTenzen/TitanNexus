import { Link } from 'wouter';
import { FaGithub, FaTwitter, FaDiscord } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="bg-background border-t border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF3370] to-[#7928CA] mb-4">
              Titan AI
            </div>
            <p className="text-gray-400 mb-4">The open-source AI-powered development environment for building the next generation of applications.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#FF3370] transition-colors">
                <FaGithub className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#7928CA] transition-colors">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00EAFF] transition-colors">
                <FaDiscord className="text-xl" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/"><a className="text-gray-400 hover:text-white transition-colors">Home</a></Link></li>
              <li><Link href="/documentation"><a className="text-gray-400 hover:text-white transition-colors">Documentation</a></Link></li>
              <li><Link href="/forum"><a className="text-gray-400 hover:text-white transition-colors">Community Forum</a></Link></li>
              <li><Link href="/projects"><a className="text-gray-400 hover:text-white transition-colors">Projects</a></Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tutorials</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Changelog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Status</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Reference</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Titan AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
