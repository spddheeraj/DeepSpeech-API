import { Component , OnInit, Output } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import { DomSanitizer } from '@angular/platform-browser';
import {AppService} from './app.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

    fileToUpload: File = null;
    private record;
    recording = [];
    private urls = [];
    private error;
    response ;
    isloader = false;
    text: string;
    blob = null;

    constructor(private domSanitizer: DomSanitizer, private appService: AppService, private spinner: NgxSpinnerService) {
    }

    sanitize(url:string, number:number){
        return this.domSanitizer.bypassSecurityTrustUrl(url);
    }

    /**
     * Start recording.
     */
    initiateRecording(number:number) {
        
        this.recording[number] = true;
        let mediaConstraints = {
            video: false,
            audio: true
        };
        navigator.mediaDevices
            .getUserMedia(mediaConstraints)
            .then(this.successCallback.bind(this), this.errorCallback.bind(this));
    }

    /**
     * Will be called automatically.
     */
    successCallback(stream) {
        var options = {
            mimeType: "audio/wav",
            numberOfAudioChannels: 1,
            desiredSampRate: 16 * 1000
        };
        //Start Actuall Recording
        var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
        this.record = new StereoAudioRecorder(stream, options);
        this.record.record();
    }

    /**
     * Stop recording.
     */
    stopRecording(number:number) {
        this.recording[number] = false;
        // this.record.stop(this.processRecording.bind(this));
        this.record.stop((blob) => {
          this.processRecording(blob, number);
        });
    }

    /**
     * processRecording Do what ever you want with blob
     * @param  {any} blob Blog
     */
    processRecording(blob, number) {
      this.isloader=true;
      this.spinner.show();
      this.urls[number] = URL.createObjectURL(blob);
      console.log(this.urls[number])
      this.response = this.appService.save(blob, number).subscribe(result => {
        this.response = result;
        console.log('s ',this.response.username);
        this.text = this.response.username;
        this.isloader = false;
        this.spinner.hide();
      });
    }
     
    /**
     * Process Error.
     */
    errorCallback(error) {
        this.error = 'Can not play audio in your browser';
    }

    handleFileInput(files: FileList) {
      this.fileToUpload = files.item(0);
      this.uploadFileToActivity();
  }

  uploadFileToActivity() {
    this.isloader=true;
    this.spinner.show();
    this.appService.postFile(this.fileToUpload).subscribe(result => {
        this.response = result;
        console.log('s ',this.response.username);
        this.text = this.response.username;
        this.isloader = false;
        this.spinner.hide();
      });
  }
}