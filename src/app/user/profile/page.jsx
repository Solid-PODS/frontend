"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { House, DollarSign, Lock, LogOut, Mail, LoaderCircle } from "lucide-react"
import { signOut, getCurrentUser, getUserData } from '@/lib/auth'
import { toast } from '@/components/ui/use-toast'

export default function ProtectedUserProfile() {
  const [apiAccess, setApiAccess] = useState({
    financial: false,
    social: false,
    health: false,
  })
  const [podAccess, setPodAccess] = useState({
    photos: false,
    documents: false,
    contacts: false,
  })
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = getCurrentUser()
      if (!currentUser) {
        router.push('/')
      } else {
        setUser(currentUser)
        // Here you would typically fetch the user's specific data
        // For example: apiAccess, podAccess, transaction history, etc.
        // For now, we'll use placeholder data
        setApiAccess({
          financial: currentUser.financialAccess || false,
          social: currentUser.socialAccess || false,
          health: currentUser.healthAccess || false,
        })
        setPodAccess({
          photos: currentUser.photosAccess || false,
          documents: currentUser.documentsAccess || false,
          contacts: currentUser.contactsAccess || false,
        })
      }
      setIsLoading(false)
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
          toast({
            title: "Error",
            description: "Failed to fetch user data. Please try again.",
            variant: "destructive",
          })
        }
      }
      fetchUserData()
    }
  }, [user])

  const toggleAccess = (type, key) => {
    if (type === 'api') {
      setApiAccess(prev => ({ ...prev, [key]: !prev[key] }))
    } else {
      setPodAccess(prev => ({ ...prev, [key]: !prev[key] }))
    }
    // Here you would typically update this change in your backend
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/') // Redirect to home page after signing out
    } catch (error) {
      console.error('Error signing out:', error)
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircle className="animate-spin h-8 w-8" />
      </div>
    )
  }

  if (!user) {
    return <div>No user found. Please log in.</div>
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar || "/placeholder.svg?height=80&width=80"} alt="Profile picture" />
            <AvatarFallback>{user.username ? user.username.substring(0, 2).toUpperCase() : 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{user.username || 'Anonymous User'}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="space-x-2">
          {/* <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button> */}
          <Button variant="outline" onClick={() => router.push('/user/offers')}>
            <House className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Button variant="destructive" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Amount Saved</CardTitle>
            <CardDescription>Your total savings this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 text-4xl font-bold">
              <DollarSign className="h-8 w-8 text-green-500" />
              <span>{user.totalSavings ? user.totalSavings.toFixed(2) : '0.00'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Your recent transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {(user.transactions || []).map((transaction) => (
                <li key={transaction.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">{transaction.date}</p>
                  </div>
                  <Badge variant={transaction.amount > 0 ? "default" : "secondary"}>
                    ${Math.abs(transaction.amount).toFixed(2)}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Access Management</CardTitle>
          <CardDescription>Control access to your data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">API Access</h3>
              <div className="space-y-2">
                {Object.entries(apiAccess).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Lock className="h-4 w-4" />
                      <span className="capitalize">{key} API</span>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={() => toggleAccess('api', key)}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Pod Access</h3>
              <div className="space-y-2">
                {Object.entries(podAccess).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Lock className="h-4 w-4" />
                      <span className="capitalize">{key} Pod</span>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={() => toggleAccess('pod', key)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}