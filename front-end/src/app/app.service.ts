import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {map} from 'rxjs/operators';

interface GetResponse {
  message: string;
  result: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppService {

  base64Image: string = "";

  constructor(private http: HttpClient) { }

  imageToBase64(event: any): string {
    if (event.target.files && event.target.files[0]) {
      const image = event.target.files[0] as Blob;

      let reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = () => {
        this.base64Image = reader.result as string;
      }
    }
    return this.base64Image;
  }

  upload() {
    return this.http.post(`${environment.API}dev/image/upload`, {"file": this.base64Image})
            .pipe(map(res => {
              let key = JSON.stringify(res);
              return key = JSON.parse(key);
            }));
  }

  getOptimizedImage(key: string) {
    const formatedKey = this.toKeyFormat(key);
    console.log(formatedKey);
    return this.http.get<GetResponse>(`${environment.API}dev/image/${formatedKey}`)

  }

  toKeyFormat(key: string) {
    return key.replace("uploads/", "")
              .replace("jpeg", "jpg")
              .replace("png", "jpg");
  }
}
