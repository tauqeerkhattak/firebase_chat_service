import {UserModel} from "./user_model";

export class Chat {
  chatId?: string;
  members?: UserModel[];
  memberUids?: string[];

  static fromJson(json: any): Chat {
    return Object.assign(new Chat(), json);
  }

  toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }

  getOtherMember(authorUid: string): UserModel {
    const members = this.members?.filter((member) => {
      return member.uid !== authorUid;
    });
    return members![0];
  }
}
