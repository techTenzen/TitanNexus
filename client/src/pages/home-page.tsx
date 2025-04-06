import { TickerBanner } from '@/components/layout/ticker-banner';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/sections/hero-section';
import { FeaturesSection } from '@/components/sections/features-section';
import { StatsSection } from '@/components/sections/stats-section';
import { DashboardSection } from '@/components/sections/dashboard-section';
import { ProjectsSection } from '@/components/sections/projects-section';
import { DiscussionsSection } from '@/components/sections/discussions-section';
import { DocumentationSection } from '@/components/sections/documentation-section';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground bg-[radial-gradient(circle_at_10%_20%,rgba(121,40,202,0.1)_0%,transparent_30%),radial-gradient(circle_at_90%_80%,rgba(255,51,112,0.1)_0%,transparent_30%)] bg-grid-pattern">
      <TickerBanner />
      <Navbar />
      
      <motion.main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <DashboardSection />
        <ProjectsSection />
        <DiscussionsSection />
        <DocumentationSection />
      </motion.main>
      
      <Footer />
    </div>
  );
}
