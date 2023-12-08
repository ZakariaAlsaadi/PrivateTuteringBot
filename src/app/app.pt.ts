import { Component } from "@angular/core";
import { AppComponent } from "./app.component";

@Component({
    selector: 'pm-pt',
   templateUrl: './app.pt.html',
   styleUrls: ['./app.pt.css'],
})


export class PrivateTutoring {
    pageTitle: string ='Home page';
    ss: boolean = false;
    tss(): void {
        this.ss = !this.ss;
    }
}