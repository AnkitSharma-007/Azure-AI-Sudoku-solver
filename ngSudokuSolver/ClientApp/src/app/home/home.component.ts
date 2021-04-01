import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormRecognizerService } from '../services/form-recognizer.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnDestroy {
  gameBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  loading = false;
  imageFile;
  imagePreview;
  maxFileSize: number;
  isValidFile = true;
  status: string;
  DefaultStatus: string;
  imageData = new FormData();
  game = new Array(9);
  private unsubscribe$ = new Subject();

  constructor(private formRecognizerService: FormRecognizerService) {
    this.DefaultStatus = 'Maximum size allowed for the image is 4 MB';
    this.status = this.DefaultStatus;
    this.maxFileSize = 4 * 1024 * 1024; // 4MB

    for (var i = 0; i < this.game.length; i++) {
      this.game[i] = new Array(9);
    }
  }

  uploadImage(event) {
    this.imageFile = event.target.files[0];
    if (this.imageFile.size > this.maxFileSize) {
      this.status = `The file size is ${this.imageFile.size} bytes, this is more than the allowed limit of ${this.maxFileSize} bytes.`;
      this.isValidFile = false;
    } else if (this.imageFile.type.indexOf('image') == -1) {
      this.status = 'Please upload a valid image file';
      this.isValidFile = false;
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      this.status = this.DefaultStatus;
      this.isValidFile = true;
    }
  }

  GetSudokuTable() {
    if (this.isValidFile) {
      this.loading = true;
      this.imageData.append('imageFile', this.imageFile);

      this.formRecognizerService
        .getSudokuTableFromImage(this.imageData)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (result: any) => {
            this.game = result;
            this.loading = false;
          },
          () => {
            console.error();
            this.loading = false;
          }
        );
    }
  }

  SolveSudoku() {
    this.sudokuSolver(this.game);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private sudokuSolver(data) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (data[i][j] == '') {
          for (let k = 1; k <= 9; k++) {
            if (this.isSudokuValid(data, i, j, k)) {
              data[i][j] = `${k}`;
              if (this.sudokuSolver(data)) {
                return true;
              } else {
                data[i][j] = '';
              }
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  private isSudokuValid(board, row, col, k) {
    for (let i = 0; i < 9; i++) {
      const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
      const n = 3 * Math.floor(col / 3) + (i % 3);
      if (board[row][i] == k || board[i][col] == k || board[m][n] == k) {
        return false;
      }
    }
    return true;
  }
}
