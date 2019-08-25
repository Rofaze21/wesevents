import { filter } from 'rxjs/operators';
import { element } from "protractor";
import { ToastController } from "@ionic/angular";
import { Event } from "../../Models/Event";
import { LocationFilterComponent } from "./../../filters/location-filter/location-filter.component";
import { ScrollComponent } from "./../../filters/DaysOfWeekFilter/scroll.component";
import { Component, OnInit, ViewChild , EventEmitter, Output} from "@angular/core";
import { CardComponent } from "./../../shared/card/card.component";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { FirebaseDatabaseService } from "../../services/firebaseDatabase/firebase-database.service";
import * as firebase from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import { ActivityFilterComponent } from "./../../filters/Activity/activity-filter.component";
import * as moment from "moment";
import { PopoverController, Platform } from "@ionic/angular";
import { PopoverComponent } from "../../popover/popover.component";
// import { FcmService } from './../../fcm.service';
import { Subject } from 'rxjs/Subject';
import { tap } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import {timer} from 'rxjs/observable/timer'

import "firebase/database";
import { EventHandlerVars } from '@angular/compiler/src/compiler_util/expression_converter';
import { IonContent } from '@ionic/angular';

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"]
})
export class Tab1Page implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  //  @ViewChild(CardComponent) child:CardComponent;
  showSplash = true;

  user: any;
  loadedEvents: any[] = [];
  events: any[] = [];
  searchTerm;
  limit = 2;
  lastVisible: any;
  activityArray = [];
  timeArray = [];
  dayArray = [];
   
  collpase: boolean = false;
  momentjs: any = moment;
  currentDate = moment()
  // currentDateTime = this.momentjs().format('YYYY-MM-DD HH:mm:ss ZZ');
  newDay = moment(this.currentDate).add(1, 'day').format('ddd');
  daysOfWeek = moment(this.newDay).format('ddd')

  currentFullDate =  Date.now
  // currentDate = this.currentFullDate.getDate
  // currentDay = this.currentFullDate.getDay
  // currentTime = this.currentFullDate.getHours
  
  days = {"First": [moment(this.currentDate).add(0, 'day').format('ddd'), moment(this.currentDate).add(0, 'day').format('DD'),true, moment(this.currentDate).add(0, 'day').format('MMM Do YY') ], "Second":  [moment(this.currentDate).add(1, 'day').format('ddd'), moment(this.currentDate).add(1, 'day').format('DD'), true, moment(this.currentDate).add(1, 'day').format('MMM Do YY')], "Third": [moment(this.currentDate).add(2, 'day').format('ddd'), moment(this.currentDate).add(2, 'day').format('DD'), true,moment(this.currentDate).add(2, 'day').format('MMM Do YY')], "Fourth": [moment(this.currentDate).add(3, 'day').format('ddd'), moment(this.currentDate).add(3, 'day').format('DD'), true,moment(this.currentDate).add(3, 'day').format('MMM Do YY')], "Fifth": [moment(this.currentDate).add(4, 'day').format('ddd'), moment(this.currentDate).add(4, 'day').format('DD'), true,moment(this.currentDate).add(4, 'day').format('MMM Do YY')], "Sixth": [moment(this.currentDate).add(5, 'day').format('ddd'), moment(this.currentDate).add(5, 'day').format('DD'), true,moment(this.currentDate).add(5, 'day').format('MMM Do YY')] , "Seventh": [moment(this.currentDate).add(6, 'day').format('ddd'), moment(this.currentDate).add(6, 'day').format('DD'), true,moment(this.currentDate).add(6, 'day').format('MMM Do YY')]  }
  showScrollButton = false;
  daysEntries = Object.entries(this.days)
  allClickedDays = true; 
  loadScreen = "Loading more events...";
  // newEvents = [];
  time = { morning: true, afternoon: true, evening: true, night: true };

  timeEntries = Object.entries(this.time);
  allClickedTime = true;
  iconsMatch = {
    Volunteering: "globe",
    Community: "help-buoy",
    Sports: "american-football",
    Food: "pizza",
    "Special lectures": "/../../../assets/Special-lecture.svg",
    Parties: "beer",
    Movies: "film",
    "Club Meeting": "/../../../assets/club-meeting.svg",
    "Cultural and Language": "planet",
    "Student Government": "globe",
    Music: "musical-notes",
    "Performance Art": "../../../assets/performance-arts.svg",
    Dance: "/../../../assets/dance.svg",
    Religious: "/../../../assetsreligious.svg",
    Gaming: "logo-game-controller-b",
    "Social Activism": "megaphone",
    Relax: "bonfire",
    Science: "flask",
    Shopping: "cart",
    "Special Shows": "color-wand",
    Fitness: "fitness"
  };

  activity = {
    Volunteering: true,
    Community: true,
    Sports: true,
    Food: true,
    "Special lectures": true,
    Parties: true,
    Movies: true,
    "Club Meeting": true,
    "Cultural and Language": true,
    "Student Government": true,
    Music: true,
    "Performance Art": true,
    Dance: true,
    Religious: true,
    Gaming: true,
    "Social Activism": true,
    Relax: true,
    Science: true,
    Shopping: true,
    "Special Shows": true,
    Fitness: true
  };

  activityEntries = Object.entries(this.activity);
  allClicked = true;
  constructor(
    private platform: Platform,
    // private fcm: FcmService,
    public fStore: AngularFirestore,
    public popoverController: PopoverController,
    private fireauth: AngularFireAuth,
    private toastCtrl: ToastController,
    private firebaseDatabase: FirebaseDatabaseService,
    private router: Router,
  ) {
    this.fireauth.auth.onAuthStateChanged(user => {
      if (user) {
        this.user = user;
      }
    });
  
  }

// if(platform.is('ios') || platform.is('android')) { 
//     platform.ready().then(() => {

//       // Get a FCM token
//       fcm.getToken()

//       // Listen to incoming messages
//       fcm.listenToNotifications().pipe(
//         tap(msg => {


//           let messageText: string;
// if (this.platform.is('android')) {
// messageText = msg.body;
// }

// if (this.platform.is('ios')) {
// messageText = msg.aps.alert;
// }
//           // show a toast
//           const toast = toastCtrl.create({
//             message: messageText,
//             duration: 3000
//           });
//           toast.then((data)=> {data.present()});
//         })
//       )
//       .subscribe()
//     })

//   }
  
  scrollUp () {
    this.content.scrollToTop(500)
  }
collapseButton() {
  this.collpase = !this.collpase
  //  this.child.collapseCard()

} 
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  initializeItems(): void {
    this.events = this.loadedEvents
    this.activityArray = this.loadedEvents
    this.timeArray = this.loadedEvents
    console.log(this.events, "this.events is Initialized")
  }

  ngOnInit() {
    // this.fetchEvents()
    this.fetchEvents();
    
  }

 
  categoryPressed(category) {
    this.allClicked = false;
    this.activityEntries.forEach(element => {
      // console.log(element, "element from ActivitiesEntries")
      
      if (element[0].toLowerCase() != category) {
        element[1] = false
      } else if(element[0].toLowerCase() == category) {
        console.log(category, "category")
        element[1] = true
        this.activityFilterClick();
      }
    });
  }
   scrollFunction(event: any)  {
      const bottomPosition = event.target.clientHeight + event.detail.scrollTop;
        const screenSize = event.target.clientHeight;
        console.log(screenSize - bottomPosition, "size")
        if (screenSize - bottomPosition <= -500) {
          this.showScrollButton = true;
        } else {
          this.showScrollButton = false;

        }
     
  }
  activityFilterClick() {

    this.fetchEventCategory("firstTime")
    console.log("activityFilterClicked")
// this.filterActivity()
//     this.solve()
    console.log(this.activityArray, "this.activityArray")
 

  }


  timeFilterClick() {
    // this.initializeItems();

    console.log("timeFilterClicked")
    this.filterTime();
    this.solve()

    // this.inter()
  console.log(this.timeArray, "this.timeArray")

    // console.log(this.events, "intersection(this.acitvitiesArray, this.timeArray)")

  }
  selectedCategoriesAsArray() {
    
    var trueActivities = this.activityEntries.filter(element => {
     return element[1]
    });


     return trueActivities 
  }
  

  dayFilterClick() {
    console.log("dayFilterClicked")

    this.makeDayQuery();
    // this.filterDay();
    this.timeFilterClick();
    this.activityFilterClick();
    this.solve();
    console.log(this.daysEntries, "this.dayArray")

  }
filter() {
  

  if (this.allClickedDays == false) { 

    this.dayFilterClick()

  } else {
    this.activityFilterClick()
    this.timeFilterClick()

  }
}
    solve() {
      this.events = []
      var activityArrayLength = this.activityArray.length
      var timeArrayLength = this.timeArray.length
      // var dayArrayLength = this.dayArray.length

      // if(timeArrayLength < activityArrayLength) {
      //   console.log("timeEvents is lower")
      //   min = this.timeArray
      //   max = this.activityArray
      // }

      if(timeArrayLength == 0) {
        this.events = []
        console.log(this.events, "newArray")
        return this.events 
      }

      if (activityArrayLength == 0 ) {
        this.events = []
        console.log(this.events, 'newArray')
        return this.events
      }
      // if (dayArrayLength == 0 ) {
      //   this.events = []
      //   console.log(this.events, 'newArray')
      //   return this.events
      // }


      var min = this.activityArray
      var max = this.timeArray
     
if(activityArrayLength != 0 && timeArrayLength != 0) { 
      min.forEach((event) => {

        if(max.indexOf(event) > -1 ) {
          if(this.allClickedDays == false && this.dayArray.indexOf(event) > -1) { 
          this.events.push(event)
        } else if(this.allClickedDays == true) {
          this.events.push(event)
        }
        }

      })
      console.log(this.events, "newArray")
    }

    



    }
  

inter() {
 this.events = this.activityArray.filter(function(x) {
    // checking second array contains the element "x"
    if(this.timeArray.indexOf(x) != -1)
      return true;
    else
      return false;
  });

}
   
  filterDay() {


    this.dayArray = [];
    var trueDay = this.daysEntries.filter(element => {
      return element[1][2];
    });
    // console.log(trueDay, "trueDay")

    this.loadedEvents.forEach(event => {
      trueDay.forEach(dayEntry => {
// console.log(event.data.event_date, "startDate")
       if (dayEntry[1][3] == moment(event.data.event_date).format('MMM Do YY')) {
          this.dayArray.push(event);
          // console.log(event.time, "eventtime")

        }
        
      });
    })
    console.log(this.dayArray, "dayArray");
  
  }
  fetchEvents() {
    this.fStore
      .collection("events")
      .ref.limit(this.limit)
      .get()
      .then(events => {

        this.lastVisible = events.docs[events.docs.length - 1];
        this.loadedEvents = [];
        events.docs.forEach(element => {
          if (!element.data().eventDeleted) {
            // element.data()["id"] = element.id
            this.loadedEvents.push({data:element.data(),id: element.id});
          }

        })
        this.initializeItems();
        // this.filter();
      })
      
  }
  makeDayQuery() {
   var query = this.fStore
      .collection("events")
      .ref.limit(this.limit)
      
      
      query = query.where("event_date", "==",  '2019-08-15')
      // query = query.where("event_date", "==",  moment( Date.now()).add(1, 'day').format('YYYY-MM-DD'))

    
 
 query.get().then(events => {
// console.log(moment( Date.now()).format( 'YYYY-MM-DD'), "the now Date")
// console.log(query.where("event_date", "==",  "2019-08-15"), "the second day")
        this.lastVisible = events.docs[events.docs.length - 1];
        this.loadedEvents = [];
        events.docs.forEach(element => {
          if (!element.data().eventDeleted) {
            // element.data()["id"] = element.id
            this.loadedEvents.push({data:element.data(),id: element.id});
          }

        })
        this.initializeItems();
        // this.filter();
      })
  }

 
  fabPressed() {
    this.router.navigateByUrl("/create-event");
  }

  doRefresh(event) {
    this.loadedEvents = [];
    this.fetchEvents();
    this.timeEntries.forEach(element => {
      element[1] = true;
    });
    this.allClicked = true;
    this.allClickedTime = true;

    this.activityEntries.forEach(element => {
      element[1] = true;
    });
    this.animateCSS("ion-list", "bounceInUp", null);

    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  animateCSS(element, animationName, callback) {
    const node = document.querySelector(element);
    node.classList.add("animated", animationName);

    function handleAnimationEnd() {
      node.classList.remove("animated", animationName);
      node.removeEventListener("animationend", handleAnimationEnd);

      if (typeof callback === "function") callback();
    }

    node.addEventListener("animationend", handleAnimationEnd);
  }
  saveEvent(eventID: string) {
    this.firebaseDatabase.saveEvent(eventID, this.user.uid);
    this.showToast("Event Saved");
  }

  showToast(msg) {
    this.toastCtrl
      .create({
        position: "top",
        message: msg,
        duration: 2000
      })
      .then(toast => toast.present());
  }

  changeColor(index) {
    this.allClicked = false;
    if (this.activityEntries[index][1] == false) {
      this.activityEntries[index][1] = true;
    } else {
      this.activityEntries[index][1] = false;
    }
    // this.filterList(this.activityEntries, "category", false)
  }
  changeColorTime(index) {
    this.allClickedTime = false;

    if (this.timeEntries[index][1] == false) {
      this.timeEntries[index][1] = true;
    } else {
      this.timeEntries[index][1] = false;
    }
  }
  changeColorDays(index){
    
    
    this.allClickedDays = false;
    if (this.daysEntries[index][1][2] == false ) {
      this.daysEntries[index][1][2] = true
    } else {
      this.daysEntries[index][1][2] = false

    }

    
  }

  allClickedFunc() {
    if (this.allClicked == true) {
      this.allClicked = false;
    } else if (this.allClicked == false) {
      this.allClicked = true;
    }

    if (this.allClicked == true) {
      this.activityEntries.forEach(element => {
        element[1] = true;
      });
    } else {
      this.activityEntries.forEach(element => {
        element[1] = false;
      });
    }

  }
  allClickedFuncTime() {

    
    if (this.allClickedTime == true) {
      this.allClickedTime = false;
    } else if (this.allClickedTime == false) {
      this.allClickedTime = true;
      
    }

    if (this.allClickedTime == true) {
      this.timeEntries.forEach(element => {
        element[1] = true;
      });
    } else {
      this.timeEntries.forEach(element => {
        element[1] = false;
      });
    }
    // this.tab1.filterList(this.timeEntries, "time", true)
  }

  allClickedFuncDays() {

    if(this.allClickedDays == true) {
      this.allClickedDays = false
    } else if(this.allClickedDays == false) {
      this.allClickedDays = true
    
    }

    if(this.allClickedDays  == true) {
      this.daysEntries.forEach(element => {
         element[1][2] = true;

}) } else {
  this.daysEntries.forEach(element => {
    element[1][2] = false;
})
}



  }
  filterActivity() {
    // [["Volunteering", true],["Community", true],["Sports", true],["Food", true],["Special lectures", true],["Parties", true],["Movies", true]]
    // [["Morning", true],["Afternoon", true],["Evening", true],["Night", true]]
    // this.initializeItems();
    var filtered = false;
    this.activityArray = [];
    
    var trueActivities = this.activityEntries.filter(element => {
     return element[1]
    });
    console.log(trueActivities, "trueActivities")

   return this.second(trueActivities)
  
  }

  second(array) {
    
    this.loadedEvents.forEach(event => {

      array.forEach(activity => {
        if (activity[0] == event.data.event_category) {
          this.activityArray.push(event);
        }
      });
    });

    console.log(this.activityArray, "activitiesArray");
  }
    filterTime() {
    this.timeArray = [];
    var trueTime = this.timeEntries.filter(element => {
      return element[1];
    });
    this.loadedEvents.forEach(event => {
      trueTime.forEach(timeEntry => {

        if (timeEntry[0] == event.data.time) {
          this.timeArray.push(event);
          // console.log(event.time, "eventtime")

        }
        
      });
    });
    console.log(this.timeArray, "timeArray");
    
  }

  filterList(evt) {
    this.initializeItems();
    const searchTerm = evt.srcElement.value;
    if (!searchTerm) {
      return;
    }
    this.events = this.loadedEvents.filter(currentEvent => {
      if (currentEvent.event_title && searchTerm) {
        if (
          currentEvent.event_title
            .toLowerCase()
            .indexOf(searchTerm.toLowerCase()) > -1
        ) {
          return true;
        }
        return false;
      }
    });
  }
  fetchEventCategory(mode) {
    var selectedCategories = this.selectedCategoriesAsArray(); //Array
    console.log(selectedCategories, "selectedCategories")

if (mode == "firstTime") {
  this.loadedEvents = []

  selectedCategories.forEach(element => {
    console.log("One category Selected")
    console.log(selectedCategories, "selected")
  this.fStore
      .collection("events")
      .ref.where("event_category", "==", element[0]).limit(this.limit)
      .get()
      .then(events => {
        console.log(this.events, "this.events")
        this.lastVisible = events.docs[events.docs.length - 1];
        // this.loadedEvents = [];
        events.docs.forEach(element => {
          if (!element.data().eventDeleted) {
            // element.data()["id"] = element.id
            this.loadedEvents.push({data:element.data(),id: element.id});
          }
  
        })
      
        //  this.filter();
      }).finally(()=> {  
        console.log(this.loadedEvents, "loadedEvents")
        this.events = this.loadedEvents;
      
      })
  })
 
}

if (mode == "loadMore") {

  selectedCategories.forEach(element => {
    console.log("One category Selected")
    console.log(selectedCategories, "selected")
  this.fStore
      .collection("events")
      .ref.startAfter(this.lastVisible).where("event_category", "==", element[0]).limit(this.limit)
      .get()
      .then(events => {
        console.log(this.events, "this.events")
        this.lastVisible = events.docs[events.docs.length - 1];
        // this.loadedEvents = [];
        events.docs.forEach(element => {
          if (!element.data().eventDeleted) {
            // element.data()["id"] = element.id
            this.loadedEvents.push({data:element.data(),id: element.id});
          }
  
        })
      
        //  this.filter();
      }).finally(()=> {  
        console.log(this.loadedEvents, "loadedEvents")
        this.events = this.loadedEvents;
      
      })
  })
 
}
   


    
  
  }
  loadData(event) {
    
    setTimeout(() => {

this.fetchEventCategory("loadMore")



  //     if (this.lastVisible != undefined) {
  //       this.loadScreen = "Loading more events...";

  //       var newCol = this.fStore
  //         .collection("events")
  //         .ref.startAfter(this.lastVisible)
  //         .where("event_category", "==", "Food").limit(this.limit)
  //         .get()
  //         .then(events => {
  //           this.lastVisible = events.docs[events.docs.length - 1];

  //           events.forEach(element => {
  //             if (!element.data().eventDeleted) {
  //               this.loadedEvents.push({data:element.data(),id: element.id});
  //             }
  //           });

            
  //           //  this.filter();

  //         });
  //     } else if (this.lastVisible == undefined) {
  //       this.loadScreen = "No More Events";
  //     }

  //     console.log("Done");
  //     event.target.complete();
     }, 1000);
 }
}
