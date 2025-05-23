import { AfterViewInit, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  title = 'Elearning-Website';
  ngAfterViewInit(): void {
    gsap.registerPlugin(ScrollTrigger);
  }

  cutText(text: string, wordLimit: number = 50): string {
    if (!text) return '';
    const words = text.split('');
    if (words.length <= wordLimit) return text;

    return words.slice(0, wordLimit).join('') + '...';
  }
}
