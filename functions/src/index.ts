import * as functions from "firebase-functions";
import {Chat} from "./models/chat";
import {NotificationService} from "./services/notification_service";
import {ChatMessage} from "./models/chat_message";
import {db} from "./services/admin";

exports.listenToChat = functions
    .firestore
    .document("chats/{chatId}/messages/{messageId}")
    .onCreate(async (snapshot, context) => {
      try {
        const notificationService = new NotificationService();
        const chatID = context.params.chatId;
        const doc = await db.collection("chats").doc(chatID).get();
        const chat: Chat = Chat.fromJson(doc.data());
        const chatMessage: ChatMessage = ChatMessage.fromJson(snapshot.data());
        const otherMember = chat.getOtherMember(chatMessage.authorUid!);
        if (chatMessage.message != null) {
          if (otherMember.token != null) {
            await notificationService.sendNotification(
                "New message received!",
                chatMessage.message,
                otherMember.token,
            );
          }
        }
      } catch (e) {
        console.log("Error: ", e);
      }
    });
