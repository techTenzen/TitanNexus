import { useQuery } from '@tanstack/react-query';
import { ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';

export function DashboardSection() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/stats'],
  });
  
  // Dashboard stats calculations (growth percents are simulated)
  const dashboardStats = [
    {
      label: 'Total Users',
      value: stats?.activeUsers || 0,
      growth: 18.7,
      color: 'text-green-400'
    },
    {
      label: 'Total Projects',
      value: stats?.projectsCreated || 0,
      growth: 22.3,
      color: 'text-green-400'
    },
    {
      label: 'Total Discussions',
      value: stats?.communityPosts || 0,
      growth: 15.9,
      color: 'text-green-400'
    }
  ];

  return (
    <section className="py-16 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-12">Platform Growth</h2>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-background-secondary/70 backdrop-blur-sm border border-white/10 p-8 rounded-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dashboardStats.map((stat, index) => (
              <div 
                key={index}
                className="flex justify-between items-center p-4 bg-background-tertiary/50 rounded-lg"
              >
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold">
                    {isLoading ? '...' : new Intl.NumberFormat().format(stat.value)}
                  </p>
                </div>
                <div className={`flex items-center ${stat.color}`}>
                  <span className="text-sm font-medium mr-1">+{stat.growth}%</span>
                  <ArrowUp className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
