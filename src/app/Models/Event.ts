export interface Event {
  event_title?: String, 
  event_location?: String,  
  event_students?: String, 
  event_category?: String, 
  event_date?: String, 
  event_startTime?: string, 
  event_endTime?: string, 
  event_description?: String, 
  event_pictureURL?: String, 
  event_chatNumber?: Number, 
  event_goingCounter?: any[], 
  event_maybeGoingCounter?: Number, 
  event_creation_timeStamp?: Date ,
  event_id?: Number, 
  createdBy?: String,
  lastUpdate?: Date
}