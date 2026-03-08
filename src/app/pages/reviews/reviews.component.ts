import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Review } from '../../models/performance.models';
import { PerformanceDataService } from '../../services/performance-data.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css'
})
export class ReviewsComponent implements OnInit {
  reviews: Review[] = [];

  readonly statuses: Review['status'][] = ['Pending', 'In Progress', 'Completed'];

  constructor(private readonly dataService: PerformanceDataService) {}

  ngOnInit(): void {
    this.refreshReviews();
  }

  employeeName(employeeId: number): string {
    return this.dataService.getEmployeeById(employeeId)?.name ?? 'Unknown Employee';
  }

  updateStatus(reviewId: number, status: Review['status']): void {
    this.dataService.updateReviewStatus(reviewId, status);
    this.refreshReviews();
  }

  private refreshReviews(): void {
    this.reviews = this.dataService.getReviews();
  }
}
