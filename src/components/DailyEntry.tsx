
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NumberInput } from '@/components/ui/NumberInput';
import { useFinance } from '@/context/FinanceContext';
import { useToast } from '@/hooks/use-toast';

const EXPENSE_CATEGORIES = [
  'Housing', 'Transportation', 'Food', 'Utilities', 
  'Insurance', 'Healthcare', 'Entertainment', 'Personal', 'Other'
];

const INVESTMENT_CATEGORIES = [
  'Stocks', 'Bonds', 'Retirement', 'Real Estate', 'Crypto', 
  'Savings', 'Business', 'Education', 'Other'
];

const DailyEntry: React.FC = () => {
  const { addTransaction } = useFinance();
  const { toast } = useToast();
  
  const [transactionType, setTransactionType] = useState<'expense' | 'investment'>('expense');
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter an amount greater than zero.",
        variant: "destructive",
      });
      return;
    }
    
    if (!category) {
      toast({
        title: "Missing category",
        description: "Please select a category.",
        variant: "destructive",
      });
      return;
    }
    
    addTransaction({
      date: new Date().toISOString(),
      type: transactionType,
      amount,
      category,
      description: description.trim() || `${transactionType} - ${category}`
    });
    
    toast({
      title: "Entry added",
      description: `Your ${transactionType} has been recorded.`,
    });
    
    // Reset form
    setAmount(0);
    setDescription('');
  };
  
  // Determine categories based on transaction type
  const categories = transactionType === 'expense' 
    ? EXPENSE_CATEGORIES 
    : INVESTMENT_CATEGORIES;
  
  return (
    <Card className="w-full glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl">Daily Entry</CardTitle>
        <CardDescription>Record your daily expenses and investments</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="transaction-type">Type</Label>
            <RadioGroup 
              id="transaction-type"
              value={transactionType} 
              onValueChange={(value) => {
                setTransactionType(value as 'expense' | 'investment');
                setCategory(''); // Reset category when type changes
              }}
              className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="expense" />
                <Label htmlFor="expense" className="cursor-pointer">Expense</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="investment" id="investment" />
                <Label htmlFor="investment" className="cursor-pointer">Investment</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <NumberInput
              id="amount"
              prefix="$"
              value={amount || ''}
              onChange={setAmount}
              placeholder="0.00"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What was this for?"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          className="w-full"
        >
          Add {transactionType}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DailyEntry;
