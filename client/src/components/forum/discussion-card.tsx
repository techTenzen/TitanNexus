import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { Discussion } from '@shared/schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Link } from 'wouter';
import { ChevronUp, ChevronDown, MessageSquare, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface DiscussionCardProps {
  discussion: Discussion;
  index: number;
  isDetailView?: boolean;
}

export function DiscussionCard({ discussion, index, isDetailView = false }: DiscussionCardProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isUpvoting, setIsUpvoting] = useState(false);
  
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
    if (!user) {
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
          <span className="font-bold my-1">{discussion.upvotes}</span>
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
            <span className="text-gray-400 text-sm">
              Posted {formatDate(discussion.createdAt)}
            </span>
          </div>
          <Link href={isDetailView ? "#" : `/forum/${discussion.id}`}>
            <a className="block hover:opacity-90 transition-opacity">
              <h3 className="text-xl font-bold mb-2">{discussion.title}</h3>
              <p className="text-gray-400 mb-4 line-clamp-3">{discussion.description}</p>
            </a>
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
              <span>{discussion.commentCount} comments</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{discussion.commentCount > 0 ? 'Active' : 'New'}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
