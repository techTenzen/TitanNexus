// client/src/pages/profile-page.tsx
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link, useLocation, useParams } from 'wouter';
import {
    Star, MessageCircle, Code,
    Plus
} from 'lucide-react';

import { TickerBanner } from '@/components/layout/ticker-banner';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { apiRequest } from '@/lib/queryClient';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Default background patterns
const defaultProjectBackground = "data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='rgba(0,234,255,0.1)' fill-rule='evenodd'/%3E%3C/svg%3E";

const defaultDiscussionBackground = "data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='rgba(121,40,202,0.075)' fill-opacity='0.4'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

export default function ProfilePage() {
    const { username } = useParams();
    const [_, navigate] = useLocation();
    const [activeTab, setActiveTab] = useState("overview");

    // Check if current user is authenticated and if it's the same as the profile being viewed
    const [currentUser, setCurrentUser] = useState(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isOwnProfile, setIsOwnProfile] = useState(false);

    // Determine if viewing own profile or someone else's
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const authResponse = await fetch('/api/auth/status');
                if (authResponse.ok) {
                    const userData = await authResponse.json();
                    if (userData.isAuthenticated) {
                        const userResponse = await fetch(`/api/user/${userData.userId}`);
                        if (userResponse.ok) {
                            const user = await userResponse.json();
                            setCurrentUser(user);

                            // If no username param, show current user's profile
                            if (!username) {
                                navigate(`/profile/${user.username}`);
                            }
                        }
                    }
                }
                setIsCheckingAuth(false);
            } catch (error) {
                console.error("Auth check failed:", error);
                setCurrentUser(null);
                setIsCheckingAuth(false);
                // If not authenticated and trying to view own profile, redirect to login
                if (!username) {
                    navigate('/auth');
                }
            }
        };

        checkAuth();
    }, [username, navigate]);

    // Adjust the profile data fetching query
    const { data: profileData, isLoading: isLoadingProfile } = useQuery({
        queryKey: ['profile', username],
        enabled: !!username || !isCheckingAuth,
        queryFn: async () => {
            if (!username && currentUser) return currentUser;

            const res = await apiRequest('GET', `/api/users`);
            const users = await res.json();
            const user = users.find(u => u.username === username);

            if (!user) throw new Error('User not found');

            const userRes = await apiRequest('GET', `/api/user/${user.id}`);
            return await userRes.json();
        }
    });

    // Check if this is the user's own profile
    useEffect(() => {
        if (profileData && currentUser) {
            setIsOwnProfile(profileData.id === currentUser.id);
        }
    }, [profileData, currentUser]);

    // Modify projects and discussions queries
    const { data: userProjects, isLoading: isLoadingProjects } = useQuery({
        queryKey: ['userProjects', profileData?.id],
        enabled: !!profileData?.id,
        queryFn: async () => {
            // Get all projects and filter by user ID
            const res = await apiRequest('GET', '/api/projects');
            const projects = await res.json();
            return projects.filter(project => project.userId === profileData.id);
        }
    });

    // In the userDiscussions query in your ProfilePage component, modify it to fetch comment counts:

    const { data: userDiscussions, isLoading: isLoadingDiscussions } = useQuery({
        queryKey: ['userDiscussions', profileData?.id],
        enabled: !!profileData?.id,
        queryFn: async () => {
            // Get all discussions and filter by user ID
            const res = await apiRequest('GET', '/api/discussions');
            const discussions = await res.json();
            const filteredDiscussions = discussions.filter(discussion => discussion.userId === profileData.id);

            // Fetch comment counts for each discussion
            const discussionsWithComments = await Promise.all(
                filteredDiscussions.map(async (discussion) => {
                    try {
                        const commentsRes = await apiRequest('GET', `/api/discussions/${discussion.id}/comments`);
                        const comments = await commentsRes.json();
                        return {
                            ...discussion,
                            commentsCount: Array.isArray(comments) ? comments.length : 0
                        };
                    } catch (error) {
                        console.error(`Failed to fetch comments for discussion ${discussion.id}:`, error);
                        return discussion; // Keep original if fetch fails
                    }
                })
            );

            return discussionsWithComments;
        }
    });

    // Calculate user stats
    const getUserStats = () => {
        return {
            projects: userProjects?.length || 0,
            discussions: userDiscussions?.length || 0,
            upvotes: (userProjects?.reduce((sum, project) => sum + (project.upvotes || 0), 0) || 0) +
                (userDiscussions?.reduce((sum, discussion) => sum + (discussion.upvotes || 0), 0) || 0),
            memberSince: profileData ? new Date(profileData.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }) : '',
        };
    };

    // Loading state
    if (isCheckingAuth || (isLoadingProfile && !profileData)) {
        return (
            <div className="min-h-screen flex flex-col bg-background text-foreground bg-[radial-gradient(circle_at_10%_20%,rgba(121,40,202,0.1)_0%,transparent_30%),radial-gradient(circle_at_90%_80%,rgba(255,51,112,0.1)_0%,transparent_30%)] bg-grid-pattern">
                <TickerBanner />
                <Navbar />
                <main className="flex-grow flex items-center justify-center">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="h-12 w-12 rounded-full border-4 border-t-transparent border-[#7928CA] animate-spin" />
                        <p className="text-lg font-medium text-white">Loading profile...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // If profile not found
    if (!profileData && !isLoadingProfile) {
        return (
            <div className="min-h-screen flex flex-col bg-background text-foreground bg-[radial-gradient(circle_at_10%_20%,rgba(121,40,202,0.1)_0%,transparent_30%),radial-gradient(circle_at_90%_80%,rgba(255,51,112,0.1)_0%,transparent_30%)] bg-grid-pattern">
                <TickerBanner />
                <Navbar />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center max-w-md px-4">
                        <h2 className="text-2xl font-bold text-[#FF3370] mb-4">Profile Not Found</h2>
                        <p className="text-white mb-6">The user profile you're looking for doesn't exist or has been removed.</p>
                        <Button
                            onClick={() => navigate('/')}
                            className="bg-gradient-to-r from-[#00EAFF] to-[#7928CA]"
                        >
                            Return to Home
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // User stats
    const stats = getUserStats();

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground bg-[radial-gradient(circle_at_10%_20%,rgba(121,40,202,0.1)_0%,transparent_30%),radial-gradient(circle_at_90%_80%,rgba(255,51,112,0.1)_0%,transparent_30%)] bg-grid-pattern">
            <TickerBanner />
            <Navbar />

            <main className="flex-grow container max-w-6xl px-4 py-8 mx-auto">
                <div className="grid gap-8 md:grid-cols-3">
                    {/* Sidebar / Profile Card */}
                    <div className="md:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-background-secondary/70 backdrop-blur-sm border border-white/10 rounded-xl p-6 sticky top-20"
                        >
                            <div className="flex flex-col items-center text-center">
                                <Avatar className="w-24 h-24 mb-4 border-2 border-[#7928CA]">
                                    <AvatarImage src={profileData.avatarUrl || ''} />
                                    <AvatarFallback className="bg-[#7928CA]/20 text-[#7928CA] text-2xl">
                                        {profileData.username?.charAt(0).toUpperCase() || 'U'}
                                    </AvatarFallback>
                                </Avatar>

                                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00EAFF] to-[#7928CA] mb-1">
                                    {profileData.username}
                                </h1>

                                {profileData.profession && (
                                    <p className="text-white/80 mb-4">
                                        {profileData.profession}
                                    </p>
                                )}

                                {/* Stats */}
                                <div className="w-full grid grid-cols-2 gap-3 mb-6">
                                    <div className="bg-background-accent/30 rounded-lg p-4 flex flex-col items-center">
                                        <div className="text-[#00EAFF] flex space-x-1 items-center">
                                            <Code className="w-4 h-4" />
                                            <span className="font-bold">{stats.projects}</span>
                                        </div>
                                        <p className="text-xs text-white/60">Projects</p>
                                    </div>
                                    <div className="bg-background-accent/30 rounded-lg p-4 flex flex-col items-center">
                                        <div className="text-[#00EAFF] flex space-x-1 items-center">
                                            <MessageCircle className="w-4 h-4" />
                                            <span className="font-bold">{stats.discussions}</span>
                                        </div>
                                        <p className="text-xs text-white/60">Discussions</p>
                                    </div>
                                    <div className="bg-background-accent/30 rounded-lg p-4 flex flex-col items-center">
                                        <div className="text-[#00EAFF] flex space-x-1 items-center">
                                            <Star className="w-4 h-4" />
                                            <span className="font-bold">{stats.upvotes}</span>
                                        </div>
                                        <p className="text-xs text-white/60">Upvotes</p>
                                    </div>
                                    <div className="bg-background-accent/30 rounded-lg p-4 flex flex-col items-center">
                                        <p className="text-xs text-white/60 text-center">
                                            Joined on {stats.memberSince}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Main content area */}
                    <div className="md:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-6 bg-background-secondary/50 border border-white/10">
                                    <TabsTrigger value="overview" className="data-[state=active]:bg-[#7928CA] data-[state=active]:text-white">
                                        <Code className="mr-2 h-4 w-4" /> Projects
                                    </TabsTrigger>
                                    <TabsTrigger value="discussions" className="data-[state=active]:bg-[#7928CA] data-[state=active]:text-white">
                                        <MessageCircle className="mr-2 h-4 w-4" /> Discussions
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview" className="pt-2">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold flex items-center">
                                            <Code className="mr-2 h-5 w-5 text-[#00EAFF]" /> Projects
                                        </h2>
                                        {isOwnProfile && (
                                            <Link href="/projects/new">
                                                <Button className="bg-gradient-to-r from-[#00EAFF] to-[#7928CA]">
                                                    <Plus className="mr-2 h-4 w-4" /> New Project
                                                </Button>
                                            </Link>
                                        )}
                                    </div>

                                    {isLoadingProjects ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            {[...Array(4)].map((_, i) => (
                                                <div key={i} className="rounded-xl border border-white/10 bg-background-secondary/70 p-5">
                                                    <Skeleton className="h-[180px] w-full rounded-lg mb-4" />
                                                    <Skeleton className="h-6 w-3/4 mb-2" />
                                                    <Skeleton className="h-4 w-full mb-4" />
                                                    <div className="flex space-x-2">
                                                        <Skeleton className="h-6 w-16 rounded-full" />
                                                        <Skeleton className="h-6 w-16 rounded-full" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : userProjects && userProjects.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            {userProjects.map((project) => (
                                                <div key={project.id} className="rounded-xl border border-white/10 bg-background-secondary/70 backdrop-blur-sm overflow-hidden hover:border-[#00EAFF]/30 transition-colors group">
                                                    <div className="relative h-[180px] overflow-hidden">
                                                        {project.coverImageUrl ? (
                                                            <img
                                                                src={project.coverImageUrl}
                                                                alt={project.title}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            />
                                                        ) : (
                                                            <div
                                                                className="w-full h-full flex items-center justify-center bg-cover bg-center"
                                                                style={{ backgroundImage: `url(${defaultProjectBackground})` }}
                                                            >
                                                                <div className="absolute inset-0 bg-gradient-to-br from-[#7928CA]/20 to-[#00EAFF]/20"></div>
                                                                <Code className="w-12 h-12 text-white/40 relative z-10" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="p-5">
                                                        <Link href={`/projects/${project.id}`}>
                                                            <h3 className="text-lg font-semibold text-white group-hover:text-[#00EAFF] transition-colors">
                                                                {project.title}
                                                            </h3>
                                                        </Link>
                                                        <p className="text-sm text-white/60 mt-1 line-clamp-2">{project.description}</p>
                                                        <div className="flex items-center justify-between mt-4">
                                                            <div className="flex items-center space-x-1">
                                                                <Star className="h-4 w-4 text-[#FF3370]" />
                                                                <span className="text-sm text-white/60">{project.upvotes || 0}</span>
                                                            </div>
                                                            <span className="text-xs text-white/40">
                                                                {new Date(project.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-background-secondary/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                                            <div className="flex flex-col items-center">
                                                <Code className="w-12 h-12 text-white/20 mb-4" />
                                                <p className="text-white/60 mb-4">No projects found.</p>
                                                {isOwnProfile && (
                                                    <Link href="/projects/new">
                                                        <Button variant="outline" className="border-[#00EAFF]/30 text-[#00EAFF]">
                                                            <Plus className="mr-2 h-4 w-4" /> Create your first project
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="discussions" className="pt-2">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold flex items-center">
                                            <MessageCircle className="mr-2 h-5 w-5 text-[#00EAFF]" /> Discussions
                                        </h2>
                                        {isOwnProfile && (
                                            <Link href="/discussions/new">
                                                <Button className="bg-gradient-to-r from-[#00EAFF] to-[#7928CA]">
                                                    <Plus className="mr-2 h-4 w-4" /> New Discussion
                                                </Button>
                                            </Link>
                                        )}
                                    </div>

                                    {isLoadingDiscussions ? (
                                        <div className="space-y-4">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="bg-background-secondary/70 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                                                    <Skeleton className="h-7 w-3/4 mb-2" />
                                                    <Skeleton className="h-4 w-full mb-4" />
                                                    <Skeleton className="h-4 w-full mb-2" />
                                                    <Skeleton className="h-4 w-2/3 mb-4" />
                                                    <div className="flex justify-between">
                                                        <Skeleton className="h-5 w-24" />
                                                        <div className="flex space-x-3">
                                                            <Skeleton className="h-5 w-10" />
                                                            <Skeleton className="h-5 w-10" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : userDiscussions && userDiscussions.length > 0 ? (
                                        <div className="space-y-4">
                                            {userDiscussions.map((discussion) => (
                                                <div
                                                    key={discussion.id}
                                                    className="bg-background-secondary/70 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-[#00EAFF]/30 transition-colors"
                                                    style={{ backgroundImage: `url(${defaultDiscussionBackground})` }}
                                                >
                                                    <div className="p-6 backdrop-blur-sm">
                                                        <Link href={`/forum/${discussion.id}`}>
                                                            <h3 className="text-lg font-semibold text-white hover:text-[#00EAFF] transition-colors">
                                                                {discussion.title}
                                                            </h3>
                                                        </Link>
                                                        <p className="text-white/60 mt-2 line-clamp-3">
                                                            {discussion.description}
                                                        </p>
                                                        <div className="flex justify-between items-center mt-4">
                                                            <span className="text-xs text-white/40">
                                                                {new Date(discussion.createdAt).toLocaleDateString()}
                                                            </span>
                                                            <div className="flex items-center space-x-4">
                                                                <div className="flex items-center space-x-1">
                                                                    <MessageCircle className="h-4 w-4 text-[#00EAFF]" />
                                                                    <span className="text-sm text-white/60">{discussion.commentsCount || 0}</span>
                                                                </div>
                                                                <div className="flex items-center space-x-1">
                                                                    <Star className="h-4 w-4 text-[#FF3370]" />
                                                                    <span className="text-sm text-white/60">{discussion.upvotes || 0}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-background-secondary/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                                            <div className="flex flex-col items-center">
                                                <MessageCircle className="w-12 h-12 text-white/20 mb-4" />
                                                <p className="text-white/60 mb-4">No discussions found.</p>
                                                {isOwnProfile && (
                                                    <Link href="/discussions/new">
                                                        <Button variant="outline" className="border-[#00EAFF]/30 text-[#00EAFF]">
                                                            <Plus className="mr-2 h-4 w-4" /> Start your first discussion
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </motion.div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}