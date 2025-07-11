import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user-manage/user.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Tag } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';



interface UserData {
  user: {
    id: number;
    username: string;
    fullname: string;
    email: string;
    avatar: string | null;
    birthdate: number;
    gender: string;
    role: string;
    status: string;
    created_at: string;
    updated_at: string;
    enrollments: any[];
    payments: any[];
    lesson_progress: any[];
    reviews: any[];
    quiz_results: any[];
    student: any;
    instructor: any;
  };
  analytics: any;
}
@Component({
  selector: 'app-user-detail',
  imports: [Tag, ProgressSpinnerModule, MessageModule, TableModule, CardModule, CommonModule, RouterLink,
    AvatarModule
  ],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css'
})
export class UserDetailComponent implements OnInit {
  userData: UserData | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const userId = Number(this.route.snapshot.paramMap.get('id'));
    if (userId) {
      this.fetchUserData(userId);
    } else {
      this.errorMessage = 'ID not found';
      this.isLoading = false;
    }
  }

  fetchUserData(id: number): void {
    this.userService.showUser(id).subscribe({
      next: (response: any) => {
        this.userData = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message;
        this.isLoading = false;
      }
    });
  }

  cutText(text: string, wordLimit: number = 50): string {
    if (!text) return '';
    const words = text.split('');
    if (words.length <= wordLimit) return text;

    return words.slice(0, wordLimit).join('') + '...';
  }
}
