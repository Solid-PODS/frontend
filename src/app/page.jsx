"use client"

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, User, ArrowRight, CheckCircle, ShoppingBag, TrendingUp } from "lucide-react";
import { motion, useScroll, useTransform } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <Card>
    <CardHeader>
      <Icon className="h-8 w-8 mb-2 text-primary" />
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription>{description}</CardDescription>
    </CardContent>
  </Card>
);

export default function Home() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  useEffect(() => {
    document.body.style.overflowY = 'auto';
    document.body.style.overflowX = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        ref={targetRef}
        style={{ opacity, scale }}
        className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary/20 to-background text-center p-4"
      >
        <motion.h1 
          className="text-6xl sm:text-7xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to Our Platform
        </motion.h1>
        <motion.p 
          className="text-2xl mb-8 text-muted-foreground max-w-2xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Connecting merchants and shoppers in a seamless marketplace experience
        </motion.p>
        <motion.div 
          className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/user/signup">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
            <Link href="#features">Learn More</Link>
          </Button>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={ShoppingBag} 
            title="Easy Shopping" 
            description="Browse and purchase from a wide range of products with ease."
          />
          <FeatureCard 
            icon={Store} 
            title="Merchant Tools" 
            description="Powerful tools for merchants to manage their business and offers."
          />
          <FeatureCard 
            icon={TrendingUp} 
            title="Insights" 
            description="Get valuable insights and analytics to grow your business or shop smarter."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Join our platform today and experience the difference!</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Link href="/merchant/signup">Become a Merchant</Link>
            </Button>
            <Button asChild size="lg" variant="" className="text-lg px-8 py-6 bg-emerald-500 hover:bg-emerald-600">
              <Link href="/user/signup">Sign Up as User</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Choose Your Path</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">For Merchants</CardTitle>
                <CardDescription>Manage your business and offers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full">
                  <Link href="/merchant/login">
                    <Store className="mr-2 h-4 w-4" />
                    Merchant Login
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/merchant/signup">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Create Merchant Account
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">For Users</CardTitle>
                <CardDescription>Shop and explore offers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full">
                  <Link href="/user/login">
                    <User className="mr-2 h-4 w-4" />
                    User Login
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/user/signup">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Create User Account
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Our Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}