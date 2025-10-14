import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, Home, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useQueries } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Client, Property, Transaction, Contract } from '@shared/types';
import { Skeleton } from '@/components/ui/skeleton';
type PaginatedData<T> = { items: T[]; next: string | null; };
const KpiCardSkeleton = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-4 w-2/5" />
      <Skeleton className="h-5 w-5" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-3 w-3/5 mt-2" />
    </CardContent>
  </Card>
);
const ChartSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
    </CardHeader>
    <CardContent>
      <Skeleton className="w-full h-[300px]" />
    </CardContent>
  </Card>
);
export function HomePage() {
  const [transactionsQuery, clientsQuery, propertiesQuery, contractsQuery] = useQueries({
    queries: [
      { queryKey: ['transactions'], queryFn: () => api<PaginatedData<Transaction>>('/api/transactions?limit=1000') },
      { queryKey: ['clients'], queryFn: () => api<PaginatedData<Client>>('/api/clients?limit=1000') },
      { queryKey: ['properties'], queryFn: () => api<PaginatedData<Property>>('/api/properties?limit=1000') },
      { queryKey: ['contracts'], queryFn: () => api<PaginatedData<Contract>>('/api/contracts?limit=1000') },
    ],
  });

  const isLoading = [transactionsQuery, clientsQuery, propertiesQuery, contractsQuery].some(q => q.isLoading);

  const transactions = React.useMemo(() => transactionsQuery.data?.items || [], [transactionsQuery.data]);
  const clients = React.useMemo(() => clientsQuery.data?.items || [], [clientsQuery.data]);
  const properties = React.useMemo(() => propertiesQuery.data?.items || [], [propertiesQuery.data]);
  const contracts = React.useMemo(() => contractsQuery.data?.items || [], [contractsQuery.data]);
  const totalRevenue = transactions
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);
  const newLeads = clients.filter(c => c.status === 'Lead').length;
  const activeListings = properties.filter(p => p.status === 'For Sale').length;
  const pendingContracts = contracts.filter(c => c.status === 'Sent').length;
  const kpiData = React.useMemo(() => [
    { title: 'Total Revenue', value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(totalRevenue), icon: DollarSign },
    { title: 'New Leads', value: newLeads.toString(), icon: Users },
    { title: 'Active Listings', value: activeListings.toString(), icon: Home },
    { title: 'Contracts Pending', value: pendingContracts.toString(), icon: FileText },
  ], [totalRevenue, newLeads, activeListings, pendingContracts]);
  const monthlyData = React.useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      name: new Date(0, i).toLocaleString('default', { month: 'short' }),
      sales: 0,
      revenue: 0,
    }));
    transactions.forEach(t => {
      const monthIndex = new Date(t.date).getMonth();
      if (t.type === 'Income' && t.category === 'Commission') {
        months[monthIndex].sales += 1;
        months[monthIndex].revenue += t.amount;
      }
    });
    return months;
  }, [transactions]);
  return (
    <div className="space-y-8 md:space-y-12">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 md:gap-8">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <KpiCardSkeleton key={i} />)
        ) : (
          kpiData.map((kpi) => (
            <Card key={kpi.title} className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                <kpi.icon className="h-5 w-5 text-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-charcoal dark:text-white">{kpi.value}</div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {isLoading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Sales Performance (Units Sold)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }} />
                    <Bar dataKey="sales" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                    <Tooltip
                      contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}
                      formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value))}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#1A202C" strokeWidth={2} dot={{ fill: '#D4AF37', r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}