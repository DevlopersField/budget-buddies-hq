
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useFinance } from '@/context/FinanceContext';

const History: React.FC = () => {
  const { transactions } = useFinance();
  const [filter, setFilter] = useState<'all' | 'expense' | 'investment'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  };
  
  // Filter transactions based on type and search term
  const filteredTransactions = transactions
    .filter(transaction => {
      if (filter === 'all') return true;
      return transaction.type === filter;
    })
    .filter(transaction => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        transaction.description.toLowerCase().includes(searchLower) ||
        transaction.category.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Group transactions by date
  const groupedTransactions: Record<string, typeof transactions> = {};
  
  filteredTransactions.forEach(transaction => {
    const date = new Date(transaction.date).toLocaleDateString();
    if (!groupedTransactions[date]) {
      groupedTransactions[date] = [];
    }
    groupedTransactions[date].push(transaction);
  });
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-bold tracking-tight mb-8 text-center">Transaction History</h1>
        
        <Card className="mb-8 glass-card animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl">Filters</CardTitle>
            <CardDescription>Filter your transaction history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/3">
                <Select value={filter} onValueChange={(value) => setFilter(value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Transaction type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="expense">Expenses Only</SelectItem>
                    <SelectItem value="investment">Investments Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full sm:w-2/3">
                <Input
                  placeholder="Search by description or category"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {Object.keys(groupedTransactions).length > 0 ? (
          <div className="space-y-6 animate-fade-in">
            {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
              <div key={date} className="space-y-3">
                <h2 className="text-xl font-semibold">{date}</h2>
                
                {dayTransactions.map(transaction => (
                  <div 
                    key={transaction.id} 
                    className="flex justify-between items-center p-4 rounded-lg glass-card hover:bg-white/95 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          transaction.type === 'expense' 
                            ? 'bg-destructive/10 text-destructive' 
                            : 'bg-primary/10 text-primary'
                        }`}>
                          {transaction.type}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {transaction.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(transaction.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <p className={`font-semibold ${
                      transaction.type === 'expense' 
                        ? 'text-destructive' 
                        : 'text-primary'
                    }`}>
                      {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 animate-fade-in">
            <p className="text-muted-foreground text-lg">No transactions found</p>
            {searchTerm || filter !== 'all' ? (
              <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters</p>
            ) : null}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default History;
