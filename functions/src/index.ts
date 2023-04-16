import * as functions from "firebase-functions";
import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/lib/firestore";
import {credential} from "firebase-admin";
import applicationDefault = credential.applicationDefault;
import {Chat} from "./models/chat";

const app = initializeApp({
  credential: applicationDefault(),
});
app.name;
const db = getFirestore();

exports.listenToChat = functions
    .firestore
    .document("chats/{chatId}/messages/{messageId}")
    .onCreate(async (snapshot, context) => {
      try {
        console.log("ChatID: ", context.params.chatId);
        const chatID = context.params.chatId;
        const doc = await db.collection("chats").doc(chatID).get();
        const chat: Chat = Chat.fromJson(doc.data());
        console.log("CHAT: ", chat.toJson());
      } catch (e) {
        console.log("Error: ", e);
      }
    });
