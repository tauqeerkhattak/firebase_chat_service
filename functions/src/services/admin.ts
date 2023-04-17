import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import * as admin from "firebase-admin";

const app = initializeApp();
export const db = getFirestore(app);
export const fcm = admin.messaging();
