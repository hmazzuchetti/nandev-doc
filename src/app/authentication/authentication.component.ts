import { Component, OnInit } from '@angular/core';
import {Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from '@angular/fire/auth';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.less']
})
export class AuthenticationComponent implements OnInit {
  userEmail = new FormControl('', [Validators.required]);
  userPassword = new FormControl('', [Validators.required]);

  constructor(public auth: Auth) { 

  }

  handleRegister(){
    createUserWithEmailAndPassword(this.auth, this.userEmail.value, this.userPassword.value)
    .then((response: any)=>{
      console.log(response.user)
    })
    .catch((err)=>{
      alert(err.message);
    })
  }

  handleLogin(){
    signInWithEmailAndPassword(this.auth, this.userEmail.value, this.userPassword.value)
    .then((response: any)=>{
      console.log(response.user)
    })
    .catch((err)=>{
      alert(err.message);
    })
  }

  ngOnInit(): void {
    
  }

}
