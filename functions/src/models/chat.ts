import {UserModel} from "./user_model";

export class Chat {
  chatId?: string;
  members?: UserModel[];
  memberUids?: string[];

  static fromJson(json: any): Chat {
    return Object.assign(new Chat(), json);
  }

  toJson(): any {
    return JSON.stringify(this);
  }
}
