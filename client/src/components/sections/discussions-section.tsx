import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { DiscussionCard } from '@/components/forum/discussion-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'wouter';
import { Discussion } from '@shared/schema';

export function DiscussionsSection() {
  const { data: discussions, isLoading, error } = useQuery<Discussion[]>({
    queryKey: ['/api/discussions/top'],
  });

  return (
    <section id="forum" className="py-16 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">Recent Discussions</h2>
          <Link href="/forum">
            <span className="text-[#00EAFF] hover:text-[#7928CA] transition-colors cursor-pointer">
              View All Discussions →
            </span>
          </Link>
        </div>
        
        {isLoading ? (
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
            <p className="text-gray-400">No discussions available yet. Start the first conversation!</p>
            <Link href="/forum">
              <span className="mt-4 inline-block text-[#FF3370] hover:underline cursor-pointer">
                Create a Discussion
              </span>
            </Link>
          </div>
        ) : (
          // Discussions list
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {discussions && discussions.map((discussion: Discussion, index: number) => (
              <DiscussionCard 
                key={discussion.id} 
                discussion={discussion}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
