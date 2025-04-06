import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

// Navbar component for all users
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/documentation', label: 'Documentation' },
    { href: '/forum', label: 'Forum' },
    { href: '/projects', label: 'Projects' },
  ];

  // Conditionally render auth controls based on user status
  // This approach avoids using useAuth() at the top level which might throw errors
  // if the component is rendered outside of an AuthProvider context
  
  const renderAuthControls = () => {
    try {
      const { user, logoutMutation, isLoading } = useAuth();
      
      if (isLoading) {
        return <div className="h-10 w-24 bg-background-secondary/50 rounded-lg animate-pulse"></div>;
      } else if (user) {
        return (
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Hello, {user.username}</span>
            <Button 
              variant="outline" 
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              Sign Out
            </Button>
          </div>
        );
      } else {
        return (
          <>
            <Link href="/auth">
              <span className="text-sm font-medium hover:text-[#FF3370] transition-colors cursor-pointer">
                Sign In
              </span>
            </Link>
            <Link href="/auth">
              <span className="bg-background-secondary border border-[#7928CA] hover:bg-[#7928CA] transition-colors duration-300 rounded-lg px-4 py-2 text-sm font-medium cursor-pointer">
                Sign Up
              </span>
            </Link>
          </>
        );
      }
    } catch (error) {
      // If we're outside of an auth context, just show login/signup buttons
      return (
        <>
          <Link href="/auth">
            <span className="text-sm font-medium hover:text-[#FF3370] transition-colors cursor-pointer">
              Sign In
            </span>
          </Link>
          <Link href="/auth">
            <span className="bg-background-secondary border border-[#7928CA] hover:bg-[#7928CA] transition-colors duration-300 rounded-lg px-4 py-2 text-sm font-medium cursor-pointer">
              Sign Up
            </span>
          </Link>
        </>
      );
    }
  };
  
  const renderMobileAuthControls = () => {
    try {
      const { user, logoutMutation, isLoading } = useAuth();
      
      if (isLoading) {
        return <div className="h-10 w-full bg-background-secondary/50 rounded-lg animate-pulse"></div>;
      } else if (user) {
        return (
          <button 
            className="w-full text-left block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-[#7928CA]/10 rounded-md"
            onClick={() => {
              logoutMutation.mutate();
              setIsOpen(false);
            }}
            disabled={logoutMutation.isPending}
          >
            Sign Out
          </button>
        );
      } else {
        return (
          <>
            <Link href="/auth">
              <span 
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-[#7928CA]/10 rounded-md cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </span>
            </Link>
            <Link href="/auth">
              <span 
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-[#7928CA]/10 rounded-md cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </span>
            </Link>
          </>
        );
      }
    } catch (error) {
      // If we're outside of an auth context, just show login/signup buttons
      return (
        <>
          <Link href="/auth">
            <span 
              className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-[#7928CA]/10 rounded-md cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </span>
          </Link>
          <Link href="/auth">
            <span 
              className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-[#7928CA]/10 rounded-md cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              Sign Up
            </span>
          </Link>
        </>
      );
    }
  };

  return (
    <nav className={cn(
      "sticky top-0 z-50 transition-all duration-300 backdrop-blur-sm",
      isScrolled ? "bg-black/50" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF3370] to-[#7928CA] cursor-pointer">
                Titan AI
              </span>
            </Link>
            
            <div className="hidden md:flex ml-10 space-x-8">
              {links.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span className={cn(
                    "px-3 py-2 text-sm font-medium transition-colors relative cursor-pointer",
                    location === link.href 
                      ? "text-white after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-[#FF3370] after:to-[#7928CA]" 
                      : "text-gray-300 hover:text-white"
                  )}>
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {renderAuthControls()}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-background-primary/90 backdrop-blur-sm">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                <span 
                  className={cn(
                    "block px-3 py-2 text-base font-medium rounded-md cursor-pointer",
                    location === link.href 
                      ? "text-white bg-[#7928CA]/20" 
                      : "text-gray-300 hover:text-white hover:bg-[#7928CA]/10"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            <div className="mobile-auth-controls">
              <div className="mobile-auth-btns">
                <Link href="/auth">
                  <span 
                    className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-[#7928CA]/10 rounded-md cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </span>
                </Link>
                <Link href="/auth">
                  <span 
                    className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-[#7928CA]/10 rounded-md cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}