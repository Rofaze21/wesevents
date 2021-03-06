import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Event } from '../../Models/Event'
import { ObjectToUniqueKey } from '@firebase/database/dist/src/core/util/util';
import { map, take } from 'rxjs/operators'
import { identifierName } from '@angular/compiler';


@Injectable({
    providedIn: 'root'

})

export class FirebaseDatabaseService {

    eventsCollection: AngularFirestoreCollection<Event>;
    events?: Observable<Event[]>;
    
    constructor(public fStore: AngularFirestore) {
        this.eventsCollection = fStore.collection<Event>('events')

        this.events = this.eventsCollection.snapshotChanges()
            .pipe(
                map(actions => {
                    return actions.map(a => {
                        let data = a.payload.doc.data();
                        let id = a.payload.doc.id;
                        return { id, ...data };
                    });
                }))
    }

    eventCollectionRef = this.fStore.collection('events');

    createEvent(event: Event, user_uid: string) {
        var userRef = this.fStore.collection("users").doc(user_uid)
        var id;
        this.eventCollectionRef.add(event)
            .then(function (docref) {
               id = docref.id
                console.log("Event was successfully created!");
                userRef.update({
                    createdEvents: firebase.firestore.FieldValue.arrayUnion(docref.id)
                })
                console.log("docref IS", docref.id)


            })
            .catch(function (error) {
                console.log("Error Creating Event: ", error);
            })



    }
    
    addUpdate(event, update: string) {
        this.eventCollectionRef.doc(event).update({updates: firebase.firestore.FieldValue.arrayUnion(update)
        })

        
        // .then(()=> {

        //     this.eventCollectionRef.doc("${event}/${update}").update({time_stamp:firebase.firestore.FieldValue.serverTimestamp()})
        // })
    }
    getUpdates(event) {
        var updates; 

       return this.eventCollectionRef.doc(event).get()
    }
    deleteUpdate(event, updateToDelete) {
        return this.eventCollectionRef.doc(event).update({
            updates: firebase.firestore.FieldValue.arrayRemove(updateToDelete)
        })
    }
    getEvent(id: string) {
        return this.eventsCollection.doc<Event>(id).valueChanges().pipe(take(1), map(event => {
            if(event) {
                event.event_id = id
                return event
            }
           
        }))

    }

    getEventIDs() {
     
        return this.events
    }
   
    editEvent(event: Event, eventID: string) {

        this.eventCollectionRef.doc(eventID).update(event)
            .then(function (docref) {
                console.log("Event was successfully updated!");

            })
            .catch(function (error) {
                console.log("Error Editing Event: ", error);
            });
        
        this.eventCollectionRef.doc(eventID).update({lastUpdated: firebase.firestore.FieldValue.serverTimestamp()})
    }

    deleteEvent(event: string, user_uid: string) {
        var eventRef = this.fStore.collection("events").doc(event)
        this.deleteEventCreatedByArray(event, user_uid).then(() => {

            eventRef.update({
                eventDeleted: true
            })

        })

    }

    deleteGoing(event: string, user_uid: string) {
        var eventRef = this.eventCollectionRef.doc(event)
        return eventRef.update({
            event_goingCounter: firebase.firestore.FieldValue.arrayRemove(user_uid)
        })
    }


    deleteEventCreatedByArray(event: string, user_uid: string) {
        var userRef = this.fStore.collection("users").doc(user_uid)
        return userRef.update({
            createdEvents: firebase.firestore.FieldValue.arrayRemove(event)
        })
    }


    deleteEventFromSavedEvents(event: string, user_uid: string) {
        var userRef = this.fStore.collection("users").doc(user_uid)
        return userRef.update({
            savedEvents: firebase.firestore.FieldValue.arrayRemove(event)
        })
    }


    saveEvent(id: string, user_uid: string) {
        var userRef = this.fStore.collection("users").doc(user_uid)

        userRef.update({
            savedEvents: firebase.firestore.FieldValue.arrayUnion(id)
        })

        this.eventCollectionRef.doc(id).update({
            event_goingCounter: firebase.firestore.FieldValue.arrayUnion(user_uid)


        })
            .then(function (docref) {
                console.log("Marked as Going!");

            })
            .catch(function (error) {
                console.log("Error Creating Event: ", error);
            });
    }
    likeEvent(id: string, user_uid: string) {
        var userRef = this.fStore.collection("users").doc(user_uid)

        userRef.update({
            likedEvents: firebase.firestore.FieldValue.arrayUnion(id)
        })

    
    }
    deleteEventFromLikedEvents(event: string, user_uid: string) {
        var userRef = this.fStore.collection("users").doc(user_uid)
        return userRef.update({
            likedEvents: firebase.firestore.FieldValue.arrayRemove(event)
        })
    }

    unlikeEvent(event: string, user_uid: string) {
        var eventRef = this.eventCollectionRef.doc(event)
        return eventRef.update({
            likedEvents: firebase.firestore.FieldValue.arrayRemove(event)
        })
    }

}
