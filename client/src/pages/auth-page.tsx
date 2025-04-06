import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation } from 'wouter';
import { TickerBanner } from '@/components/layout/ticker-banner';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { motion } from 'framer-motion';
import { apiRequest, queryClient } from '../lib/queryClient';
import { useToast } from '@/hooks/use-toast';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  
  // Check if user is already logged in
  useEffect(() => {
    fetch('/api/user')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Not authenticated');
      })
      .then(user => {
        if (user) navigate('/');
      })
      .catch(() => {
        // User not logged in, show login page
      });
  }, [navigate]);
  
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  const onLogin = async (data: LoginFormValues) => {
    try {
      setIsLoggingIn(true);
      const res = await apiRequest("POST", "/api/login", data);
      const user = await res.json();
      
      // Update auth state
      queryClient.setQueryData(["/api/user"], user);
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.username}!`,
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  const onRegister = async (data: RegisterFormValues) => {
    try {
      setIsRegistering(true);
      const { confirmPassword, ...registerData } = data;
      const res = await apiRequest("POST", "/api/register", registerData);
      const user = await res.json();
      
      // Update auth state
      queryClient.setQueryData(["/api/user"], user);
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      toast({
        title: "Registration successful",
        description: `Welcome to Titan AI, ${user.username}!`,
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground bg-[radial-gradient(circle_at_10%_20%,rgba(121,40,202,0.1)_0%,transparent_30%),radial-gradient(circle_at_90%_80%,rgba(255,51,112,0.1)_0%,transparent_30%)] bg-grid-pattern">
      <TickerBanner />
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col justify-center space-y-4"
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-[#FF3370] to-[#7928CA]">
                  Join the Titan AI Community
                </h1>
                <p className="max-w-[600px] text-gray-400 md:text-xl">
                  Connect with developers, showcase your projects, and contribute to the future of AI-powered development.
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-[#FF3370]/20 rounded-full flex items-center justify-center text-[#FF3370]">1</div>
                  <p className="text-sm text-white">Create an account or sign in to access all features</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-[#7928CA]/20 rounded-full flex items-center justify-center text-[#7928CA]">2</div>
                  <p className="text-sm text-white">Showcase your AI-powered projects and get feedback</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-[#00EAFF]/20 rounded-full flex items-center justify-center text-[#00EAFF]">3</div>
                  <p className="text-sm text-white">Join discussions and collaborate with the community</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-background-secondary/70 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle>Authentication</CardTitle>
                  <CardDescription>
                    Sign in to your account or create a new one
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="login">Login</TabsTrigger>
                      <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="login" className="space-y-4">
                      <Form {...loginForm}>
                        <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                          <FormField
                            control={loginForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                  <Input placeholder="johndoe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={loginForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-[#FF3370] to-[#7928CA]"
                            disabled={isLoggingIn}
                          >
                            {isLoggingIn ? "Signing in..." : "Sign In"}
                          </Button>
                        </form>
                      </Form>
                    </TabsContent>
                    
                    <TabsContent value="register" className="space-y-4">
                      <Form {...registerForm}>
                        <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                          <FormField
                            control={registerForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                  <Input placeholder="johndoe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="john@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-[#FF3370] to-[#7928CA]"
                            disabled={isRegistering}
                          >
                            {isRegistering ? "Creating account..." : "Create Account"}
                          </Button>
                        </form>
                      </Form>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
