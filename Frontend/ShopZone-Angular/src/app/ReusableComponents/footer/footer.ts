import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  logo: any = "assets/ShopZone Logo.png";
  currentYear: number = new Date().getFullYear();
}
