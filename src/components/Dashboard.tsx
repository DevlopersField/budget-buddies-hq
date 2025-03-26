import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinance } from '@/context/FinanceContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const Dashboard: React.FC = () => {
  const { 
    transactions, 
    budgets, 
    getTotalExpenses, 
    getTotalInvestments,
    getBudgetByMonth
  } = useFinance();
  
  // Get current month in YYYY-MM format
  const currentMonth = new Date().toISOString().substring(0, 7);
  const currentMonthBudget = getBudgetByMonth(currentMonth);
  
  // Calculate totals for the current month
  const monthlyExpenses = getTotalExpenses(currentMonth);
  const monthlyInvestments = getTotalInvestments(currentMonth);
  const budgetAmount = currentMonthBudget?.totalBudget || 0;
  const extraSavings = currentMonthBudget?.extraSavings || 0;
  
  // Calculate budget progress
  const budgetProgressPercentage = budgetAmount > 0 
    ? Math.min((monthlyExpenses / budgetAmount) * 100, 100) 
    : 0;
  
  // Recent transactions data
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions]);
  
  // Expense categories data for chart
  const expenseCategoryData = useMemo(() => {
    const categoryMap = new Map();
    
    transactions
      .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
      .forEach(transaction => {
        const current = categoryMap.get(transaction.category) || 0;
        categoryMap.set(transaction.category, current + transaction.amount);
      });
    
    return Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, currentMonth]);
  
  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in w-full">
      {/* Overview Card */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-xl">Overview</CardTitle>
          <CardDescription>Your financial summary</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Monthly Budget</p>
              <p className="text-2xl font-semibold">{formatCurrency(budgetAmount)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Extra Savings</p>
              <p className="text-2xl font-semibold">{formatCurrency(extraSavings)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Expenses</p>
              <p className="text-2xl font-semibold">{formatCurrency(monthlyExpenses)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Investments</p>
              <p className="text-2xl font-semibold">{formatCurrency(monthlyInvestments)}</p>
            </div>
          </div>
          
          {/* Budget Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Budget Usage</span>
              <span>{budgetProgressPercentage.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full ${
                  budgetProgressPercentage >= 90 ? 'bg-destructive' : 'bg-primary'
                }`}
                style={{ width: `${budgetProgressPercentage}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Expense Chart */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-xl">Expense Breakdown</CardTitle>
          <CardDescription>How you're spending your money</CardDescription>
        </CardHeader>
        <CardContent>
          {expenseCategoryData.length > 0 ? (
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name }) => name}
                    labelLine={false}
                  >
                    {expenseCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[220px]">
              <p className="text-muted-foreground">No expense data available</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Recent Transactions */}
      <Card className="glass-card md:col-span-2">
        <CardHeader>
          <CardTitle className="text-xl">Recent Transactions</CardTitle>
          <CardDescription>Your latest financial activities</CardDescription>
        </CardHeader>
        <CardContent>
          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map(transaction => (
                <div 
                  key={transaction.id} 
                  className="flex justify-between items-center p-3 rounded-lg bg-background/50 hover:bg-background transition-colors"
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
                        {new Date(transaction.date).toLocaleDateString()}
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
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No transactions yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
