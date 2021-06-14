import { Component } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase } from "@angular/fire/database";

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

  messageText;
  messages: any = [];
  connected: boolean;
  passwordType: string = "password";
  passwordIcon: string = "eye-off";

  email = "";
  userId = "";
  method = "";

  constructor(
    public afAuth: AngularFireAuth,
    public afDB: AngularFireDatabase
  ) {
    this.afAuth.authState.subscribe((auth) => {
      if (!auth) {
        console.log("non connecté");
        this.connected = false;
      } else {
        console.log("connecté " + auth.uid);
        this.userId = auth.uid;
        this.email = auth.email;
        this.method = auth.providerData[0].providerId;
        this.getMessages();
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

  logout() {
    this.afAuth.signOut();
  }

  signUp() {
    this.afAuth.createUserWithEmailAndPassword(
      this.dataUser.email,
      this.dataUser.password
    );
    this.dataUser = {
      email: "",
      password: "",
    };
  }

  sendMessage() {
    this.afDB.list("Messages/").push({
      userId: this.userId,
      text: this.messageText,
      date: new Date().toISOString(),
    });
    this.messageText = "";
  }

  getMessages() {
    this.afDB
      .list("Messages/", (ref) => ref.orderByChild("date"))
      .snapshotChanges(["child_added"])
      .subscribe((actions) => {
        this.messages = [];
        actions.forEach((action) => {
          this.messages.push({
            userId: action.payload.exportVal().userId,
            text: action.payload.exportVal().text,
            date: action.payload.exportVal().date,
          });
        });
      });
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === "text" ? "password" : "text";
    this.passwordIcon = this.passwordIcon === "eye-off" ? "eye" : "eye-off";
  }
}
