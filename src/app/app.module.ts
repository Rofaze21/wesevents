import { MbscModule } from '@mobiscroll/angular';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
 
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KeysPipe } from './key.pipe';
import { ReactiveFormsModule }from '@angular/forms';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';


@NgModule({
  declarations: [AppComponent, KeysPipe],
  entryComponents: [],
  imports: [ 
    ReactiveFormsModule,  
    FormsModule, AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, 
BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [FirebaseAuthentication,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, 
    { provide: FirestoreSettingsToken, useValue: {} }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
