import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../models/performance.models';
import { PerformanceDataService } from '../../services/performance-data.service';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  departments: string[] = [];

  searchTerm = '';
  selectedDepartment = 'All';

  newEmployee: Omit<Employee, 'id'> = {
    name: '',
    role: '',
    department: '',
    email: '',
    performanceScore: 75,
    engagement: 75,
    lastReviewDate: new Date().toISOString().slice(0, 10),
    goalsCompleted: 0,
    pendingGoals: 1
  };

  constructor(private readonly dataService: PerformanceDataService) {}

  ngOnInit(): void {
    this.refreshData();
  }

  get filteredEmployees(): Employee[] {
    return this.employees.filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.role.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesDepartment =
        this.selectedDepartment === 'All' || employee.department === this.selectedDepartment;
      return matchesSearch && matchesDepartment;
    });
  }

  addEmployee(): void {
    if (
      !this.newEmployee.name.trim() ||
      !this.newEmployee.role.trim() ||
      !this.newEmployee.department.trim() ||
      !this.newEmployee.email.trim()
    ) {
      return;
    }

    this.dataService.addEmployee({ ...this.newEmployee });
    this.newEmployee = {
      name: '',
      role: '',
      department: '',
      email: '',
      performanceScore: 75,
      engagement: 75,
      lastReviewDate: new Date().toISOString().slice(0, 10),
      goalsCompleted: 0,
      pendingGoals: 1
    };
    this.refreshData();
  }

  private refreshData(): void {
    this.employees = this.dataService.getEmployees();
    this.departments = ['All', ...new Set(this.employees.map((employee) => employee.department))];
  }
}
