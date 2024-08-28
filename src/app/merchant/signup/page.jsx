"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Store, Mail, Lock, User } from "lucide-react"
import { signUpMerchant, getCurrentMerchant } from '@/lib/auth';

export default function MerchantSignup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [contactName, setContactName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const currentMerchant = getCurrentMerchant();
    if (currentMerchant) {
      router.push('/merchant/dashboard');
    }
  }, [router]);

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
    
    setIsLoading(true);
    try {
      await signUpMerchant(email, password, name.replace(/\s+/g, ''), name, contactName, businessType);
      router.push('/merchant/login');
    } catch (err) {
      console.error('Signup error:', err);
      if (err.data) {
        const data = err.data;
        if (data.email) {
          setError(data.email.message);
        } else if ("username" in data) {
          setError(data.username.message);
        } else if ("password" in data) {
          setError(data.password.message);
        } else if ("contactName" in data) {
          setError(data.contactName.message);
        } else if ("businessName" in data) {
          setError(data.businessName.message);
        } else if ("businessType" in data) {
          setError(data.businessType.message);
        } else {
          setError('Failed to sign up. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create a Merchant Account</CardTitle>
            <CardDescription className="text-center">
              Enter your information below to create your merchant account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <div className="relative">
                <Store className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="businessName" 
                  value={name}
                  placeholder="Your Business Name" 
                  className="pl-8" 
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  value={email}
                  placeholder="merchant@example.com" 
                  type="email" className="pl-8" 
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
                  value={password}
                  type="password" 
                  className="pl-8" 
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="confirmPassword" 
                  value={confirmPassword}
                  className="pl-8" 
                  type="password" 
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name</Label>
              <div className="relative">
                <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="contactName" 
                  className="pl-8"
                  value={contactName} 
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Your Name" 
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type</Label>
              <Select onValueChange={(value) => setBusinessType(value)}>
                <SelectTrigger id="businessType">
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="food">Food & Beverage</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" checked={agreeTerms} onCheckedChange={setAgreeTerms} />
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
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </CardFooter>
        </form>
        <div className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link href="/merchant/login" className="text-primary underline hover:text-primary/90">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  )
}