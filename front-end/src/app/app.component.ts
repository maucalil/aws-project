import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'front-end';
  imageUrl: string = "";
  base64Image: string = "";
  constructor(private http: HttpClient) {}

  inputFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      const image = event.target.files[0] as Blob;

      let reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = () => {
        this.base64Image = reader.result as string;
      }
    }
  }

  onSubmit() {
    this.http.post(`${environment.API}dev/images/upload`, {"file": this.base64Image}).subscribe(res => 
    {
      console.log(res);
    });
  }
}
