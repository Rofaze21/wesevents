import { FirebaseDatabaseService } from './services/firebaseDatabase/firebase-database.service';
import { MbscModule } from '@mobiscroll/angular';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { AngularFireModule, FirebaseAuth } from '@angular/fire';
import { environment } from '../environments/environment';
import { FirestoreSettingsToken } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KeysPipe } from './key.pipe';
import { ReactiveFormsModule }from '@angular/forms';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import {AngularFireAuth} from '@angular/fire/auth'
import {AngularFireAuthModule} from '@angular/fire/auth'
var config =  {
  apiKey: "AIzaSyAda2rGGrmtWjGtg3bYvGKOv-EsZnG_Cm0",
  authDomain: "wesleyaneventsapp.firebaseapp.com",
  databaseURL: "https://wesleyaneventsapp.firebaseio.com",
  projectId: "wesleyaneventsapp",
  storageBucket: "",
  messagingSenderId: "41400534112",
  appId: "1:41400534112:web:afbdc39393804002"
  }
@NgModule({
  declarations: [AppComponent, KeysPipe],
  entryComponents: [],
  imports: [ 
    ReactiveFormsModule,  
    FormsModule, AngularFireModule.initializeApp(config),AngularFireAuthModule, 
    AngularFirestoreModule, AngularFireDatabaseModule,
BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [AngularFireAuth, FirebaseAuthentication,FirebaseDatabaseService,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, 
    { provide: FirestoreSettingsToken, useValue: {} }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}