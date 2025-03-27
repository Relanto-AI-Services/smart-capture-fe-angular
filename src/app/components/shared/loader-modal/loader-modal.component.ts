import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loader-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatProgressSpinnerModule],
  templateUrl: './loader-modal.component.html',
  styleUrls: ['./loader-modal.component.scss'],
})
export class LoaderModalComponent {
  constructor(
    public dialogRef: MatDialogRef<LoaderModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { page: string }
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
