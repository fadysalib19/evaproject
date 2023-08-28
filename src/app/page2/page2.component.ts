import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as faceapi from '@vladmandic/face-api';

@Component({
  selector: 'app-page2',
  templateUrl: './page2.component.html',
  styleUrls: ['./page2.component.css']
})
export class Page2Component implements OnInit, AfterViewInit {
  // ... rest of the code remains unchanged ...

  video: HTMLVideoElement;
  countdown: number = 3; // starting from 3 seconds
  isFaceDetected: boolean = false;
  uploadedImage: HTMLImageElement;
  //canvas: HTMLCanvasElement = document.createElement('canvas');
  displaySize: { width: number; height: number } = { width: 1200, height: 800 }; // Adjust as needed



  constructor() {
  
  this.video = document.createElement('video');
  this.uploadedImage = new Image();
  requestAnimationFrame(this.detectFaces);
}


  async ngOnInit() {
    // Load face-api.js models or any other initialization logic
    await faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models');
  }

  async ngAfterViewInit() {
    this.video = document.getElementById('video') as HTMLVideoElement;
    navigator.mediaDevices.getUserMedia(
      { video: {} }
    ).then(stream => {
      this.video.srcObject = stream;
      // Once the video stream is set up, start detecting faces
      this.detectFaces();
    }).catch(err => {
      console.error(err);
    });
  }


  async detectFaces() {
    const canvas = faceapi.createCanvasFromMedia(this.video);
    document.body.append(canvas);
    const displaySize = { width: this.video.width, height: this.video.height };
    faceapi.matchDimensions(canvas, displaySize);
    // ... existing code ...

    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(this.video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      const ctx = canvas.getContext('2d');
      //canvas?.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

      if (detections.length > 0 && !this.isFaceDetected) {
        this.isFaceDetected = true;
        this.startCountdown();
      }
    }, 10);
  }

  startCountdown() {
    const interval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(interval);
        // You can add any action you want to perform after the countdown ends
      }
    }, 100);
  }

  async onImageUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      const file = target.files[0];
    
      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = async () => {
        this.uploadedImage = image;
        const detections = await faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
        // Handle the detections as needed, e.g., draw them on a canvas
      };
    }
  }
}


// Path: src/app/page2/page2.component.html