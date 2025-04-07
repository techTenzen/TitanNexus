import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Project } from '@shared/schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Link } from 'wouter';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  // Check authentication status without useAuth hook
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
  
  const { data: projectCreator, isLoading: isLoadingUser } = useQuery({
    queryKey: [`/api/user/${project.userId}`],
    queryFn: async () => {
      const res = await fetch(`/api/user/${project.userId}`);
      if (!res.ok) return null;
      return await res.json();
    },
    enabled: !!project.userId,
  });
  
  const upvoteMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/projects/${project.id}/upvote`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/projects/top'] });
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${project.id}`] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to upvote project",
        variant: "destructive",
      });
    },
  });
  
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
  
  const getTagColor = (index: number) => {
    const colors = ['bg-[#FF3370]/20 text-[#FF3370]', 'bg-[#7928CA]/20 text-[#7928CA]', 'bg-[#00EAFF]/20 text-[#00EAFF]'];
    return colors[index % colors.length];
  };
  
  // Use the real project creator data or fallback
  const creator = projectCreator || {
    username: `User #${project.userId}`,
    avatarUrl: null
  };
  
  // Safely handle techStack which can be null, string[], or a comma-separated string
  const techStack = Array.isArray(project.techStack) 
    ? project.techStack 
    : (typeof project.techStack === 'string' 
        ? project.techStack.split(',').map(tech => tech.trim()) 
        : []);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-background-secondary/70 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
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
            className={`flex items-center text-gray-400 hover:text-yellow-400 ${isUpvoting ? 'animate-pulse' : ''}`}
            onClick={handleUpvote}
            disabled={upvoteMutation.isPending}
          >
            <Star className="w-4 h-4 mr-1" />
            <span>{project.upvotes ?? 0}</span>
          </Button>
        </div>
        
        <Link href={`/projects/${project.id}`}>
          <a className="block hover:opacity-90 transition-opacity">
            <h3 className="text-xl font-bold mb-2">{project.title}</h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
          </a>
        </Link>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {techStack.map((tech, i) => (
            <span 
              key={i} 
              className={`px-2 py-1 bg-background-tertiary text-xs rounded ${i < 3 ? getTagColor(i) : ''}`}
            >
              {tech}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {isLoadingUser ? (
              <Skeleton className="w-6 h-6 rounded-full mr-2" />
            ) : (
              <img 
                src={creator.avatarUrl} 
                alt="Avatar" 
                className="w-6 h-6 rounded-full mr-2"
                onError={(e) => {
                  e.currentTarget.src = 'https://ui-avatars.com/api/?name=User&background=random';
                }}
              />
            )}
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">{creator.username}</span>
              {creator.profession && (
                <span className="text-xs text-gray-500">{creator.profession}</span>
              )}
            </div>
          </div>
          <Link href={`/projects/${project.id}`}>
            <a className="text-[#00EAFF] hover:text-[#7928CA] text-sm">View Project</a>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
