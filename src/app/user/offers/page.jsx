"use client";

import React, { useState, useEffect } from 'react';
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
import { signOut, getCurrentUser, getUserData } from '@/lib/auth'

export default function PersonalizedOffers() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = getCurrentUser()
      if (!currentUser) {
        router.push('/')
      } else {
        setUser(currentUser)
      }
    }
    checkAuth()
  }, [router])

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const userData = await getUserData()
          setUser(userData)
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      }
      fetchUserData()
    }
  }, [user])

  if (!user) {
    return <div>No user found. Please log in.</div>
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
              {[
                { store: "FashionHub", cashback: "10%", image: "/placeholder.svg?height=100&width=100" },
                { store: "TechZone", cashback: "8%", image: "/placeholder.svg?height=100&width=100" },
                { store: "HomeDecor", cashback: "12%", image: "/placeholder.svg?height=100&width=100" },
                { store: "TravelEase", cashback: "5%", image: "/placeholder.svg?height=100&width=100" },
                { store: "FoodieDeals", cashback: "15%", image: "/placeholder.svg?height=100&width=100" },
                { store: "BeautyBliss", cashback: "7%", image: "/placeholder.svg?height=100&width=100" },
              ].map((offer, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage src={offer.image} alt={offer.store} />
                        <AvatarFallback>{offer.store[0]}</AvatarFallback>
                      </Avatar>
                      <span>{offer.store}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-primary">{offer.cashback} Cashback</p>
                    <p className="text-sm text-muted-foreground">on all purchases</p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Shop Now</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}