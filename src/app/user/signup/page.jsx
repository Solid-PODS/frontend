"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link"
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Github, Mail } from "lucide-react"
import { useAuth } from '@/lib/useAuth'; // Import the useAuth hook
import { signUp } from '@/lib/auth'; // Import the signUp function

export default function UserSignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [podIssuer, setPodIssuer] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { authenticated } = useAuth(); // Use the useAuth hook

  useEffect(() => {
    if (authenticated) {
      router.push('/user/profile'); // Redirect to profile if already authenticated
    }
  }, [authenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    if (!agreeTerms) {
      setError("You must agree to the terms of service and privacy policy");
      return;
    }

    if (!podIssuer) {
      setError("You must enter a pod issuer");
      return;
    }
    
    setIsLoading(true);
    try {
      await signUp(email, password, name);
      router.push('/user/login');
    } catch (err) {
      const data = err.response.data
      if ("email" in data) {
        setError(data.email.message);
      } else if ("username" in data) {
        setError(data.username.message);
      } else if ("password" in data) {
        setError(data.password.message);
      } else if ("podIssuer" in data) {
        setError(data.podIssuer.message);
      } else {
        setError(err.message || 'Failed to sign up');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (authenticated) {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Username</label>
              <Input 
                id="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="johnnyappleseed" 
                required 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="m@example.com" 
                required 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="pod-issuer" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Pod Issuer</label>
              <Input
                id="pod-issuer"
                value={podIssuer}
                onChange={(e) => setPodIssuer(e.target.value)}
                placeholder="https://pod.example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Confirm Password</label>
              <Input 
                id="confirm-password" 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked)}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <Link href="#" className="text-primary underline hover:text-primary/90">
                  terms of service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-primary underline hover:text-primary/90">
                  privacy policy
                </Link>
              </label>
            </div>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? 'Signing up...' : 'Sign up'}
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex flex-col space-y-4">
          {/* <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Button variant="outline">
              <Github className="mr-2 h-4 w-4" />
              Github
            </Button>
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div> */}
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link className="underline underline-offset-4 hover:text-primary" href="/user/login">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}