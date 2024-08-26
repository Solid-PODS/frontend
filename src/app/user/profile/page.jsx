"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Settings, DollarSign, Clock, Lock } from "lucide-react"

export default function Component() {
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

  const toggleAccess = (type, key) => {
    if (type === 'api') {
      setApiAccess(prev => ({ ...prev, [key]: !prev[key] }))
    } else {
      setPodAccess(prev => ({ ...prev, [key]: !prev[key] }))
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Profile picture" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">John Doe</h1>
            <p className="text-muted-foreground">john.doe@example.com</p>
          </div>
        </div>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
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
              <span>1,234.56</span>
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
              {[
                { id: 1, description: "Grocery Store", amount: -75.50, date: "2023-06-15" },
                { id: 2, description: "Salary Deposit", amount: 3000, date: "2023-06-01" },
                { id: 3, description: "Electric Bill", amount: -120.30, date: "2023-05-28" },
              ].map((transaction) => (
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