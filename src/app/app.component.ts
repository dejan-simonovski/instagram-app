import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <div>
  <img id='logo' src="../../assets/images/microgram-logo.png">
  </div>
  <div id="main">
    <router-outlet></router-outlet>
  </div>`,
  styles: [`
  .container{
    display: flex;
    flex-direction: column;
  }

  #main{
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #logo{
    width: 100%;
  }`]
})
export class AppComponent {}
