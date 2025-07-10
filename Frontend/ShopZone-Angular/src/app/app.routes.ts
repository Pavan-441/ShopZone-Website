import { Routes } from '@angular/router';
import { Home } from './PagesComponents/home/home';
import { Products } from './PagesComponents/products/products';
import { Cart } from './PagesComponents/cart/cart';
import { Contact } from './PagesComponents/contact/contact';
import { Login } from './PagesComponents/login/login';
import { Signup } from './PagesComponents/signup/signup';
import { Admin } from './AdminComponents/admin/admin';
import { AdminHome } from './AdminComponents/admin-home/admin-home';
import { AdminProducts } from './AdminComponents/admin-products/admin-products';


export const routes: Routes = [
    {path:"", component: Home},
    {path:"home", component: Home},
    {path: "products", component: Products},
    {path:"cart", component: Cart},
    {path:"contact", component: Contact},
    {path:"login", component: Login},
    {path:"signup", component: Signup},
    {path:"admin", component: Admin},
    {path: "admin-home", component: AdminHome},
    {path: "admin-products", component: AdminProducts},
    { path: '', redirectTo: '/home', pathMatch: 'full' },
];
