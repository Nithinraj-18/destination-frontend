import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-info-page',
  imports: [RouterLink],
  templateUrl: './info-page.html',
  styleUrl: './info-page.css',
})
export class InfoPage {
  isMenuOpen = false;

  scrollDown() {
    const section = document.getElementById('#order');

    if (section) {
      section.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }
}
