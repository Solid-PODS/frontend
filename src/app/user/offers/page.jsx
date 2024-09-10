"use client";

import React, { useState, useEffect } from 'react';
import {
  getDefaultSession,
  login,
  handleIncomingRedirect,
} from "@inrupt/solid-client-authn-browser";
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Footer } from "@/components/footer"
import { Search, ShoppingBag, User, Bell, ChevronDown, Mountain } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { signOut, getCurrentUser, getOffersWithDetails, getUserData } from '@/lib/auth'
import { loginSolid, fetchPodData } from '@/lib/PODauth'
import Anthropic from '@anthropic-ai/sdk';

export default function PersonalizedOffers() {
  const [user, setUser] = useState(null);
  const [userPODSessionInfo, setUserPODSessionInfo] = useState(null);
  const [userPOD, setUserPOD] = useState(null);
  const [userRecommendations, setUserRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
  const anthropic = new Anthropic({apiKey: apiKey, dangerouslyAllowBrowser: true});

  // Initial Auth Check
  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
      setIsLoading(false); // Stop loading once the check is complete
    };
    checkAuth();
  }, []);

  // Handle Incoming Redirect after External Login
  useEffect(() => {
    const handleRedirect = () => {
      try {
        handleIncomingRedirect({
          restorePreviousSession: true,
        }).then((info) => {
          console.log('Redirect info:', info);
          console.log(`Logged in with WebID [${info.webId}]`);
          setUserPODSessionInfo(
            info
          );
        })
      } catch (error) {
        console.error('Error handling redirect:', error);
      }
    };
  
    if (!getDefaultSession().info.isLoggedIn) {
      console.log("Checking for incoming redirect...");
      handleRedirect();
    } else {
      console.log("Session already established:", getDefaultSession().info.isLoggedIn);
      console.log("User:", user);
      console.log("User POD Session Info:", userPODSessionInfo);
    }
  }, []);

  // Log in to POD if not already logged in
  useEffect(() => {
    if (user && !getDefaultSession().info.isLoggedIn) {
      const loginToPOD = async () => {
        try {
          // const session = await loginSolid(user.podIssuer || 'https://server1.sgpod.co');
          const session = await login({
            oidcIssuer: user.podIssuer || 'https://server1.sgpod.co',
            redirectUrl: new URL("/user/callback", window.location.origin).href.toString(),
          })
          console.log('Logged in to POD:', session);
        } catch (error) {
          console.error('Error logging in to POD:', error);
        }
      };
      loginToPOD();
    }
  }, [user, userPODSessionInfo]);

  // Fetch POD Data if session is active
  useEffect(() => {
    if (user && !userPOD && getDefaultSession().info.isLoggedIn) {
      if (getDefaultSession().info.webId) {
        const fetchUserPODData = async () => {
          try {
            const userData = await fetchPodData();
            setUserPOD(userData);
            console.log('User POD data:', userData);
          } catch (error) {
            console.error('Error fetching user POD data:', error);
          }
        };
        console.log('Fetching user POD data...');
        fetchUserPODData();
      }
    }
  }, [user, userPOD, userPODSessionInfo]);

  // get user recommendations
  useEffect(() => {
    if (userPOD) { 
      const getUserRecommendations = async () => {
        try {
          const merchantOffers = await getOffersWithDetails()
          // const temp = [
          //     {
          //       "category": "Electronics",
          //       "offerName": "50% Off Air Jordans",
          //       "merchant": "Amazon",
          //       "expiryDate": "2024-09-30"
          //     },
          //     {
          //       "category": "Electronics",
          //       "offerName": "40% Off iPhone Case",
          //       "merchant": "Shopee",
          //       "expiryDate": "2024-09-15"
          //     },
          //     {
          //       "category": "Electronics",
          //       "offerName": "25% Off AirPods",
          //       "merchant": "Apple Store",
          //       "expiryDate": "2024-10-01"
          //     },
          //     {
          //       "category": "Electronics",
          //       "offerName": "30% Off Samsung Galaxy S21",
          //       "merchant": "Samsung Store",
          //       "expiryDate": "2024-09-25"
          //     },
          //     {
          //       "category": "Electronics",
          //       "offerName": "20% Off Nike Shoes",
          //       "merchant": "Nike Store",
          //       "expiryDate": "2024-09-20"
          //     },
          //     {
          //       "category": "Electronics",
          //       "offerName": "15% Off Adidas Apparel",
          //       "merchant": "Adidas Store",
          //       "expiryDate": "2024-09-18"
          //     },
          //     {
          //       "category": "Electronics",
          //       "offerName": "10% Off Sony Headphones",
          //       "merchant": "Sony Store",
          //       "expiryDate": "2024-09-22"
          //     },
          //     {
          //       "category": "Electronics",
          //       "offerName": "5% Off Xiaomi Products",
          //       "merchant": "Xiaomi Store",
          //       "expiryDate": "2024-09-24"
          //     },
          //     {
          //       "category": "Storewide",
          //       "offerName": "Free Shipping on All Orders",
          //       "merchant": "Lazada",
          //       "expiryDate": "2024-09-30"
          //     }
          // ];
          console.log('Merchant offers:', merchantOffers);

          // stringified merchant offers
          const merchantOffersString = JSON.stringify(merchantOffers);
          const userPODString = JSON.stringify(userPOD);
          const recommendations = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20240620',
            max_tokens: 512,
            messages: [
              {
                role : 'user',
                content : `You're a Recommendation AI trained to choose the best offers for a user based on their transaction history. 
                Based on the transaction history:
                ${userPODString}

                Choose the top 6 offers in: 
                ${merchantOffersString}

                Make the offerName more interesting and enticing based on the user's history.

                Output ONLY in JSON format with keys: offerName (string), merchant (string), expiryDate (dd-mm-yyyy).
                Do not include the \n and \t characters in the output.`
              }
            ]
          });
          // console.log('Recommendations:', recommendations);
          var userRecommendations = JSON.parse(recommendations.content[0].text);
          // unpack the recommendations if it is stored in {key: []}
          if (!Array.isArray(userRecommendations)) {
            userRecommendations = Object.values(userRecommendations)[0];
          }

          setUserRecommendations(userRecommendations);
          console.log('User recommendations:', userRecommendations);
        } catch (error) {
          console.error('Error getting user recommendations:', error);
        }
      };
      getUserRecommendations();
    }
  }, [userPOD]);


  if (isLoading) {
    return <div>Loading...</div>; // Prevents rendering before auth check completes
  }

  if (!user) {
    return <div>No user found. Please log in.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold text-primary">
              SaverSpot
            </Link>
            <nav className="hidden md:flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                Home
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                Categories
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                Stores
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                Deals
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Button>
            {/* button to show Profile (Button) when clicked */}
            <Button variant="ghost" className="hidden md:flex items-center space-x-2" onClick={() => router.push('/user/profile')}>
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <section className="bg-muted py-12 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-6">Discover Personalized Offers</h1>
            <div className="max-w-2xl mx-auto relative">
              <Input className="w-full pl-10 pr-4 py-2 rounded-full" placeholder="Search for stores or products" />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="text-sm py-1 px-3">
                Fashion
              </Badge>
              <Badge variant="secondary" className="text-sm py-1 px-3">
                Electronics
              </Badge>
              <Badge variant="secondary" className="text-sm py-1 px-3">
                Home & Living
              </Badge>
              <Badge variant="secondary" className="text-sm py-1 px-3">
                Travel
              </Badge>
              <Badge variant="secondary" className="text-sm py-1 px-3">
                Food & Dining
              </Badge>
            </div>
          </div>
        </section>
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Personalized Offers for {user.username || 'Anonymous User'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userRecommendations && userRecommendations.length > 0 ? userRecommendations.map((offer, index) => (
                <Card key={index}>
                  <CardHeader>
                    <Avatar className="bg-primary">
                      <Mountain className="h-6 w-6" />
                    </Avatar>
                  </CardHeader>
                  <CardContent>
                    <CardTitle>{offer.offerName}</CardTitle>
                    <CardDescription>{offer.merchant}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    <span className="text-sm text-muted-foreground">Expires on {offer.expiryDate}</span>
                  </CardFooter>
                </Card>
              )) : (
                <div className="text-start text-lg text-muted-foreground">No offers available.</div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}