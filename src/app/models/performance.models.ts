export interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
  email: string;
  performanceScore: number;
  engagement: number;
  lastReviewDate: string;
  goalsCompleted: number;
  pendingGoals: number;
}

export interface Review {
  id: number;
  employeeId: number;
  quarter: string;
  year: number;
  rating: number;
  managerNotes: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

export interface Goal {
  id: number;
  employeeId: number;
  title: string;
  progress: number;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
}

export interface DashboardMetrics {
  totalEmployees: number;
  avgPerformance: number;
  avgEngagement: number;
  pendingReviews: number;
  atRiskEmployees: number;
}
