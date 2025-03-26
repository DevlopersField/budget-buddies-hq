
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const { toast } = useToast();
  
  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all your financial data? This action cannot be undone.')) {
      localStorage.clear();
      toast({
        title: "Data cleared",
        description: "All your financial data has been reset.",
      });
      // Reload the page to reset the app state
      window.location.reload();
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-bold tracking-tight mb-8 text-center">Settings</h1>
        
        <div className="grid gap-8 max-w-3xl mx-auto animate-fade-in">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl">Data Management</CardTitle>
              <CardDescription>Manage your financial data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">Clear all data</h3>
                <p className="text-sm text-muted-foreground">
                  This will remove all your transactions, budgets, and reset your achievements.
                  This action cannot be undone.
                </p>
                <Button 
                  variant="destructive" 
                  onClick={handleClearData}
                >
                  Reset All Data
                </Button>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Data Storage</h3>
                <p className="text-sm text-muted-foreground">
                  Your financial data is stored locally on your device and is not sent to any servers.
                  If you clear your browser data or switch devices, your information will not be available.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl">About MoneyMaster</CardTitle>
              <CardDescription>Information about this application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-medium">Version</h3>
                <p className="text-sm text-muted-foreground">1.0.0</p>
              </div>
              
              <div className="space-y-1">
                <h3 className="font-medium">Description</h3>
                <p className="text-sm text-muted-foreground">
                  MoneyMaster helps you track your daily expenses and investments, 
                  manage monthly budgets, and achieve financial goals through a reward system.
                </p>
              </div>
              
              <div className="space-y-1">
                <h3 className="font-medium">Privacy</h3>
                <p className="text-sm text-muted-foreground">
                  This app respects your privacy by storing all data locally on your device.
                  No personal or financial information is collected or transmitted.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;
