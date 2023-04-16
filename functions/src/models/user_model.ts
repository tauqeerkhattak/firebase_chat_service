export class UserModel {
  name?: string;
  email?: string;
  uid?: string;
  token?: string;

  static fromJson(json: any): UserModel {
    return Object.assign(new UserModel(), json);
  }

  toJson(): any {
    return JSON.stringify(this);
  }
}
