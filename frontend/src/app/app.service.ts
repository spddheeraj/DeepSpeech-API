import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

@Injectable()
export class AppService {
  constructor(private httpClient: HttpClient ) { }
  baseUrl: string = "https://c6-vx-test.avaamo.com/file";

  save(blob: URL, number: string): Observable<{}>{
    var new_blob;
    getBase64(blob).then(
      data => new_blob=data
    );
    return this.httpClient.post(this.baseUrl, blob, {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'number': number
      })
    }).pipe(
      data => {
        return data;
    });
  }

  postFile(fileToUpload: File): Observable<{}> {
    console.log("inside upload file")
    // var new_blob;
    // getBase64(fileToUpload).then(
    //   data => new_blob=data
    // );
    return this.httpClient.post(this.baseUrl, fileToUpload, httpOptions).pipe(
      data => {
          return data;
    });
  }
}
