import {firestore} from "firebase-admin";
import Timestamp = firestore.Timestamp;

export class ChatMessage {
  messageId?: string;
  authorUid?: string;
  message?: string;
  dateTime?: Date;

  static fromJson(json: any): ChatMessage {
    const timestamp: Timestamp = json["dateTime"];
    const date: Date = timestamp.toDate();
    const message: ChatMessage = new ChatMessage();
    message.dateTime = date;
    message.message = json["message"];
    message.messageId = json["messageId"];
    message.authorUid = json["authorUid"];
    return message;
  }

  toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
