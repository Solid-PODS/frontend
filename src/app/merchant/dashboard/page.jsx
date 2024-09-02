"use client";

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ArrowUpRight, Package, DollarSign, ShoppingCart, Users, Search, Plus, Pencil, Trash2, LoaderCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getCurrentMerchant, signOut, getMerchantData, getCategories, updateMerchantData, getMerchantOrders, getMerchantOffers, addMerchantOffer, updateMerchantOffer, deleteMerchantOffer } from '@/lib/auth'


export default function MerchantDashboard() {
  const [offers, setOffers] = useState([
    // { id: 1, category: "Electronics", discount: "10%", startDate: "2023-06-01", endDate: "2023-06-30" },
    // { id: 2, category: "Clothing", discount: "15%", startDate: "2023-06-15", endDate: "2023-07-15" },
    // { id: 3, category: "Home & Garden", discount: "20%", startDate: "2023-07-01", endDate: "2023-07-31" },
  ])

  const salesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 4500 },
    { name: 'May', sales: 6000 },
    { name: 'Jun', sales: 5500 },
  ]

  const recentOrders = [
    { id: '1234', customer: 'John Doe', date: '2023-06-01', total: '$120.00', status: 'Completed' },
    { id: '1235', customer: 'Jane Smith', date: '2023-06-02', total: '$85.50', status: 'Processing' },
    { id: '1236', customer: 'Bob Johnson', date: '2023-06-03', total: '$200.00', status: 'Shipped' },
    { id: '1237', customer: 'Alice Brown', date: '2023-06-04', total: '$75.25', status: 'Completed' },
  ]

  const [categories , setCategories] = useState([])
  const [merchant, setMerchant] = useState(null)
  const [formData, setFormData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const currentMerchant = getCurrentMerchant()
      if (!currentMerchant) {
        router.push('/merchant/login')
      } else {
        setMerchant(currentMerchant)
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [router])

  useEffect(() => {
    if (merchant) {
      const fetchMerchantData = async () => {
        try {
          const merchantData = await getMerchantData()
          setMerchant(merchantData)
        } catch (error) {
          console.error('Error fetching merchant data:', error)
        }
      }
      fetchMerchantData()
    }
  },
  // run once
  [merchant])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories()
        setCategories(categories)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, 
  // run once
  [0])

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const offers = await getMerchantOffers()
        setOffers(offers)
      } catch (error) {
        console.error('Error fetching offers:', error)
      }
    }
    fetchOffers()
  }, 
  // run once
  [0])

  const handleCreateOffer = async (e) => {
    e.preventDefault()
    try {
      if (formData.category_id === "") {
        throw new Error('Category is required')
      }
      if (formData.discount === "") {
        throw new Error('Discount is required')
      }
      if (formData.start_date === "") {
        throw new Error('Start date is required')
      }
      if (formData.end_date === "") {
        throw new Error('End date is required')
      }

      const newOffer = await addMerchantOffer(
        {
          category_id: formData.category_id,
          discount: formData.discount,
          start_date: formData.start_date,
          end_date: formData.end_date,
          merchant_id: merchant.id,
          status: 'active',
        }
      )
      setOffers([...offers, newOffer])
    } catch (error) {
      console.error('Error creating offer:', error)
    }
  }

  const handleDeleteOffer = async (id) => {
    try {
      await deleteMerchantOffer(id)
      setOffers(offers.filter((offer) => offer.id !== id))
    } catch (error) {
      console.error('Error deleting offer:', error)
    }
  }

  const handleUpdateOffer = async (id, data) => {
    try {
      const updatedOffer = await updateMerchantOffer(id, data)
      setOffers(offers.map((offer) => (offer.id === id ? updatedOffer : offer)))
    } catch (error) {
      console.error('Error updating offer:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/merchant/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircle className="animate-spin h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b">
        <div className="flex h-16 items-center px-4">
          <h1 className="text-2xl font-bold">Merchant Dashboard</h1>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="destructive" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Welcome back, {merchant?.contactName || 'Merchant'}.</h2>
          <Button variant="outline" size="sm">
            <ArrowUpRight className="h-4 w-4" />
            Visit Store
          </Button>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="offers">Manage Offers</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231.89</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sales</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+2350</div>
                  <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">456</div>
                  <p className="text-xs text-muted-foreground">+18 new products added</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+573</div>
                  <p className="text-xs text-muted-foreground">+201 from last month</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sales" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>You have {recentOrders.length} new orders today.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Order</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>{order.total}</TableCell>
                          <TableCell className="text-right">{order.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="offers" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Manage Offers</CardTitle>
                  {/* <Dialog>
                    <DialogTrigger>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4" />
                        Add New Offer
                      </Button>
                    </DialogTrigger>
                  </Dialog> */}
                  
                  <Dialog>
                    <DialogTrigger>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4" />
                        Add New Offer
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <form onSubmit={handleCreateOffer}>
                        <CardHeader>
                          <CardTitle>Add New Offer</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <Label htmlFor="category">Category</Label>
                            <Select onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                              <SelectTrigger id="category">
                                <SelectValue placeholder='Select a category'></SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div className="space-y-2">
                              <Label htmlFor="discount">Discount</Label>
                              <Input
                                id="discount"
                                type="text"
                                value={formData.discount}
                                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="start_date">Start Date</Label>
                              <Input
                                id="start_date"
                                type="date"
                                value={formData.start_date}
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="end_date">End Date</Label>
                              <Input
                                id="end_date"
                                type="date"
                                value={formData.end_date}
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                              />
                            </div>
                          </div>
                        </CardContent>
                        <DialogFooter>
                          <Button type="submit">Create Offer</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {offers.map((offer) => (
                      <TableRow key={offer.id}>
                        <TableCell className="font-medium">{categories.find((category) => category.id === offer.category_id)?.name}</TableCell>
                        <TableCell>{offer.discount}</TableCell>
                        <TableCell>{offer.start_date}</TableCell>
                        <TableCell>{offer.end_date}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleUpdateOffer(offer.id)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteOffer(offer.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}