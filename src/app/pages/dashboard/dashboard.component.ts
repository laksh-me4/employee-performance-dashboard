import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DashboardMetrics, Employee } from '../../models/performance.models';
import { PerformanceDataService } from '../../services/performance-data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  metrics!: DashboardMetrics;
  topPerformers: Employee[] = [];
  performanceDistribution: Array<{ label: string; value: number }> = [];

  constructor(private readonly dataService: PerformanceDataService) {}

  ngOnInit(): void {
    const employees = this.dataService.getEmployees();
    this.metrics = this.dataService.getDashboardMetrics();
    this.topPerformers = [...employees].sort((a, b) => b.performanceScore - a.performanceScore).slice(0, 3);
    this.performanceDistribution = employees.map((employee) => ({
      label: employee.name,
      value: employee.performanceScore
    }));
  }
}
