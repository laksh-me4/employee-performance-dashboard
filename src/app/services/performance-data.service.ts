import { Injectable } from '@angular/core';
import { DashboardMetrics, Employee, Goal, Review } from '../models/performance.models';

interface PersistedState {
  employees: Employee[];
  reviews: Review[];
  goals: Goal[];
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceDataService {
  private readonly storageKey = 'employee-performance-dashboard-state';

  private employees: Employee[] = [
    {
      id: 1,
      name: 'Ava Carter',
      role: 'Frontend Engineer',
      department: 'Engineering',
      email: 'ava.carter@company.com',
      performanceScore: 92,
      engagement: 87,
      lastReviewDate: '2026-01-14',
      goalsCompleted: 4,
      pendingGoals: 1
    },
    {
      id: 2,
      name: 'Liam Brooks',
      role: 'Data Analyst',
      department: 'Analytics',
      email: 'liam.brooks@company.com',
      performanceScore: 81,
      engagement: 74,
      lastReviewDate: '2025-12-22',
      goalsCompleted: 3,
      pendingGoals: 2
    },
    {
      id: 3,
      name: 'Sophia Reed',
      role: 'HR Specialist',
      department: 'Human Resources',
      email: 'sophia.reed@company.com',
      performanceScore: 88,
      engagement: 91,
      lastReviewDate: '2026-02-05',
      goalsCompleted: 5,
      pendingGoals: 1
    },
    {
      id: 4,
      name: 'Noah Walker',
      role: 'Sales Manager',
      department: 'Sales',
      email: 'noah.walker@company.com',
      performanceScore: 76,
      engagement: 69,
      lastReviewDate: '2025-11-30',
      goalsCompleted: 2,
      pendingGoals: 3
    },
    {
      id: 5,
      name: 'Mia Patel',
      role: 'Backend Engineer',
      department: 'Engineering',
      email: 'mia.patel@company.com',
      performanceScore: 95,
      engagement: 93,
      lastReviewDate: '2026-01-28',
      goalsCompleted: 6,
      pendingGoals: 1
    }
  ];

  private reviews: Review[] = [
    {
      id: 101,
      employeeId: 1,
      quarter: 'Q1',
      year: 2026,
      rating: 4.7,
      managerNotes: 'Consistently ships polished UI features on time.',
      status: 'Completed'
    },
    {
      id: 102,
      employeeId: 2,
      quarter: 'Q1',
      year: 2026,
      rating: 4.1,
      managerNotes: 'Strong analysis quality; improve stakeholder updates.',
      status: 'In Progress'
    },
    {
      id: 103,
      employeeId: 3,
      quarter: 'Q1',
      year: 2026,
      rating: 4.5,
      managerNotes: 'Excellent employee support and policy rollout.',
      status: 'Completed'
    },
    {
      id: 104,
      employeeId: 4,
      quarter: 'Q1',
      year: 2026,
      rating: 3.8,
      managerNotes: 'Needs follow-through on team coaching goals.',
      status: 'Pending'
    },
    {
      id: 105,
      employeeId: 5,
      quarter: 'Q1',
      year: 2026,
      rating: 4.9,
      managerNotes: 'High impact system improvements and mentoring.',
      status: 'Completed'
    }
  ];

  private goals: Goal[] = [
    {
      id: 201,
      employeeId: 1,
      title: 'Improve lighthouse score to 95+',
      progress: 80,
      dueDate: '2026-04-12',
      priority: 'High'
    },
    {
      id: 202,
      employeeId: 2,
      title: 'Automate monthly KPI reporting dashboard',
      progress: 60,
      dueDate: '2026-05-05',
      priority: 'Medium'
    },
    {
      id: 203,
      employeeId: 3,
      title: 'Launch onboarding playbook v2',
      progress: 72,
      dueDate: '2026-04-28',
      priority: 'Medium'
    },
    {
      id: 204,
      employeeId: 4,
      title: 'Increase regional conversion by 8%',
      progress: 45,
      dueDate: '2026-06-01',
      priority: 'High'
    },
    {
      id: 205,
      employeeId: 5,
      title: 'Reduce API latency by 20%',
      progress: 88,
      dueDate: '2026-04-02',
      priority: 'High'
    }
  ];

  constructor() {
    this.loadPersistedState();
  }

  getEmployees(): Employee[] {
    return [...this.employees];
  }

  getReviews(): Review[] {
    return [...this.reviews];
  }

  getGoals(): Goal[] {
    return [...this.goals];
  }

  getEmployeeById(employeeId: number): Employee | undefined {
    return this.employees.find((employee) => employee.id === employeeId);
  }

  addEmployee(payload: Omit<Employee, 'id'>): void {
    const nextId = this.employees.length ? Math.max(...this.employees.map((employee) => employee.id)) + 1 : 1;
    this.employees = [{ ...payload, id: nextId }, ...this.employees];
    this.persistState();
  }

  updateReviewStatus(reviewId: number, status: Review['status']): void {
    this.reviews = this.reviews.map((review) =>
      review.id === reviewId
        ? {
            ...review,
            status
          }
        : review
    );
    this.persistState();
  }

  updateGoalProgress(goalId: number, progress: number): void {
    this.goals = this.goals.map((goal) =>
      goal.id === goalId
        ? {
            ...goal,
            progress: Math.max(0, Math.min(100, progress))
          }
        : goal
    );
    this.persistState();
  }

  getDashboardMetrics(): DashboardMetrics {
    const totalEmployees = this.employees.length;
    const avgPerformance = this.round(
      this.employees.reduce((acc, employee) => acc + employee.performanceScore, 0) / totalEmployees
    );
    const avgEngagement = this.round(
      this.employees.reduce((acc, employee) => acc + employee.engagement, 0) / totalEmployees
    );

    const pendingReviews = this.reviews.filter((review) => review.status !== 'Completed').length;
    const atRiskEmployees = this.employees.filter(
      (employee) => employee.performanceScore < 75 || employee.engagement < 70
    ).length;

    return {
      totalEmployees,
      avgPerformance,
      avgEngagement,
      pendingReviews,
      atRiskEmployees
    };
  }

  private loadPersistedState(): void {
    const rawState = localStorage.getItem(this.storageKey);
    if (!rawState) {
      return;
    }

    try {
      const parsed = JSON.parse(rawState) as PersistedState;
      if (Array.isArray(parsed.employees) && Array.isArray(parsed.reviews) && Array.isArray(parsed.goals)) {
        this.employees = parsed.employees;
        this.reviews = parsed.reviews;
        this.goals = parsed.goals;
      }
    } catch {
      localStorage.removeItem(this.storageKey);
    }
  }

  private persistState(): void {
    const state: PersistedState = {
      employees: this.employees,
      reviews: this.reviews,
      goals: this.goals
    };
    localStorage.setItem(this.storageKey, JSON.stringify(state));
  }

  private round(value: number): number {
    return Number(value.toFixed(1));
  }
}
