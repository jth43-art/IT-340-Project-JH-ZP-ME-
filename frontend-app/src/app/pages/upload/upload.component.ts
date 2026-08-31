import {
  Component,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {

  title = '';
  artist = '';
  album = '';
  genre = '';

  selectedAudioFile: File | null = null;
  selectedImageFile: File | null = null;

  isDragOver = false;
  isUploading = false;

  errorMessage = '';
  successMessage = '';

  constructor(
    private uploadService: UploadService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // ========================================
  // MP3 SELECTION
  // ========================================

  onAudioSelected(event: any): void {
    const file = event.target.files?.[0];

    this.errorMessage = '';

    if (!file) {
      return;
    }

    const isMp3 =
      file.type === 'audio/mpeg' ||
      file.type === 'audio/mp3' ||
      file.name.toLowerCase().endsWith('.mp3');

    if (!isMp3) {
      this.selectedAudioFile = null;

      this.errorMessage =
        'Please select a valid MP3 file.';

      return;
    }

    this.selectedAudioFile = file;
  }

  // ========================================
  // ARTWORK SELECTION
  // ========================================

  onImageSelected(event: any): void {
    const file = event.target.files?.[0];

    this.errorMessage = '';

    if (!file) {
      return;
    }

    const validImage =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/webp';

    if (!validImage) {
      this.selectedImageFile = null;

      this.errorMessage =
        'Artwork must be a JPG, PNG, or WebP image.';

      return;
    }

    this.selectedImageFile = file;
  }

  // ========================================
  // DRAG AND DROP
  // ========================================

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
    this.errorMessage = '';

    const file =
      event.dataTransfer?.files?.[0];

    if (!file) {
      return;
    }

    const isMp3 =
      file.type === 'audio/mpeg' ||
      file.type === 'audio/mp3' ||
      file.name.toLowerCase().endsWith('.mp3');

    if (!isMp3) {
      this.errorMessage =
        'Only MP3 files are allowed.';

      return;
    }

    this.selectedAudioFile = file;
  }

  // ========================================
  // SUBMIT UPLOAD
  // ========================================

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.selectedAudioFile) {
      this.errorMessage =
        'Please select or drag-and-drop an MP3 file.';

      return;
    }

    if (!this.title.trim()) {
      this.errorMessage =
        'Song title is required.';

      return;
    }

    this.isUploading = true;

    const formData = new FormData();

    // IMPORTANT:
    // Backend expects the MP3 field to be named "file"
    formData.append(
      'file',
      this.selectedAudioFile
    );

    formData.append(
      'title',
      this.title.trim()
    );

    formData.append(
      'artist',
      this.artist.trim()
    );

    formData.append(
      'album',
      this.album.trim()
    );

    formData.append(
      'genre',
      this.genre.trim()
    );

    // Optional album artwork
    if (this.selectedImageFile) {
      formData.append(
        'artwork',
        this.selectedImageFile
      );
    }

    this.uploadService
      .uploadSong(formData)
      .subscribe({

        next: (res: any) => {
          console.log(
            'Upload successful:',
            res
          );

          this.isUploading = false;

          this.successMessage =
            'Song uploaded successfully!';

          this.resetForm();

          this.cdr.detectChanges();
        },

        error: (err: any) => {
          console.error(
            'Upload error:',
            err
          );

          this.isUploading = false;

          this.errorMessage =
            err.error?.message ||
            'Failed to upload song. Please try again.';

          this.cdr.detectChanges();
        }
      });
  }

  // ========================================
  // RESET FORM
  // ========================================

  resetForm(): void {
    this.title = '';
    this.artist = '';
    this.album = '';
    this.genre = '';

    this.selectedAudioFile = null;
    this.selectedImageFile = null;
  }
}
