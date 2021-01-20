import { Component } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  dataUser = {
    email: "",
    password: "",
  };

  connected: boolean;
  email = '';
  userId = '';
  method = '';

  constructor(
    public afAuth: AngularFireAuth
    ) {
    this.afAuth.authState.subscribe(auth => {
      if(!auth){
        console.log('non connecté');
        this.connected = false;
      }else{
        console.log('connecté ' + auth.uid);
        this.userId = auth.uid;
        this.email = auth.email;
        this.method = auth.providerData[0].providerId;
        this.connected = true;
      }
    });
  }

  login() {
    console.log("email: " + this.dataUser.email);
    console.log("password: " + this.dataUser.password);
    this.afAuth.signInWithEmailAndPassword(
      this.dataUser.email,
      this.dataUser.password
    );
    this.dataUser = {
      email: "",
      password: "",
    };
  }

  logout(){
    this.afAuth.signOut();
  }

  signUp(){
    this.afAuth.createUserWithEmailAndPassword(this.dataUser.email, this.dataUser.password);
    this.dataUser = {
      email: "",
      password: "",
    };
  }
}
