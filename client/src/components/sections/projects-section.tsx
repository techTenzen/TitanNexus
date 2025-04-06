import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ProjectCard } from '@/components/projects/project-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'wouter';
import { Project } from '@shared/schema';

export function ProjectsSection() {
  const { data: projects, isLoading, error } = useQuery<Project[]>({
    queryKey: ['/api/projects/top'],
  });

  return (
    <section id="projects" className="py-16 bg-background-secondary/80 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">Featured Projects</h2>
          <Link href="/projects">
            <span className="text-[#00EAFF] hover:text-[#7928CA] transition-colors cursor-pointer">
              View All Projects →
            </span>
          </Link>
        </div>
        
        {isLoading ? (
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
            <p className="text-gray-400">No projects available yet. Be the first to create one!</p>
            <Link href="/projects">
              <span className="mt-4 inline-block text-[#FF3370] hover:underline cursor-pointer">
                Create a Project
              </span>
            </Link>
          </div>
        ) : (
          // Projects grid
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {projects && projects.map((project: Project, index: number) => (
              <ProjectCard 
                key={project.id} 
                project={project}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
