import React from 'react';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Store, Mail, Lock, User, Building } from "lucide-react"

export default function MerchantSignup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create a Merchant Account</CardTitle>
          <CardDescription className="text-center">
            Enter your information below to create your merchant account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <div className="relative">
              <Store className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="businessName" placeholder="Your Business Name" className="pl-8" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="email" placeholder="merchant@example.com" type="email" className="pl-8" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="password" type="password" className="pl-8" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="confirmPassword" type="password" className="pl-8" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactName">Contact Name</Label>
            <div className="relative">
              <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="contactName" placeholder="Your Name" className="pl-8" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessType">Business Type</Label>
            <Select>
              <SelectTrigger id="businessType">
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="wholesale">Wholesale</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="service">Service</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
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
          <Button className="w-full">Create Account</Button>
        </CardFooter>
        <div className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link href="/merchant-login" className="text-primary underline hover:text-primary/90">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  )
}