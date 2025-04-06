import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }).max(100),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  techStack: z.array(z.string()).min(1, { message: "Add at least one technology" }),
  coverImageUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

export function ProjectForm() {
  const [_, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [techInput, setTechInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      techStack: [],
      coverImageUrl: "",
    },
  });
  
  const createProjectMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const res = await apiRequest("POST", "/api/projects", values);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your project has been created",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/projects/top'] });
      navigate("/projects");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (values: FormValues) => {
    createProjectMutation.mutate(values);
  };
  
  const addTech = () => {
    if (techInput.trim() === '') return;
    
    const currentTech = form.getValues().techStack || [];
    if (!currentTech.includes(techInput.trim())) {
      form.setValue('techStack', [...currentTech, techInput.trim()]);
    }
    setTechInput('');
  };
  
  const removeTech = (tech: string) => {
    const currentTech = form.getValues().techStack;
    form.setValue('techStack', currentTech.filter(t => t !== tech));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTech();
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImagePreview(url);
    form.setValue("coverImageUrl", url);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background-secondary/70 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8"
    >
      <h2 className="text-2xl font-bold mb-6">Submit Your Project</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Title</FormLabel>
                <FormControl>
                  <Input placeholder="My Amazing AI Project" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your project..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="techStack"
            render={() => (
              <FormItem>
                <FormLabel>Tech Stack</FormLabel>
                <div className="flex gap-2 mb-2">
                  <Input 
                    placeholder="Add technologies (e.g. React, Python, TensorFlow)"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-grow"
                  />
                  <Button 
                    type="button" 
                    onClick={addTech}
                    variant="secondary"
                  >
                    Add
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.watch('techStack')?.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="px-2 py-1 gap-1">
                      {tech}
                      <button 
                        type="button" 
                        onClick={() => removeTech(tech)}
                        className="ml-1 rounded-full hover:bg-background-tertiary p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="coverImageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Image URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://example.com/image.jpg"
                    onChange={handleImageChange}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {imagePreview && (
            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2">Image Preview:</p>
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="max-h-40 w-auto rounded-md"
                onError={() => setImagePreview(null)}
              />
            </div>
          )}
          
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#FF3370] to-[#7928CA]"
              disabled={createProjectMutation.isPending}
            >
              {createProjectMutation.isPending ? "Submitting..." : "Submit Project"}
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
