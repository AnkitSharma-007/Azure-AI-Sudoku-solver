import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FormRecognizerService {
  baseURL: string;

  constructor(private http: HttpClient) {
    this.baseURL = '/api/FormRecognizer';
  }

  getSudokuTableFromImage(image: FormData) {
    return this.http.post(this.baseURL, image);
  }
}
