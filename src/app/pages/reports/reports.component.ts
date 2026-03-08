import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Employee } from '../../models/performance.models';
import { PerformanceDataService } from '../../services/performance-data.service';

interface DepartmentSummary {
  department: string;
  employeeCount: number;
  avgPerformance: number;
  avgEngagement: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  summaries: DepartmentSummary[] = [];

  constructor(private readonly dataService: PerformanceDataService) {}

  ngOnInit(): void {
    const employees = this.dataService.getEmployees();
    this.summaries = this.buildDepartmentSummary(employees);
  }

  private buildDepartmentSummary(employees: Employee[]): DepartmentSummary[] {
    const grouped = employees.reduce<Record<string, Employee[]>>((acc, employee) => {
      acc[employee.department] = acc[employee.department] ?? [];
      acc[employee.department].push(employee);
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([department, members]) => ({
        department,
        employeeCount: members.length,
        avgPerformance: this.round(
          members.reduce((sum, employee) => sum + employee.performanceScore, 0) / members.length
        ),
        avgEngagement: this.round(
          members.reduce((sum, employee) => sum + employee.engagement, 0) / members.length
        )
      }))
      .sort((a, b) => b.avgPerformance - a.avgPerformance);
  }

  private round(value: number): number {
    return Number(value.toFixed(1));
  }
}
