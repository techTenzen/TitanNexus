import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Discussion } from '@shared/schema';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Link } from 'wouter';
import { ChevronUp, ChevronDown, MessageSquare, Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DiscussionCardProps {
  discussion: Discussion;
  index: number;
  isDetailView?: boolean;
}

export function DiscussionCard({ discussion, index, isDetailView = false }: DiscussionCardProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  // Fetch the author information
  const { data: author } = useQuery({
    queryKey: [`/api/user/${discussion.userId}`],
    queryFn: async () => {
      const res = await fetch(`/api/user/${discussion.userId}`);
      if (!res.ok) return null;
      return await res.json();
    }
  });
  
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
  
  const upvoteMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/discussions/${discussion.id}/upvote`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/discussions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/discussions/top'] });
      queryClient.invalidateQueries({ queryKey: [`/api/discussions/${discussion.id}`] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to upvote discussion",
        variant: "destructive",
      });
    },
  });

  const handleUpvote = () => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upvote discussions",
        variant: "destructive",
      });
      return;
    }
    
    setIsUpvoting(true);
    upvoteMutation.mutate();
    setTimeout(() => setIsUpvoting(false), 500);
  };
  
  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'feature request':
        return 'bg-green-500/20 text-green-400';
      case 'issue':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-blue-500/20 text-blue-400';
    }
  };
  
  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'bg-yellow-500/20 text-yellow-400';
    
    switch (status.toLowerCase()) {
      case 'done':
        return 'bg-green-500/20 text-green-400';
      case 'rejected':
        return 'bg-red-500/20 text-red-400';
      case 'active':
      default:
        return 'bg-yellow-500/20 text-yellow-400';
    }
  };
  
  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-background-secondary/70 backdrop-blur-sm border border-white/10 rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
    >
      <div className="flex">
        <div className="flex flex-col items-center mr-6">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "text-gray-400 hover:text-[#FF3370]",
              isUpvoting && "animate-pulse"
            )}
            onClick={handleUpvote}
            disabled={upvoteMutation.isPending}
          >
            <ChevronUp className="h-6 w-6" />
          </Button>
          <span className="font-bold my-1">{discussion.upvotes ?? 0}</span>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-[#7928CA]"
            disabled
          >
            <ChevronDown className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex-1">
          <div className="flex items-center mb-2 flex-wrap gap-2">
            <span className={`px-3 py-1 text-xs rounded-full mr-2 ${getTagColor(discussion.tag)}`}>
              {discussion.tag}
            </span>
            <div className="flex items-center mr-2">
              <Avatar className="h-6 w-6 mr-2">
                {author?.avatarUrl ? (
                  <AvatarImage src={author.avatarUrl} alt={author?.username || "User"} />
                ) : (
                  <AvatarFallback className="bg-gray-700 text-xs">
                    {author?.username?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col">
                <span className="text-white font-medium">{author?.username || "Unknown"}</span>
                {author?.profession && (
                  <span className="text-gray-400 text-xs">{author.profession}</span>
                )}
              </div>
            </div>
          </div>
          <Link href={isDetailView ? "#" : `/forum/${discussion.id}`}>
            <div className="block hover:opacity-90 transition-opacity">
              <h3 className="text-xl font-bold mb-2">{discussion.title}</h3>
              <p className="text-gray-400 mb-4 line-clamp-3">{discussion.description}</p>
            </div>
          </Link>
          
          {discussion.imageUrl && (
            <div className="mb-4">
              <img 
                src={discussion.imageUrl} 
                alt="Discussion attachment" 
                className="w-full h-auto max-h-24 object-cover rounded-lg"
              />
            </div>
          )}
          
          <div className="flex items-center text-gray-400 text-sm">
            <div className="flex items-center mr-4">
              <MessageSquare className="w-4 h-4 mr-1" />
              <span>{discussion.commentCount ?? 0} comments</span>
            </div>
            <div className="flex items-center mr-4">
              <Clock className="w-4 h-4 mr-1" />
              <span>{formatDate(discussion.createdAt)}</span>
            </div>
            <div className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(discussion.status)}`}>
              {discussion.status || 'active'}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
