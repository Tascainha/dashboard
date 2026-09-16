export type TransactionType = "INCOME" | "EXPENSE";

export type AccountType =
  | "CHECKING"
  | "SAVINGS"
  | "CREDIT_CARD"
  | "CASH"
  | "INVESTMENT";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse extends AuthUser {
  token: string;
}

export interface Account {
  id: number;
  name: string;
  type: AccountType;
  initialBalance: number;
  currentBalance: number;
}

export interface Category {
  id: number;
  name: string;
  type: TransactionType;
  color: string;
}

export interface Transaction {
  id: number;
  accountId: number;
  accountName: string;
  categoryId: number;
  categoryName: string;
  categoryColor: string;
  description: string;
  amount: number;
  type: TransactionType;
  transactionDate: string;
}

export interface Goal {
  id: number;
  categoryId: number;
  categoryName: string;
  categoryColor: string;
  targetAmount: number;
  refYear: number;
  refMonth: number;
  spentAmount: number;
  progressPercent: number;
}

export interface CategoryBreakdownItem {
  categoryId: number;
  categoryName: string;
  color: string;
  total: number;
}

export interface MonthlyTrendItem {
  year: number;
  month: number;
  income: number;
  expense: number;
}

export interface DashboardSummary {
  year: number;
  month: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  netWorth: number;
  expenseByCategory: CategoryBreakdownItem[];
  incomeByCategory: CategoryBreakdownItem[];
  monthlyTrend: MonthlyTrendItem[];
  goals: Goal[];
}

export interface ApiErrorBody {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  details: string[];
}
