export class UserModel {
  name: string;
  email: string;
  uid: string;
  token: string;
  
  constructor(name: string, email: string, uid: string, token: string) {
    this.name = name;
    this.email = email;
    this.uid = uid;
    this.token = token;
  }

  static fromJson(json: any): UserModel {
    return new UserModel(
        json["name"],
        json["email"],
        json["uid"],
        json["token"],
    );
  }

  toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
