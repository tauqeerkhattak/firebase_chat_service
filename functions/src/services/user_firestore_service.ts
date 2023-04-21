import {UserModel} from "../models/user_model";
import {db} from "./admin";

export class UserFirestoreService {
  async getUserByUid(uid: string): Promise<UserModel | null> {
    try {
      const doc = await db.collection("users").doc(uid).get();
      const data = doc.data();
      if (data != null) {
        return UserModel.fromJson(data);
      }
      return null;
    } catch (e) {
      console.log("Exception getting current user: ", e);
      return null;
    }
  }
}
