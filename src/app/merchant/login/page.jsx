"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Store, Mail, Lock } from "lucide-react"
import { signInMerchant } from '@/lib/auth';
import { useAuth } from '@/lib/useAuth'; // Import the useAuth hook

export default function MerchantLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, authenticated } = useAuth(); // Use the useAuth hook

  useEffect(() => {
    if (authenticated) {
      router.push('/merchant/dashboard');
    }
  }, [authenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await signInMerchant(email, password);
      router.push('/merchant/dashboard');
    } catch {
      if ("email" in data) {
        setError(data.email.message);
      } else if ("username" in data) {
        setError(data.username.message);
      } else if ("password" in data) {
        setError(data.password.message);
      } else {
        setError(message || 'Failed to sign up');
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
          <CardTitle className="text-2xl font-bold text-center">Sign in to your Merchant Account</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your merchant dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email"
                  className="pl-8"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  className="pl-8"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Remember me
                </label>
              </div>
              <Link href="#" className="text-sm text-primary underline hover:text-primary/90">
                Forgot password?
              </Link>
            </div>
            <Button className="w-full" type="submit">Sign In</Button>
          </CardContent>
        </form>
        <CardFooter className="flex flex-col space-y-4">
          <Button variant="outline" className="w-full">
            <Store className="mr-2 h-4 w-4" />
            Create Account
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}