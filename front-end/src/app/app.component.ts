import { Component } from '@angular/core';
import { AppService } from './app.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'front-end';
  key: string = "";
  imageUrl: string = "";
  base64Image: string = "";
  constructor(private appService: AppService,private _sanitizer: DomSanitizer) {}

  inputFileChange(event: any) {
    this.base64Image = this.appService.imageToBase64(event);
  }

  async onSubmit() {
    await this.appService.upload().subscribe(res => {
      console.log(res);
      this.imageUrl = res.uploadResult.Key;
      // this.imageUrl = JSON.stringify(res);
      // this.imageUrl = JSON.parse(this.imageUrl).uploadResult.Key;

      setTimeout(() => {
        this.appService.getOptimizedImage(this.imageUrl)
        .subscribe(res => {
          this.imageUrl = res.result
          console.log(this.imageUrl);
          this.imageUrl = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' 
                 + this.imageUrl) as string;
          console.log(this.imageUrl);
        });
      }, 3600);
      
    });
  }
}
