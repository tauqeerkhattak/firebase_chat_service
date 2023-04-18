import * as functions from "firebase-functions";
import {Chat} from "./models/chat";
import {NotificationService} from "./services/notification_service";
import {ChatMessage} from "./models/chat_message";
import {db} from "./services/admin";
import {UserModel} from "./models/user_model";
import {PaginatedBatch} from "./services/paginated_batch";

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
        const meUser = chat.getMe(chatMessage.authorUid!);
        if (chatMessage.message != null) {
          if (otherMember.token != null) {
            await notificationService.sendNotification(
                otherMember.name ?? "New message received!",
                chatMessage.message,
                otherMember.token,
                chat.chatId ?? "",
                meUser.name ?? "Author"
            );
          }
        }
      } catch (e) {
        console.log("Error: ", e);
      }
    });

exports.listenToUserChanges = functions
    .firestore
    .document("users/{userId}")
    .onUpdate(async (change, context) => {
      try {
        const userData = change.after.data();
        const user = UserModel.fromJson(userData);
        const userChatQuery = await db
            .collection("chats")
            .where("memberUids", "array-contains", user.uid)
            .get();
        const userChats = userChatQuery.docs.map((doc) => {
          return Chat.fromJson(doc.data());
        });
        const batch = new PaginatedBatch();
        for (const chat of userChats) {
          if (chat.chatId != null) {
            const doc = db.collection("chats").doc(chat.chatId);
            chat.members = chat.members?.map((member) => {
              if (member.uid === user.uid) {
                member.token = user.token;
                return member;
              }
              return member;
            });
            batch.update(doc, chat.toJson());
          }
        }
        await batch.commit();
      } catch (e) {
        console.log("Error: ", e);
      }
    });
