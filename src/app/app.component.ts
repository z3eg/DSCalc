import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DSCalculator';  
  forms:any[]=[{id:0}];

  addForm() {
    this.forms.push({id:this.forms.length});
  }

  removeItem(formId) {
    console.log("REMOVING FORM WITH ID " + formId);
    this.forms.forEach(form => {
      if (form.id==formId) {
        this.forms.splice(this.forms.indexOf(form), 1);
      }
    });
  }
}
