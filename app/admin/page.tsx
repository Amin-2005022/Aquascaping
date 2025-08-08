'use client'

import { useState, useEffect } from 'react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../..//components/ui/tabs'
import { 
  Package, 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Truck
} from 'lucide-react'

// Mock data for admin dashboard
const mockStats = {
  totalOrders: 156,
  totalRevenue: 48750,
  totalUsers: 1247,
  lowStockItems: 8
}

const mockOrders = [
  {
    id: '1',
    orderNumber: 'AQ-2024-001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    total: 325.99,
    status: 'PENDING',
    createdAt: '2024-01-15T10:30:00Z',
    items: [
      { name: 'Dragon Stone', quantity: 2, price: 25 },
      { name: 'Anubias Nana', quantity: 3, price: 15 }
    ]
  },
  {
    id: '2',
    orderNumber: 'AQ-2024-002',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    total: 599.99,
    status: 'PROCESSING',
    createdAt: '2024-01-14T15:45:00Z',
    items: [
      { name: 'Custom Tank 60x40x35', quantity: 1, price: 450 },
      { name: 'Spider Wood', quantity: 1, price: 40 }
    ]
  }
]

const mockProducts = [
  {
    id: '1',
    name: 'Dragon Stone',
    category: 'Hardscape',
    price: 25,
    stock: 45,
    lowStock: false
  },
  {
    id: '2',
    name: 'Anubias Nana',
    category: 'Plants',
    price: 15,
    stock: 3,
    lowStock: true
  },
  {
    id: '3',
    name: 'Neon Tetra (6pk)',
    category: 'Livestock',
    price: 24,
    stock: 12,
    lowStock: false
  }
]

function Badge({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'secondary' | 'destructive' | 'outline' }) {
  const variants = {
    default: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    destructive: 'bg-destructive text-destructive-foreground',
    outline: 'text-foreground border border-input bg-background'
  }
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}

function StatsCard({ title, value, icon: Icon, trend }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground">
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function OrdersManagement() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'outline'
      case 'CONFIRMED': return 'secondary'
      case 'PROCESSING': return 'default'
      case 'SHIPPED': return 'secondary'
      case 'DELIVERED': return 'secondary'
      case 'CANCELLED': return 'destructive'
      default: return 'outline'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-4 w-4" />
      case 'PROCESSING': return <Package className="h-4 w-4" />
      case 'SHIPPED': return <Truck className="h-4 w-4" />
      case 'DELIVERED': return <CheckCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-4">
      {mockOrders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                <CardDescription>
                  {order.customerName} • {order.customerEmail}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={getStatusColor(order.status)}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1">{order.status}</span>
                </Badge>
                <span className="font-semibold">${order.total}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h4 className="font-medium">Items:</h4>
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.name} × {item.quantity}</span>
                  <span>${item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="flex space-x-2 mt-4">
              <Button size="sm">Mark as Processing</Button>
              <Button size="sm" variant="outline">View Details</Button>
              <Button size="sm" variant="outline">Contact Customer</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function ProductsManagement() {
  return (
    <div className="space-y-4">
      {mockProducts.map((product) => (
        <Card key={product.id}>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.category}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-semibold">${product.price}</p>
                <div className="flex items-center space-x-1">
                  <span className="text-sm">Stock: {product.stock}</span>
                  {product.lowStock && (
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">Edit</Button>
                <Button size="sm" variant="outline">Restock</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button className="w-full">Add New Product</Button>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Orders"
            value={mockStats.totalOrders}
            icon={Package}
            trend="+12% from last month"
          />
          <StatsCard
            title="Revenue"
            value={`$${mockStats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            trend="+8% from last month"
          />
          <StatsCard
            title="Total Users"
            value={mockStats.totalUsers}
            icon={Users}
            trend="+15% from last month"
          />
          <StatsCard
            title="Low Stock Alerts"
            value={mockStats.lowStockItems}
            icon={AlertTriangle}
            trend="Requires attention"
          />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  Manage and track customer orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OrdersManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Product Inventory</CardTitle>
                <CardDescription>
                  Manage products and stock levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProductsManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View and manage user accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">
                  User management interface coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Reports</CardTitle>
                <CardDescription>
                  View detailed analytics and generate reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">
                  Analytics dashboard coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
