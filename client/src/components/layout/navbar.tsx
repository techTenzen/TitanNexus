import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Loader2, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Navbar component for all users
export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [location] = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleDirectLogout = async () => {
        try {
            setIsLoggingOut(true);
            await apiRequest("POST", "/api/logout");

            // Update auth state
            queryClient.setQueryData(["/api/user"], null);
            queryClient.invalidateQueries({ queryKey: ["/api/user"] });

            toast({
                title: "Logout successful",
                description: "You have been logged out.",
            });

            // Force reload the page to reset all states
            window.location.reload();
        } catch (error) {
            toast({
                title: "Logout failed",
                description: error instanceof Error ? error.message : "An unknown error occurred",
                variant: "destructive",
            });
        } finally {
            setIsLoggingOut(false);
        }
    };

    // Separate public links (accessible to all) from authenticated links
    const publicLinks = [
        { href: '/', label: 'Home' },
        { href: '/documentation', label: 'Documentation' },
    ];

    const authenticatedLinks = [
        { href: '/forum', label: 'Forum' },
        { href: '/projects', label: 'Projects' },
    ];

    // State for user auth status
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // Check for authentication on component mount
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

    // Render auth controls using direct API status
    const renderAuthControls = () => {
        if (isCheckingAuth) {
            return <div className="h-10 w-24 bg-background-secondary/50 rounded-lg animate-pulse"></div>;
        } else if (currentUser) {
            return (
                <div className="flex items-center space-x-4">
                    <Link href={`/profile/${currentUser.username}`}>
                        <span className="flex items-center text-white">
                            <User className="w-4 h-4 mr-2" />
                            {currentUser.username}
                        </span>
                    </Link>
                    <Button
                        className="px-4 py-1 border rounded text-white border-white hover:bg-white hover:text-[#0b1020] transition"
                        onClick={handleDirectLogout}
                        disabled={isLoggingOut}
                    >
                        {isLoggingOut ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing Out...
                            </>
                        ) : "Sign Out"}
                    </Button>
                </div>
            );
        } else {
            return (
                <>
                    <Link href="/auth">
                        <span className="text-sm font-medium hover:text-[#FF3370] transition-colors cursor-pointer text-white">
                            Sign In
                        </span>
                    </Link>
                    <Link href="/auth">
                        <span className="px-4 py-1 border rounded text-white border-white hover:bg-white hover:text-[#0b1020] transition cursor-pointer ml-4">
                            Sign Up
                        </span>
                    </Link>
                </>
            );
        }
    };

    // Mobile auth controls using direct API status
    const renderMobileAuthControls = () => {
        if (isCheckingAuth) {
            return <div className="h-10 w-full bg-background-secondary/50 rounded-lg animate-pulse"></div>;
        } else if (currentUser) {
            return (
                <>
                    <Link href={`/profile/${currentUser.username}`}>
                        <span
                            className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-[#7928CA]/10 rounded-md cursor-pointer flex items-center"
                            onClick={() => setIsOpen(false)}
                        >
                            <User className="w-4 h-4 mr-2" />
                            My Profile
                        </span>
                    </Link>
                    <button
                        className="w-full text-left block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-[#7928CA]/10 rounded-md"
                        onClick={() => {
                            handleDirectLogout();
                            setIsOpen(false);
                        }}
                        disabled={isLoggingOut}
                    >
                        {isLoggingOut ? (
                            <>
                                <Loader2 className="inline-block mr-2 h-4 w-4 animate-spin" />
                                Signing Out...
                            </>
                        ) : "Sign Out"}
                    </button>
                </>
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
    };

    return (
        <nav className="w-full bg-[#0b1020] h-16">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
                {/* Logo or Brand */}
                <Link href="/">
                    <span className="cursor-pointer flex items-center">
                        <img
                            src="/logo.png"
                            alt="Titan AI"
                            className="h-28 w-auto"
                            draggable={false}
                        />
                        {/* If you want both logo and text, uncomment below */}
                        {/* <span className="ml-2 font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-[#FF3370] to-[#7928CA]">Titan AI</span> */}
                    </span>
                </Link>

                {/* Navigation Links */}
                <ul className="hidden md:flex items-center space-x-8 ml-20">
                    {publicLinks.map((link) => (
                        <li key={link.href}>
                            <Link href={link.href}>
                                <span className={cn(
                                    location === link.href
                                        ? "font-semibold text-white border-b-2 border-[#FF3370] pb-1"
                                        : "text-white hover:text-[#FF3370] transition-colors"
                                )}>
                                    {link.label}
                                </span>
                            </Link>
                        </li>
                    ))}

                    {/* Authenticated links */}
                    {currentUser && authenticatedLinks.map((link) => (
                        <li key={link.href}>
                            <Link href={link.href}>
                                <span className={cn(
                                    location === link.href
                                        ? "font-semibold text-white border-b-2 border-[#FF3370] pb-1"
                                        : "text-white hover:text-[#FF3370] transition-colors"
                                )}>
                                    {link.label}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* User Info and Actions */}
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

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-background-primary/90 backdrop-blur-sm">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {/* Always show public links in mobile menu */}
                        {publicLinks.map((link) => (
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

                        {/* Only show authenticated links in mobile menu if user is logged in */}
                        {currentUser && authenticatedLinks.map((link) => (
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
                            {renderMobileAuthControls()}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}