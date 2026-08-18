import { Component, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {
  title: string = '';
  artist: string = '';
  album: string = '';
  genre: string = '';

  selectedAudioFile: File | null = null;
  selectedImageFile: File | null = null;

  isDragOver: boolean = false;
  isUploading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private uploadService: UploadService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // File selection handlers
  onAudioSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.includes('audio')) {
      this.selectedAudioFile = file;
    } else {
      this.errorMessage = 'Please select a valid MP3/Audio file.';
    }
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.includes('image')) {
      this.selectedImageFile = file;
    } else {
      this.errorMessage = 'Please select a valid Image file for artwork.';
    }
  }

  // Drag and Drop handlers for MP3
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (file.type.includes('audio') || file.name.endsWith('.mp3')) {
        this.selectedAudioFile = file;
        this.errorMessage = '';
      } else {
        this.errorMessage = 'Only MP3/Audio files are allowed for drag and drop.';
      }
    }
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.selectedAudioFile) {
      this.errorMessage = 'Please select or drag-and-drop an MP3 file.';
      return;
    }

    if (!this.title.trim()) {
      this.errorMessage = 'Song title is required.';
      return;
    }

    this.isUploading = true;
    const formData = new FormData();
    formData.append('audio', this.selectedAudioFile);
    formData.append('title', this.title);
    formData.append('artist', this.artist);
    formData.append('album', this.album);
    formData.append('genre', this.genre);

    if (this.selectedImageFile) {
      formData.append('artwork', this.selectedImageFile);
    }

    this.uploadService.uploadSong(formData).subscribe({
      next: (res: any) => {
        this.isUploading = false;
        this.successMessage = 'Song uploaded successfully!';
        this.resetForm();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Upload error:', err);
        this.isUploading = false;
        this.errorMessage = err.error?.message || 'Failed to upload song. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }

  resetForm(): void {
    this.title = '';
    this.artist = '';
    this.album = '';
    this.genre = '';
    this.selectedAudioFile = null;
    this.selectedImageFile = null;
  }
}
