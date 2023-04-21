import * as functions from "firebase-functions";
import {Chat} from "./models/chat";
import {NotificationService} from "./services/notification_service";
import {ChatMessage} from "./models/chat_message";
import {db} from "./services/admin";
import {UserFirestoreService} from "./services/user_firestore_service";

const userService = new UserFirestoreService();

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
        const otherMember = chat.getOtherMember(chatMessage.authorUid);
        const otherUser = await userService.getUserByUid(otherMember.uid);
        const meUser = chat.getMe(chatMessage.authorUid);
        if (chatMessage.message != null) {
          if (otherUser?.token != null) {
            await notificationService.sendNotification(
                meUser.name ?? "New message received!",
                chatMessage.message,
                otherUser.token,
                chat.chatId ?? "",
                meUser.name ?? "Author"
            );
          }
        }
      } catch (e) {
        console.log("Error: ", e);
      }
    });
