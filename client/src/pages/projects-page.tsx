import { useState, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TickerBanner } from '@/components/layout/ticker-banner';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ProjectCard } from '@/components/projects/project-card';
import { ProjectForm } from '@/components/projects/project-form';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, PlusCircle } from 'lucide-react';
import { AuthContext } from '@/hooks/use-auth';

export default function ProjectsPage() {
  // Using useContext directly to avoid crashing if context is missing
  const authContext = useContext(AuthContext);
  const user = authContext?.user || null;
  
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('upvotes');

  const { 
    data: projects, 
    isLoading,
    error
  } = useQuery({
    queryKey: ['/api/projects'],
  });

  // Filter and sort projects
  const filteredProjects = projects 
    ? projects
        .filter(project => 
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (project.techStack && project.techStack.some((tech: string) => 
            tech.toLowerCase().includes(searchTerm.toLowerCase())
          ))
        )
        .sort((a, b) => {
          if (sortOption === 'upvotes') return b.upvotes - a.upvotes;
          if (sortOption === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          return 0;
        })
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground bg-[radial-gradient(circle_at_10%_20%,rgba(121,40,202,0.1)_0%,transparent_30%),radial-gradient(circle_at_90%_80%,rgba(255,51,112,0.1)_0%,transparent_30%)] bg-grid-pattern">
      <TickerBanner />
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Project Showcase</h1>
            <Button
              onClick={() => setShowNewProjectForm(!showNewProjectForm)}
              className="bg-gradient-to-r from-[#FF3370] to-[#7928CA] hover:opacity-90"
            >
              {showNewProjectForm ? (
                <span>View Projects</span>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" /> Submit Project
                </>
              )}
            </Button>
          </div>

          {showNewProjectForm ? (
            <ProjectForm />
          ) : (
            <>
              {/* Search and filter controls */}
              <motion.div 
                className="flex flex-col md:flex-row gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex-1">
                  <Input 
                    placeholder="Search projects by title, description or tech stack..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-background-secondary/70 border-white/10"
                  />
                </div>
                <div className="w-full md:w-48">
                  <Select defaultValue={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger className="bg-background-secondary/70 border-white/10">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upvotes">Most Upvoted</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>

              {/* Projects grid */}
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="text-center py-12 bg-background-secondary/50 rounded-xl">
                  <p className="text-red-400">Failed to load projects. Please try again later.</p>
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="text-center py-12 bg-background-secondary/50 rounded-xl">
                  <p className="text-gray-400 mb-4">
                    {searchTerm 
                      ? "No projects found matching your search." 
                      : "No projects available yet. Be the first to create one!"}
                  </p>
                  {user && (
                    <Button
                      onClick={() => setShowNewProjectForm(true)}
                      className="bg-gradient-to-r from-[#FF3370] to-[#7928CA]"
                    >
                      Submit Your Project
                    </Button>
                  )}
                </div>
              ) : (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {filteredProjects.map((project, index) => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      index={index}
                    />
                  ))}
                </motion.div>
              )}

              {/* Project showcase info */}
              <motion.div 
                className="mt-12 p-6 bg-background-secondary/70 backdrop-blur-sm border border-white/10 rounded-xl text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h2 className="text-xl font-bold mb-4">Showcase Your Titan AI Project</h2>
                <p className="text-gray-400 max-w-3xl mx-auto mb-6">
                  Built something amazing with Titan AI? Share it with the community to get feedback, recognition, and inspire others.
                  Projects with the most upvotes will be featured on the homepage.
                </p>
                {user ? (
                  <Button
                    onClick={() => setShowNewProjectForm(true)}
                    className="bg-gradient-to-r from-[#FF3370] to-[#7928CA]"
                  >
                    Submit Your Project
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-gray-400">You need to be signed in to submit a project.</p>
                    <Button
                      onClick={() => window.location.href = '/auth'}
                      className="bg-gradient-to-r from-[#FF3370] to-[#7928CA]"
                    >
                      Sign In to Submit
                    </Button>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
