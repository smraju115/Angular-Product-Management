import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {
  config:MatSnackBarConfig = {
    duration:3000
  }
  constructor(private snackBar:MatSnackBar) { }
  message(message:string, action:string){
    this.snackBar.open(message, action, this.config);
  }
}
