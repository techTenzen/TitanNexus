import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { TickerBanner } from '@/components/layout/ticker-banner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Discussion, Comment } from '@shared/schema';
import { DiscussionCard } from '@/components/forum/discussion-card';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function DiscussionDetailPage() {
  const [_, setLocation] = useLocation();
  const [match, params] = useRoute<{ id: string }>('/forum/:id');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const discussionId = match ? parseInt(params.id) : null;
  
  // Comment submission mutation
  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!discussionId) throw new Error("Discussion ID is required");
      const res = await apiRequest("POST", `/api/discussions/${discussionId}/comments`, { 
        content 
      });
      return await res.json();
    },
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: [`/api/discussions/${discussionId}/comments`] });
      queryClient.invalidateQueries({ queryKey: [`/api/discussions/${discussionId}`] });
      toast({
        title: "Comment posted",
        description: "Your comment has been posted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to post comment: ${error.message}`,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmittingComment(false);
    }
  });
  
  // Fetch user info for auth checks
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
  
  const { data: discussion, isLoading, error } = useQuery<Discussion>({
    queryKey: [`/api/discussions/${discussionId}`],
    enabled: !!discussionId
  });
  
  // Fetch comments
  const { data: comments = [] } = useQuery<Comment[]>({
    queryKey: [`/api/discussions/${discussionId}/comments`],
    enabled: !!discussionId
  });
  
  if (!match) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground bg-[radial-gradient(circle_at_10%_20%,rgba(121,40,202,0.1)_0%,transparent_30%),radial-gradient(circle_at_90%_80%,rgba(255,51,112,0.1)_0%,transparent_30%)] bg-grid-pattern">
        <TickerBanner />
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">404 - Discussion Not Found</h1>
            <p className="text-gray-400 mb-6">The discussion you're looking for doesn't exist.</p>
            <Button onClick={() => setLocation('/forum')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Forum
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground bg-[radial-gradient(circle_at_10%_20%,rgba(121,40,202,0.1)_0%,transparent_30%),radial-gradient(circle_at_90%_80%,rgba(255,51,112,0.1)_0%,transparent_30%)] bg-grid-pattern">
        <TickerBanner />
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-[#7928CA]" />
            <p className="text-xl">Loading discussion...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error || !discussion) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground bg-[radial-gradient(circle_at_10%_20%,rgba(121,40,202,0.1)_0%,transparent_30%),radial-gradient(circle_at_90%_80%,rgba(255,51,112,0.1)_0%,transparent_30%)] bg-grid-pattern">
        <TickerBanner />
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Error</h1>
            <p className="text-gray-400 mb-6">Failed to load discussion details.</p>
            <Button onClick={() => setLocation('/forum')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Forum
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground bg-[radial-gradient(circle_at_10%_20%,rgba(121,40,202,0.1)_0%,transparent_30%),radial-gradient(circle_at_90%_80%,rgba(255,51,112,0.1)_0%,transparent_30%)] bg-grid-pattern">
      <TickerBanner />
      <Navbar />
      
      <main className="flex-grow container max-w-6xl px-4 py-12 mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/forum')}
            className="mb-6 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Forum
          </Button>
          
          <DiscussionCard 
            discussion={discussion} 
            index={0} 
            isDetailView={true} 
          />
        </div>
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>
          
          {comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment: Comment, index: number) => (
                <div 
                  key={comment.id}
                  className="bg-background-secondary/70 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-[#7928CA]/20 flex items-center justify-center">
                      <span className="text-lg font-bold text-[#7928CA]">U</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">User #{comment.userId}</span>
                        <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-gray-300">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-background-secondary/30 rounded-xl border border-white/5">
              <p className="text-gray-400">No comments yet. Be the first to comment!</p>
            </div>
          )}
          
          {currentUser && (
            <div className="mt-8 bg-background-secondary/70 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Add a Comment</h3>
              <textarea 
                className="w-full bg-background-tertiary/50 border border-white/10 rounded-lg p-4 min-h-[100px] mb-4 focus:ring-2 focus:ring-[#7928CA] focus:outline-none text-white"
                placeholder="Write your comment here..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={commentMutation.isPending}
                style={{ color: 'white' }} // Ensure text is white for visibility
              />
              <Button 
                className="bg-gradient-to-r from-[#FF3370] to-[#7928CA] hover:opacity-90 transition-opacity"
                onClick={() => {
                  if (!commentText.trim()) {
                    toast({
                      title: "Empty comment",
                      description: "Please enter a comment before submitting",
                      variant: "destructive",
                    });
                    return;
                  }
                  
                  setIsSubmittingComment(true);
                  commentMutation.mutate(commentText.trim());
                }}
                disabled={commentMutation.isPending || !commentText.trim()}
              >
                {commentMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : "Post Comment"}
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}