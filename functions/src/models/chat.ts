import {UserModel} from "./user_model";

export class Chat {
  chatId: string;
  members: UserModel[];
  memberUids: string[];
  
  constructor(chatId: string, members: UserModel[], memberUids: string[]) {
    this.chatId = chatId;
    this.members = members;
    this.memberUids = memberUids;
  }

  static fromJson(json: any): Chat {
    const members = json["members"].map((member: any) => {
      return UserModel.fromJson(member);
    });
    return new Chat(
        json["chatId"],
        members,
        json["memberUids"],
    );
  }

  toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }

  getOtherMember(authorUid: string): UserModel {
    const members = this.members?.filter((member) => {
      return member.uid !== authorUid;
    });
    return members[0];
  }

  getMe(authorUid: string): UserModel {
    const members = this.members?.filter((member) => {
      return member.uid == authorUid;
    });
    return members[0];
  }
}
