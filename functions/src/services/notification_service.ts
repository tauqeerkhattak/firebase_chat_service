import {fcm} from "./admin";


export class NotificationService {
  async sendNotification(title: string, body: string, token: string):
    Promise<boolean> {
    try {
      await fcm.send({
        notification: {
          title: title,
          body: body,
        },
        token: token,
      });
      return true;
    } catch (e) {
      console.log("Error: ", e);
      return false;
    }
  }
}
