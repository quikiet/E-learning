import { Component } from '@angular/core';
import { Avatar } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { AccordionModule } from 'primeng/accordion';
import { CommonModule } from '@angular/common';
import { Tag } from 'primeng/tag';
@Component({
  selector: 'app-course-detail',
  imports: [AccordionModule, CommonModule, DividerModule, Avatar, Tag],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.css'
})
export class CourseDetailComponent {
  tabs: any[] = [
    {
      title: 'Chapter 1: Course Overview', content: {
        1: 'Content 1',
        2: 'Content 2',
        3: 'Content 3',
        4: 'Content 4',
      }, value: '0'
    },
    {
      title: 'Chapter 2: Curriculum', content: {
        1: 'Content 6',
        2: 'Content 7',
        3: 'Content 8',
        4: 'Content 9',
      }, value: '1'
    },
    {
      title: 'Chapter 3: Components', content: {
        1: 'Content 11',
        2: 'Content 12',
        3: 'Content 13',
        4: 'Content 14',
      }, value: '2'
    },
  ];
}
