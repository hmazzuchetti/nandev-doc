import { Component, OnInit } from '@angular/core';

import { getStorage, ref, uploadBytesResumable, getDownloadURL  } from "firebase/storage";

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.less']
})



export class ImageUploadComponent implements OnInit {

  storage = getStorage();
  uploadProgress = 0;
  downloadUrl = "";
  // Create a child reference
  
  // imagesRef now points to 'images'



  constructor() { }

  

  ngOnInit(): void {
  }

  formHandler($event : any){
   $event.preventDefault();
    let file = $event.target.files[0];
    this.uploadFiles(file);
  }

  async uploadFiles(file : any){
    if(!file) return;
    const storageRef = ref(this.storage, `/novasImagens/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on("state_changed", (snapshot)=>{
      this.uploadProgress = Math.round((snapshot.bytesTransferred/snapshot.totalBytes)*100);
    },
    (error)=> console.log(error),
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref)
      .then((url) => this.downloadUrl = url)
    }
    )

  console.log(this.downloadUrl);
  }


}
