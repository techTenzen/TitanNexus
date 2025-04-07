import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { motion } from 'framer-motion';
import { Project } from '@shared/schema';
import { Star, ArrowLeft, ExternalLink, Github, Download, Share2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';

export default function ProjectDetailPage() {
    const [_, params] = useRoute('/projects/:id');
    const projectId = params?.id ? parseInt(params.id) : 0;
    const { toast } = useToast();
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isUpvoting, setIsUpvoting] = useState(false);
    const queryClient = useQueryClient();

    // Check authentication status
    useEffect(() => {
        fetch('/api/user')
            .then(res => {
                if (res.ok) return res.json();
                throw new Error('Not authenticated');
            })
            .then(user => {
                setCurrentUser(user);
            })
            .catch(() => {
                setCurrentUser(null);
            });
    }, []);

    const { data: project, isLoading: isLoadingProject } = useQuery({
        queryKey: [`/api/projects/${projectId}`],
        queryFn: async () => {
            const res = await fetch(`/api/projects/${projectId}`);
            if (!res.ok) {
                throw new Error('Failed to fetch project');
            }
            return res.json();
        },
        enabled: !!projectId,
    });

    const { data: projectCreator, isLoading: isLoadingUser } = useQuery({
        queryKey: [`/api/user/${project?.userId}`],
        queryFn: async () => {
            const res = await fetch(`/api/user/${project.userId}`);
            if (!res.ok) return null;
            return await res.json();
        },
        enabled: !!project?.userId,
    });

    // Add upvote mutation
    const upvoteMutation = useMutation({
        mutationFn: async () => {
            const res = await apiRequest("POST", `/api/projects/${projectId}/upvote`);
            return await res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
            queryClient.invalidateQueries({ queryKey: ['/api/projects/top'] });
            queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}`] });
            toast({
                title: "Success",
                description: "Project upvoted!",
            });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: "Failed to upvote project",
                variant: "destructive",
            });
        },
    });

    // Handle upvote
    const handleUpvote = () => {
        if (!currentUser) {
            toast({
                title: "Authentication required",
                description: "Please sign in to upvote projects",
                variant: "destructive",
            });
            return;
        }

        setIsUpvoting(true);
        upvoteMutation.mutate();
        setTimeout(() => setIsUpvoting(false), 500);
    };

    // Handle visit project
    const handleVisitProject = () => {
        if (project?.githubRepo) {
            window.open(project.githubRepo, '_blank');
        } else {
            toast({
                title: "No link available",
                description: "This project doesn't have a GitHub repository link",
                variant: "destructive",
            });
        }
    };

    // Safely handle techStack which can be null, string[], or a comma-separated string
    const techStack = project && project.techStack ? (
        Array.isArray(project.techStack)
            ? project.techStack
            : (typeof project.techStack === 'string'
                ? project.techStack.split(',').map(tech => tech.trim())
                : [])
    ) : [];

    const getTagColor = (index: number) => {
        const colors = ['bg-[#FF3370]/20 text-[#FF3370]', 'bg-[#7928CA]/20 text-[#7928CA]', 'bg-[#00EAFF]/20 text-[#00EAFF]'];
        return colors[index % colors.length];
    };

    // If it's loading, show a skeleton UI
    if (isLoadingProject) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center mb-6">
                        <Skeleton className="h-8 w-40 mr-4" />
                    </div>
                    <Skeleton className="h-80 w-full mb-8 rounded-xl" />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <Skeleton className="h-10 w-3/4 mb-4" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-3/4 mb-6" />
                            <div className="flex flex-wrap gap-2 mb-6">
                                <Skeleton className="h-6 w-16" />
                                <Skeleton className="h-6 w-16" />
                                <Skeleton className="h-6 w-16" />
                            </div>
                        </div>
                        <div>
                            <Skeleton className="h-40 w-full mb-4 rounded-xl" />
                            <Skeleton className="h-6 w-full mb-2" />
                            <Skeleton className="h-6 w-full mb-2" />
                            <Skeleton className="h-6 w-full mb-2" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // If project not found
    if (!project) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
                    <p className="text-gray-400 mb-6">The project you're looking for doesn't exist or has been removed.</p>
                    <Link href="/projects">
                        <Button>Back to Projects</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen pb-16"
        >
            {/* Hero banner with project image */}
            <div
                className="w-full h-72 md:h-96 relative bg-background-secondary/40"
                style={{
                    backgroundImage: `url(${project.coverImageUrl || DEFAULT_IMAGE})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm">
                    <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-6">
                        <div className="max-w-5xl">
                            <div className="flex flex-wrap items-center gap-2 mb-2 text-white/70">
                                <Link href="/projects">
                                    <a className="flex items-center hover:text-white transition-colors">
                                        <ArrowLeft className="w-4 h-4 mr-1" />
                                        <span>Back to Projects</span>
                                    </a>
                                </Link>
                                <span className="text-white/40 mx-2">•</span>
                                <span className="bg-[#7928CA]/30 text-[#d9a9ff] px-3 py-1 rounded-full text-xs">
                  Project
                </span>
                                <span className="text-white/40 mx-2">•</span>
                                <span className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-400" />
                  <span>{project.upvotes || 0} upvotes</span>
                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
                                {project.title}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Project content */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main content */}
                        <div className="lg:col-span-2">
                            <Tabs defaultValue="overview" className="mb-8">
                                <TabsList className="mb-4">
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="documentation">Documentation</TabsTrigger>
                                    <TabsTrigger value="code">Code</TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview" className="space-y-6">
                                    <div className="bg-background-secondary/30 rounded-xl p-6 space-y-6">
                                        <h2 className="text-2xl font-semibold text-white">Description</h2>
                                        <div className="text-gray-300 leading-relaxed space-y-4">
                                            <p>{project.description}</p>
                                        </div>

                                        <div className="pt-4">
                                            <h3 className="text-lg font-medium mb-3">Technologies Used</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {techStack.map((tech, i) => (
                                                    <span
                                                        key={i}
                                                        className={`px-3 py-1 rounded-full text-sm ${getTagColor(i)}`}
                                                    >
                            {tech}
                          </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="documentation">
                                    <div className="bg-background-secondary/30 rounded-xl p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-2xl font-semibold text-white">Documentation</h2>
                                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                                <BookOpen className="w-4 h-4" />
                                                <span>Full Docs</span>
                                            </Button>
                                        </div>

                                        <div className="prose prose-invert max-w-none">
                                            <h3>Getting Started</h3>
                                            <p>To get started with this project, follow these installation steps:</p>
                                            <pre className="bg-black/30 p-4 rounded-md overflow-x-auto">
                        <code>npm install @titan-ai/core</code>
                      </pre>

                                            <h3 className="mt-6">Basic Usage</h3>
                                            <p>Here's a basic example of how to use the main features:</p>
                                            <pre className="bg-black/30 p-4 rounded-md overflow-x-auto">
                        <code>{`
import { TitanAI } from '@titan-ai/core';

const titan = new TitanAI({
  model: 'gpt-4'
});

const result = await titan.execute({
  prompt: 'Create a React button component'
});

console.log(result.code);
                        `}</code>
                      </pre>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="code">
                                    <div className="bg-background-secondary/30 rounded-xl p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-2xl font-semibold text-white">Source Code</h2>
                                            <div className="flex gap-2">
                                                {project.githubRepo && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex items-center gap-2"
                                                        onClick={() => window.open(project.githubRepo, '_blank')}
                                                    >
                                                        <Github className="w-4 h-4" />
                                                        <span>Repository</span>
                                                    </Button>
                                                )}
                                                <Button variant="outline" size="sm" className="flex items-center gap-2">
                                                    <Download className="w-4 h-4" />
                                                    <span>Download</span>
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="prose prose-invert max-w-none">
                      <pre className="bg-black/30 p-4 rounded-md overflow-x-auto">
                        <code>{`
import { useState } from 'react';

function TitanComponent() {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleProcess = async () => {
    setIsProcessing(true);
    try {
      // Implementation details
      console.log('Processing with Titan AI...');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="titan-container">
      <h2>Titan AI Processor</h2>
      <button 
        onClick={handleProcess}
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Start Processing'}
      </button>
    </div>
  );
}

export default TitanComponent;
                        `}</code>
                      </pre>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>

                        {/* Sidebar */}
                        <div>
                            {/* Creator info */}
                            <div className="bg-background-secondary/30 rounded-xl p-6 mb-6">
                                <h3 className="text-lg font-semibold mb-4">Project Creator</h3>
                                {isLoadingUser ? (
                                    <div className="flex items-center">
                                        <Skeleton className="w-12 h-12 rounded-full mr-3" />
                                        <div>
                                            <Skeleton className="h-4 w-32 mb-1" />
                                            <Skeleton className="h-3 w-24" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <img
                                            src={projectCreator?.avatarUrl || "https://ui-avatars.com/api/?name=User&background=random"}
                                            alt={projectCreator?.username || "Creator"}
                                            className="w-12 h-12 rounded-full mr-3 object-cover bg-background-tertiary"
                                            onError={(e) => {
                                                e.currentTarget.src = "https://ui-avatars.com/api/?name=User&background=random";
                                            }}
                                        />
                                        <div>
                                            <p className="font-medium text-white">{projectCreator?.username || "Anonymous"}</p>
                                            <p className="text-sm text-gray-400">{projectCreator?.profession || "Developer"}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Project actions */}
                            <div className="bg-background-secondary/30 rounded-xl p-6 mb-6">
                                <h3 className="text-lg font-semibold mb-4">Actions</h3>
                                <div className="space-y-3">
                                    <Button
                                        variant="default"
                                        className={`w-full flex items-center justify-center gap-2 ${isUpvoting ? 'animate-pulse' : ''}`}
                                        onClick={handleUpvote}
                                        disabled={!currentUser || upvoteMutation.isPending}
                                    >
                                        <Star className="w-4 h-4" />
                                        <span>Upvote Project</span>
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="w-full flex items-center justify-center gap-2"
                                        onClick={handleVisitProject}
                                        disabled={!project.githubRepo}
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        <span>Visit Project</span>
                                    </Button>
                                </div>
                                {!currentUser && (
                                    <p className="text-xs text-gray-400 mt-3 text-center">
                                        You need to be logged in to upvote this project
                                    </p>
                                )}
                                {!project.githubRepo && (
                                    <p className="text-xs text-gray-400 mt-3 text-center">
                                        This project doesn't have a GitHub repository link
                                    </p>
                                )}
                            </div>

                            {/* Project details */}
                            <div className="bg-background-secondary/30 rounded-xl p-6">
                                <h3 className="text-lg font-semibold mb-4">Project Details</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Created</span>
                                        <span className="text-white">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Category</span>
                                        <span className="text-white">{project.category || "AI Development"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">License</span>
                                        <span className="text-white">MIT</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Version</span>
                                        <span className="text-white">1.0.0</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}