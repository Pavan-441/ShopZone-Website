import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navbar } from '../../ReusableComponents/navbar/navbar';
import { Footer } from '../../ReusableComponents/footer/footer';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [RouterModule, Navbar, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {


}
