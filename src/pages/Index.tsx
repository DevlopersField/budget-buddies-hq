
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DailyEntry from '@/components/DailyEntry';
import MonthlyBudget from '@/components/MonthlyBudget';
import Dashboard from '@/components/Dashboard';
import Achievements from '@/components/Achievements';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-bold tracking-tight mb-8 text-center">Financial Dashboard</h1>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <DailyEntry />
          <MonthlyBudget />
        </div>
        
        <Dashboard />
        
        <div className="mt-8">
          <Achievements />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
