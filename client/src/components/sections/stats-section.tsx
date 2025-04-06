import { useQuery } from '@tanstack/react-query';
import { StatsCounter } from '@/components/ui/stats-counter';
import { Skeleton } from '@/components/ui/skeleton';

export function StatsSection() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['/api/stats'],
  });
  
  // Fallback stats in case of error
  const defaultStats = {
    activeUsers: 0,
    projectsCreated: 0,
    communityPosts: 0,
    githubStars: 0
  };
  
  const statData = stats || defaultStats;
  
  return (
    <section className="py-16 bg-background-secondary/80 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-12">Community Stats</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {isLoading ? (
            // Loading skeleton
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="text-center space-y-2">
                <Skeleton className="h-10 w-32 mx-auto mb-2" />
                <Skeleton className="h-5 w-24 mx-auto" />
              </div>
            ))
          ) : error ? (
            // Error state
            <div className="col-span-4 text-center text-red-400">
              Failed to load statistics. Please try again later.
            </div>
          ) : (
            // Stats counters
            <>
              <StatsCounter 
                value={statData.activeUsers} 
                label="Active Users"
                gradientFrom="from-[#FF3370]"
                gradientTo="to-[#7928CA]"
              />
              
              <StatsCounter 
                value={statData.projectsCreated} 
                label="Projects Created"
                gradientFrom="from-[#7928CA]"
                gradientTo="to-[#00EAFF]"
              />
              
              <StatsCounter 
                value={statData.communityPosts} 
                label="Community Posts"
                gradientFrom="from-[#00EAFF]"
                gradientTo="to-[#FF3370]"
              />
              
              <StatsCounter 
                value={statData.githubStars} 
                label="GitHub Stars"
                gradientFrom="from-[#FF3370]"
                gradientTo="to-[#7928CA]"
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
