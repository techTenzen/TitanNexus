import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';

export function ProjectsSection() {
    const { toast } = useToast();
    const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';

    // State for user auth status
    const [currentUser, setCurrentUser] = useState(null);
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

    // Fetch projects data
    const { data: projects, isLoading, error } = useQuery({
        queryKey: ['/api/projects/top'],
    });

    // Helper functions for project cards
    const getTagColor = (index) => {
        const colors = ['bg-[#FF3370]/20 text-[#FF3370]', 'bg-[#7928CA]/20 text-[#7928CA]', 'bg-[#00EAFF]/20 text-[#00EAFF]'];
        return colors[index % colors.length];
    };

    const handleUpvote = (projectId) => {
        if (!currentUser) {
            toast({
                title: "Authentication required",
                description: "Please sign in to upvote projects",
                variant: "destructive",
            });
            return;
        }

        // Perform upvote
        upvoteMutation.mutate(projectId);
    };

    // Upvote mutation
    const upvoteMutation = useMutation({
        mutationFn: async (projectId) => {
            const res = await apiRequest("POST", `/api/projects/${projectId}/upvote`);
            return await res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
            queryClient.invalidateQueries({ queryKey: ['/api/projects/top'] });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: "Failed to upvote project",
                variant: "destructive",
            });
        },
    });

    return (
        <section id="projects" className="py-16 bg-background-secondary/80 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-50"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-3xl font-bold">Featured Projects</h2>

                    {/* Only show View All if authenticated */}
                    {currentUser && (
                        <Link href="/projects">
                            <span className="text-[#00EAFF] hover:text-[#7928CA] transition-colors cursor-pointer">
                                View All Projects →
                            </span>
                        </Link>
                    )}
                </div>

                {isLoading || isCheckingAuth ? (
                    // Loading skeleton
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-background-secondary/70 rounded-xl p-6 h-[420px]">
                                <Skeleton className="w-full h-48 rounded-lg mb-6" />
                                <Skeleton className="w-1/3 h-6 mb-3" />
                                <Skeleton className="w-full h-4 mb-2" />
                                <Skeleton className="w-full h-4 mb-2" />
                                <Skeleton className="w-2/3 h-4 mb-6" />
                                <div className="flex gap-2 mb-4">
                                    <Skeleton className="w-16 h-6 rounded-full" />
                                    <Skeleton className="w-16 h-6 rounded-full" />
                                </div>
                                <div className="flex justify-between">
                                    <Skeleton className="w-24 h-6" />
                                    <Skeleton className="w-24 h-6" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    // Error state
                    <div className="text-center py-10 bg-background-secondary/50 rounded-xl">
                        <p className="text-red-400">Failed to load projects. Please try again later.</p>
                    </div>
                ) : projects && projects.length === 0 ? (
                    // Empty state
                    <div className="text-center py-10 bg-background-secondary/50 rounded-xl">
                        <p className="text-gray-400">No projects available yet.</p>
                        {currentUser && (
                            <Link href="/projects/create">
                                <span className="mt-4 inline-block text-[#FF3370] hover:underline cursor-pointer">
                                    Create a Project
                                </span>
                            </Link>
                        )}
                    </div>
                ) : (
                    // Projects grid with custom built-in card implementation
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {projects && projects.map((project, index) => {
                            // Parse tech stack consistently
                            const techStack = Array.isArray(project.techStack)
                                ? project.techStack
                                : (typeof project.techStack === 'string'
                                    ? project.techStack.split(',').map(tech => tech.trim())
                                    : []);

                            // Determine if card should be wrapped in Link
                            const ProjectCardContent = (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="bg-background-secondary/70 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden transform transition-all duration-300 hover:shadow-lg"
                                >
                                    <img
                                        src={project.coverImageUrl || DEFAULT_IMAGE}
                                        alt={project.title}
                                        className="w-full h-48 object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = DEFAULT_IMAGE;
                                        }}
                                    />

                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="px-3 py-1 bg-[#7928CA]/20 text-[#7928CA] text-xs rounded-full">
                                                Project
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="flex items-center text-gray-400 hover:text-yellow-400"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUpvote(project.id);
                                                }}
                                                disabled={upvoteMutation.isPending}
                                            >
                                                <Star className="w-4 h-4 mr-1" />
                                                <span>{project.upvotes ?? 0}</span>
                                            </Button>
                                        </div>

                                        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {techStack.slice(0, 3).map((tech, i) => (
                                                <span
                                                    key={i}
                                                    className={`px-2 py-1 bg-background-tertiary text-xs rounded ${getTagColor(i)}`}
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="mb-4">
                                            <span className="text-xs text-gray-400">Category: </span>
                                            <span className="text-xs">{project.category || "AI Development"}</span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <img
                                                    src={project.user?.avatarUrl || 'https://ui-avatars.com/api/?name=User&background=random'}
                                                    alt="Avatar"
                                                    className="w-6 h-6 rounded-full mr-2"
                                                    onError={(e) => {
                                                        e.currentTarget.src = 'https://ui-avatars.com/api/?name=User&background=random';
                                                    }}
                                                />
                                                <span className="text-xs text-gray-400">
                                                    {project.user?.username || `User #${project.userId}`}
                                                </span>
                                            </div>

                                            {/* Only show action links for authenticated users */}
                                            {currentUser && (
                                                project.githubRepo ? (
                                                    <a
                                                        href={project.githubRepo}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[#00EAFF] hover:text-[#7928CA] text-sm"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        Visit Project
                                                    </a>
                                                ) : (
                                                    <span className="text-[#00EAFF] hover:text-[#7928CA] text-sm">
                                                        View Details
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );

                            // Return either wrapped in Link (authenticated) or plain (unauthenticated)
                            return currentUser ? (
                                <Link key={project.id} href={`/projects/${project.id}`}>
                                    <div className="transition-transform hover:scale-105 duration-300 cursor-pointer">
                                        {ProjectCardContent}
                                    </div>
                                </Link>
                            ) : (
                                <div key={project.id} className="transition-transform duration-300">
                                    {ProjectCardContent}
                                </div>
                            );
                        })}
                    </motion.div>
                )}

                {!currentUser && projects && projects.length > 0 && (
                    <div className="mt-8 text-center">
                        <Link href="/auth">
            <span className="text-[#FF3370] underline underline-offset-4 decoration-[#FF3370]/50 hover:decoration-[#FF3370] hover:text-white hover:bg-[#ff337015] transition-all duration-300 cursor-pointer">
                Sign In to View & Create Projects
            </span>
                        </Link>
                    </div>
                )}


            </div>
        </section>
    );
}