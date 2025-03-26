
import React, { createContext, useContext, useState, useEffect } from "react";

export type Transaction = {
  id: string;
  date: string;
  type: "expense" | "investment";
  amount: number;
  category: string;
  description: string;
};

export type Budget = {
  id: string;
  month: string; // "YYYY-MM" format
  totalBudget: number;
  extraSavings: number;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  progress?: number; // 0-100
};

type FinanceContextType = {
  transactions: Transaction[];
  budgets: Budget[];
  badges: Badge[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  setBudget: (budget: Omit<Budget, "id">) => void;
  getTotalExpenses: (month?: string) => number;
  getTotalInvestments: (month?: string) => number;
  getBudgetByMonth: (month: string) => Budget | undefined;
  getExtraSavings: (month: string) => number;
  updateBadges: () => void;
};

const defaultBadges: Badge[] = [
  {
    id: "1",
    name: "First Steps",
    description: "Track your first expense",
    icon: "badge",
    earned: false,
  },
  {
    id: "2",
    name: "Investor",
    description: "Make your first investment",
    icon: "badge-percent",
    earned: false,
  },
  {
    id: "3",
    name: "Budget Master",
    description: "Stay under budget for a month",
    icon: "badge-check",
    earned: false,
  },
  {
    id: "4",
    name: "Saver",
    description: "Save extra money for 3 consecutive months",
    icon: "dollar-sign",
    earned: false,
    progress: 0,
  },
];

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem("transactions");
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const savedBudgets = localStorage.getItem("budgets");
    return savedBudgets ? JSON.parse(savedBudgets) : [];
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    const savedBadges = localStorage.getItem("badges");
    return savedBadges ? JSON.parse(savedBadges) : defaultBadges;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("budgets", JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem("badges", JSON.stringify(badges));
  }, [badges]);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    setTransactions((prev) => [...prev, newTransaction]);
    updateBadges();
  };

  const setBudget = (budget: Omit<Budget, "id">) => {
    // Check if budget for this month already exists
    const existingBudgetIndex = budgets.findIndex((b) => b.month === budget.month);
    
    if (existingBudgetIndex >= 0) {
      // Update existing budget
      const updatedBudgets = [...budgets];
      updatedBudgets[existingBudgetIndex] = {
        ...updatedBudgets[existingBudgetIndex],
        totalBudget: budget.totalBudget,
        extraSavings: budget.extraSavings,
      };
      setBudgets(updatedBudgets);
    } else {
      // Add new budget
      const newBudget = {
        ...budget,
        id: crypto.randomUUID(),
      };
      setBudgets((prev) => [...prev, newBudget]);
    }
    updateBadges();
  };

  const getTotalExpenses = (month?: string) => {
    return transactions
      .filter((t) => {
        if (month) {
          return t.type === "expense" && t.date.startsWith(month);
        }
        return t.type === "expense";
      })
      .reduce((total, t) => total + t.amount, 0);
  };

  const getTotalInvestments = (month?: string) => {
    return transactions
      .filter((t) => {
        if (month) {
          return t.type === "investment" && t.date.startsWith(month);
        }
        return t.type === "investment";
      })
      .reduce((total, t) => total + t.amount, 0);
  };

  const getBudgetByMonth = (month: string) => {
    return budgets.find((b) => b.month === month);
  };

  const getExtraSavings = (month: string) => {
    const budget = getBudgetByMonth(month);
    if (!budget) return 0;
    
    const expenses = getTotalExpenses(month);
    if (budget.totalBudget >= expenses) {
      return budget.totalBudget - expenses + budget.extraSavings;
    }
    return budget.extraSavings;
  };

  const updateBadges = () => {
    const updatedBadges = [...badges];
    
    // First Steps Badge
    if (!updatedBadges[0].earned && transactions.some(t => t.type === "expense")) {
      updatedBadges[0].earned = true;
      updatedBadges[0].earnedDate = new Date().toISOString();
    }
    
    // Investor Badge
    if (!updatedBadges[1].earned && transactions.some(t => t.type === "investment")) {
      updatedBadges[1].earned = true;
      updatedBadges[1].earnedDate = new Date().toISOString();
    }
    
    // Budget Master Badge
    const allMonths = budgets.map(b => b.month);
    const stayedUnderBudget = allMonths.some(month => {
      const budget = getBudgetByMonth(month);
      const expenses = getTotalExpenses(month);
      return budget && budget.totalBudget >= expenses;
    });
    
    if (!updatedBadges[2].earned && stayedUnderBudget) {
      updatedBadges[2].earned = true;
      updatedBadges[2].earnedDate = new Date().toISOString();
    }
    
    // Saver Badge (3 consecutive months with extra savings)
    const monthsWithSavings = [];
    for (const budget of budgets) {
      if (getExtraSavings(budget.month) > 0) {
        monthsWithSavings.push(budget.month);
      }
    }
    
    if (monthsWithSavings.length >= 3) {
      if (!updatedBadges[3].earned) {
        updatedBadges[3].earned = true;
        updatedBadges[3].earnedDate = new Date().toISOString();
      }
    } else {
      updatedBadges[3].progress = Math.min((monthsWithSavings.length / 3) * 100, 100);
    }
    
    setBadges(updatedBadges);
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        budgets,
        badges,
        addTransaction,
        setBudget,
        getTotalExpenses,
        getTotalInvestments,
        getBudgetByMonth,
        getExtraSavings,
        updateBadges,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};
