export interface Patient {
  name: string,
  surname: string,
  dni: string,
  notes?: string,
  meeting: [{
    inDate: Date,
    outDate: Date,
    meetingType: string,
    meetingLocation: string,
  }]
}