
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { NumberInput } from '@/components/ui/NumberInput';
import { useFinance } from '@/context/FinanceContext';
import { useToast } from '@/hooks/use-toast';

const MonthlyBudget: React.FC = () => {
  const { setBudget, getBudgetByMonth } = useFinance();
  const { toast } = useToast();
  
  // Get current month in YYYY-MM format
  const currentMonth = new Date().toISOString().substring(0, 7);
  
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [extraSavings, setExtraSavings] = useState<number>(0);
  
  // Load existing budget for the month
  useEffect(() => {
    const existingBudget = getBudgetByMonth(currentMonth);
    if (existingBudget) {
      setTotalBudget(existingBudget.totalBudget);
      setExtraSavings(existingBudget.extraSavings);
    }
  }, [currentMonth, getBudgetByMonth]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (totalBudget < 0) {
      toast({
        title: "Invalid budget",
        description: "Budget amount cannot be negative.",
        variant: "destructive",
      });
      return;
    }
    
    setBudget({
      month: currentMonth,
      totalBudget,
      extraSavings: extraSavings >= 0 ? extraSavings : 0
    });
    
    toast({
      title: "Budget updated",
      description: `Your monthly budget has been set for ${new Date(currentMonth + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}.`,
    });
  };
  
  // Format the month for display
  const formattedMonth = new Date(currentMonth + '-01').toLocaleString('default', { month: 'long', year: 'numeric' });
  
  return (
    <Card className="w-full glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl">Monthly Budget</CardTitle>
        <CardDescription>Set your budget for {formattedMonth}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="total-budget">Total Monthly Budget</Label>
            <NumberInput
              id="total-budget"
              prefix="$"
              value={totalBudget || ''}
              onChange={setTotalBudget}
              placeholder="0.00"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="extra-savings">Extra Savings</Label>
            <NumberInput
              id="extra-savings"
              prefix="$"
              value={extraSavings || ''}
              onChange={setExtraSavings}
              placeholder="0.00"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Additional money you saved outside your regular budget
            </p>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          className="w-full"
        >
          Update Budget
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MonthlyBudget;
