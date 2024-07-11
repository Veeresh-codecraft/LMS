export interface IUserBase {
  // immutable data which has to kept safe
  name: string;
  DOB: string;
  phone: number;
  address: string;
  age: number;
}

export interface IUser extends IUserBase {
  UId: number;
  //   numOfBooksIssued: number;
  //   booksIssued: String[];
}
