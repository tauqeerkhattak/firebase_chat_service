import {firestore} from "firebase-admin";
import Timestamp = firestore.Timestamp;

export class ChatMessage {
  messageId: string;
  authorUid: string;
  message: string;
  dateTime: Date;
  
  constructor(
      messageId: string, 
      authorUid: string, 
      message: string, 
      dateTime: Date
  ) {
    this.messageId = messageId;
    this.authorUid = authorUid;
    this.message = message;
    this.dateTime = dateTime;
  }

  static fromJson(json: any): ChatMessage {
    const timestamp: Timestamp = json["dateTime"];
    const date: Date = timestamp.toDate();
    return new ChatMessage(
        json["messageId"],
        json["authorUid"],
        json["message"],
        date,
    );
  }

  toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
