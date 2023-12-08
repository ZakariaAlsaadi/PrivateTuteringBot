import { Component } from "@angular/core";

@Component ({
    selector : 'pm-root',
    template: `
          
    <h1>my first Component</h1>
    <h2>and the 2nd is down below</h2>
    <tm-product></tm-product>
    <h1>..................</h1>
    `


})

export class AppComponent {

          pageTitle: String = 'Private tutoring Web page';

}