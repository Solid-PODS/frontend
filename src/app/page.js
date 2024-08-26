import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, User, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8">Welcome to Our Platform</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
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
            <Button asChild variant="link" className="w-full">
              <Link href="/merchant/dashboard">
                View Merchant Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
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
      </div>
    </div>
  );
}