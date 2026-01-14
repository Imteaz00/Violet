import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function DashboardPageage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-center">Welcome to Admin dashboard!</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Number of registered users</CardDescription>
            <CardAction>
              <Button variant="link" className="p-0">
                <Link href="/admin/users">View</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-2xl">10</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>Number of active Products</CardDescription>
            <CardAction>
              <Button variant="link" className="p-0">
                <Link href="/admin/products">View</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-2xl">10</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>Number of active Orders</CardDescription>
            <CardAction>
              <Button variant="link" className="p-0">
                <Link href="/admin/orders">View</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-2xl">10</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
