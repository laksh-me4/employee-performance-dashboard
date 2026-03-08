import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Goal } from '../../models/performance.models';
import { PerformanceDataService } from '../../services/performance-data.service';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './goals.component.html',
  styleUrl: './goals.component.css'
})
export class GoalsComponent implements OnInit {
  goals: Goal[] = [];

  constructor(private readonly dataService: PerformanceDataService) {}

  ngOnInit(): void {
    this.refreshGoals();
  }

  ownerName(employeeId: number): string {
    return this.dataService.getEmployeeById(employeeId)?.name ?? 'Unknown Owner';
  }

  updateProgress(goalId: number, progress: number): void {
    this.dataService.updateGoalProgress(goalId, Number(progress));
    this.refreshGoals();
  }

  private refreshGoals(): void {
    this.goals = this.dataService.getGoals();
  }
}
