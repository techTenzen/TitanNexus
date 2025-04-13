import { useState, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TickerBanner } from '@/components/layout/ticker-banner';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { DiscussionCard } from '@/components/forum/discussion-card';
import { DiscussionForm } from '@/components/forum/discussion-form';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, MessageCircle, PlusCircle, User, Users } from 'lucide-react';
import { AuthContext } from '@/hooks/use-auth';

export default function ForumPage() {
  // Using useContext directly to avoid crashing if context is missing
  const authContext = useContext(AuthContext);
  const user = authContext?.user || null;

  const [showNewDiscussionForm, setShowNewDiscussionForm] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');

  const {
    data: discussions,
    isLoading,
    error
  } = useQuery({
    queryKey: ['/api/discussions'],
  });

  const { data: users = [] } = useQuery({
    queryKey: ['/api/users'],
    enabled: true // Fetch real users for the community members section
  });

  // Filter discussions based on active tab
  const filteredDiscussions = discussions
      ? discussions.filter(discussion => {
        if (activeTab === 'all') return true;
        return discussion.tag.toLowerCase() === activeTab.toLowerCase();
      })
      : [];

  return (
      <div className="min-h-screen flex flex-col bg-background text-foreground bg-[radial-gradient(circle_at_10%_20%,rgba(121,40,202,0.1)_0%,transparent_30%),radial-gradient(circle_at_90%_80%,rgba(255,51,112,0.1)_0%,transparent_30%)] bg-grid-pattern">
        <TickerBanner />
        <Navbar />

        <main className="flex-grow py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Main Content */}
              <motion.div
                  className="flex-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
              >
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-3xl font-bold">Community Forum</h1>
                  <Button
                      onClick={() => setShowNewDiscussionForm(!showNewDiscussionForm)}
                      className="bg-gradient-to-r from-[#FF3370] to-[#7928CA] hover:opacity-90"
                  >
                    {showNewDiscussionForm ? (
                        <>
                          <MessageCircle className="mr-2 h-4 w-4" /> View Discussions
                        </>
                    ) : (
                        <>
                          <PlusCircle className="mr-2 h-4 w-4" /> New Discussion
                        </>
                    )}
                  </Button>
                </div>

                {/* New Discussion Form */}
                {showNewDiscussionForm ? (
                    <DiscussionForm />
                ) : (
                    <>
                      {/* Tabs for filtering */}
                      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
                        <TabsList className="grid grid-cols-4 mb-8">
                          <TabsTrigger value="all">All Topics</TabsTrigger>
                          <TabsTrigger value="general">General</TabsTrigger>
                          <TabsTrigger value="feature request">Feature Requests</TabsTrigger>
                          <TabsTrigger value="issue">Issues</TabsTrigger>
                        </TabsList>

                        {/* Discussion list */}
                        <TabsContent value={activeTab} className="mt-0">
                          {isLoading ? (
                              <div className="flex justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                              </div>
                          ) : error ? (
                              <div className="text-center py-12 bg-background-secondary/50 rounded-xl">
                                <p className="text-red-400">Failed to load discussions. Please try again later.</p>
                              </div>
                          ) : filteredDiscussions.length === 0 ? (
                              <div className="text-center py-12 bg-background-secondary/50 rounded-xl">
                                <p className="text-gray-400 mb-4">No discussions found in this category.</p>
                                <Button
                                    onClick={() => setShowNewDiscussionForm(true)}
                                    className="bg-gradient-to-r from-[#FF3370] to-[#7928CA]"
                                >
                                  Start a new discussion
                                </Button>
                              </div>
                          ) : (
                              <div className="space-y-6">
                                {filteredDiscussions.map((discussion, index) => (
                                    <DiscussionCard
                                        key={discussion.id}
                                        discussion={discussion}
                                        index={index}
                                    />
                                ))}
                              </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </>
                )}
              </motion.div>

              {/* Sidebar */}
              <motion.div
                  className="md:w-80 space-y-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
              >
                {/* Community stats card */}
                <div className="bg-background-secondary/70 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Users className="mr-2 h-5 w-5 text-[#7928CA]" /> Community Members
                  </h3>

                  <div className="space-y-4">
                    {users && users.length > 0 ? (
                        users.slice(0, 5).map((user, index) => (
                            <div key={user.id} className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                {user.avatarUrl ? (
                                    <AvatarImage src={user.avatarUrl} alt={user.username} />
                                ) : (
                                    <AvatarFallback className="bg-gray-700 text-sm">
                                      {user.username?.charAt(0).toUpperCase() || <User className="h-5 w-5" />}
                                    </AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.username}</p>
                                <p className="text-xs text-gray-400">{user.profession || 'Community Member'}</p>
                              </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-4">
                          <p className="text-sm text-gray-400">Loading community members...</p>
                        </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-sm text-gray-400">
                      {user ?
                          "Join the conversation by starting a new discussion." :
                          "Sign in to join the conversation and create discussions."
                      }
                    </p>
                  </div>
                </div>

                {/* Guidelines card */}
                <div className="bg-background-secondary/70 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                  <h3 className="text-lg font-semibold mb-4">Community Guidelines</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Be respectful and inclusive to all community members</li>
                    <li>• Stay on topic and provide constructive feedback</li>
                    <li>• No spam, solicitation, or self-promotion</li>
                    <li>• Use appropriate tags for your discussions</li>
                    <li>• Report any issues or violations to moderators</li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
  );
}
