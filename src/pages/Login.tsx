
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { LogIn, UserPlus } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    // In a real app, you would validate against a backend
    // For now, we'll simulate a successful login
    
    // Store user info in localStorage
    localStorage.setItem('user', JSON.stringify({
      email: data.email,
      isLoggedIn: true,
      profileCompleted: false,
    }));

    toast({
      title: isLoginMode ? "Login Successful" : "Registration Successful",
      description: isLoginMode ? "Welcome back!" : "Please complete your profile",
    });

    // Redirect to profile if new user, or home if returning
    navigate(isLoginMode ? '/' : '/profile');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {isLoginMode ? "Login" : "Create Account"}
          </CardTitle>
          <CardDescription className="text-center">
            {isLoginMode 
              ? "Enter your credentials to access your account" 
              : "Sign up to start exploring properties"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full mt-6">
                {isLoginMode ? (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            {isLoginMode ? "Don't have an account?" : "Already have an account?"}
          </div>
          <Button 
            variant="ghost" 
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="w-full"
          >
            {isLoginMode ? "Create Account" : "Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
