import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { DiscussionCard } from '@/components/forum/discussion-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'wouter';
import { Discussion } from '@shared/schema';

export function DiscussionsSection() {
    // State for user auth status
    const [currentUser, setCurrentUser] = useState(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    // Track which tooltip is currently showing
    const [showTooltip, setShowTooltip] = useState(null);

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

    // Fetch discussions data
    const { data: discussions, isLoading, error } = useQuery({
        queryKey: ['/api/discussions/top'],
    });

    // Pass auth status to the DiscussionCard component
    const renderDiscussionCard = (discussion, index) => {
        const props = {
            discussion,
            index,
            isAuthenticated: !!currentUser,
        };

        if (currentUser) {
            return (
                <Link key={discussion.id} href={`/forum/${discussion.id}`}>
                    <div className="cursor-pointer transition-all hover:opacity-90">
                        <DiscussionCard {...props} />
                    </div>
                </Link>
            );
        } else {
            return (
                <div key={discussion.id} className="relative group">
                    {/* Actual discussion card is fully visible and unblurred */}
                    <div className="pointer-events-none">
                        <DiscussionCard {...props} />
                    </div>

                    {/* Transparent clickable layer with hover effect */}
                    <Link href="/auth">
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-transparent group-hover:bg-black/40 transition-colors duration-300 cursor-pointer">
      <span className="text-white text-xs sm:text-sm font-medium bg-black/60 px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Sign in to view full discussion
      </span>
                        </div>
                    </Link>
                </div>


            );
        }
    };

    return (
        <section id="forum" className="py-16 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-3xl font-bold">Recent Discussions</h2>


                </div>

                {isLoading || isCheckingAuth ? (
                    // Loading skeleton
                    <div className="space-y-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-background-secondary/70 rounded-xl p-6">
                                <div className="flex">
                                    <div className="flex flex-col items-center mr-6 w-16">
                                        <Skeleton className="w-8 h-8 mb-2" />
                                        <Skeleton className="w-8 h-6 mb-2" />
                                        <Skeleton className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center mb-2">
                                            <Skeleton className="w-24 h-6 mr-2 rounded-full" />
                                            <Skeleton className="w-40 h-4" />
                                        </div>
                                        <Skeleton className="w-full h-6 mb-2" />
                                        <Skeleton className="w-full h-4 mb-2" />
                                        <Skeleton className="w-full h-4 mb-2" />
                                        <Skeleton className="w-2/3 h-4 mb-4" />
                                        <div className="flex items-center">
                                            <Skeleton className="w-24 h-4 mr-4" />
                                            <Skeleton className="w-24 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    // Error state
                    <div className="text-center py-10 bg-background-secondary/50 rounded-xl">
                        <p className="text-red-400">Failed to load discussions. Please try again later.</p>
                    </div>
                ) : discussions && discussions.length === 0 ? (
                    // Empty state
                    <div className="text-center py-10 bg-background-secondary/50 rounded-xl">
                        <p className="text-gray-400">No discussions available yet.</p>
                    </div>
                ) : (
                    // Discussions list with conditional wrapping based on auth status
                    <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {discussions && discussions.map((discussion, index) => (
                            renderDiscussionCard(discussion, index)
                        ))}
                    </motion.div>
                )}

                {/* Call to action for non-authenticated users */}

            </div>
        </section>
    );
}