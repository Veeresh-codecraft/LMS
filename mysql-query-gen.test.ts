import { describe, test, expect } from "vitest";
import { MySqlQueryGenerator } from "./mysql-query-generator";
import {
  OrWhereExpression,
  SimpleWhereExpression,
  WhereExpression,
} from "./types";
import { IBook } from "../LMS/src/books/model/book.model";
import { it } from "node:test";
// import { IUserBase } from "../src/user-management/models/user.model";
// describe("MySqlQueryGenerator", () => {
// test("should generate a INSERT SQL statement", () => {
//   const tableName = "users";
//   const row: IUserBase = {
//     name: "Tejas",
//     phone: "9123456789",
//     address: "Mangalore, Karnataka",
//   };
//   const expectedSql = `INSERT INTO users (\`name\`, \`age\`, \`phone\`, \`address\`) VALUES ("Tejas", 21, "9123456789", "Mangalore, Karnataka")`;
//   const sql = MySqlQueryGenerator.generateInsertSql<IUser>(tableName, row);
//   expect(sql.trim()).toBe(expectedSql);
// });
// test("should generate a UPDATE SQL statement", () => {
//   const tableName = "users";
//   const row: Partial<IUser> = {
//     name: "Tejas Prabhu",
//     address: "Mangalore, DK, Karnataka",
//   };
//   const where: WhereExpression<IUser> = {
//     phone: { op: "EQUALS", value: "9123456789" },
//   };
//   const expectedSql = `UPDATE users SET \`name\` = "Tejas Prabhu", \`address\` = "Mangalore, DK, Karnataka" WHERE \`phone\` = "9123456789"`;
//   const sql = MySqlQueryGenerator.generateUpdateSql(tableName, row, where);
//   expect(sql.trim()).toBe(expectedSql);
// });
// test("should generate a DELETE SQL statement", () => {
//   const tableName = "users";
//   const where: WhereExpression<IUser> = {
//     name: { op: "EQUALS", value: "Tejas" },
//     phone: { op: "EQUALS", value: "9123456789" },
//   };
//   const expectedSql = `DELETE FROM users WHERE \`name\` = "Tejas" AND \`phone\` = "9123456789"`;
//   const sql = MySqlQueryGenerator.generateDeleteSql(tableName, where);
//   expect(sql.trim()).toBe(expectedSql);
// });
// test("should generate a SELECT SQL statement", () => {
//   const tableName = "users";
//   const fieldsToSelect: Array<keyof Partial<IUser>> = ["name", "age"];
//   const where: WhereExpression<IUser> = {};
//   const offset = 0;
//   const limit = 5;
//   const expectedSql = `SELECT name, age FROM users LIMIT 5 OFFSET 0`;
//   const sql = MySqlQueryGenerator.generateSelectSql<IUser>(
//     tableName,
//     fieldsToSelect,
//     where,
//     offset,
//     limit
//   );
//   expect(sql.trim()).toBe(expectedSql);
// });
// test("should generate a COUNT SQL statement", () => {
//   const tableName = "users";
//   const where: WhereExpression<IUser> = {};
//   const expectedSql = `SELECT COUNT(*) AS \`count\` FROM users`;
//   const sql = MySqlQueryGenerator.generateCountSql<IUser>(tableName, where);
//   expect(sql.trim()).toBe(expectedSql);
// });
// test("should return the WHERE clause for conditions supplied as params", () => {
//   const conditions = [
//     {
//       name: { op: "EQUALS", value: "Tejas" },
//       phone: { op: "EQUALS", value: "9123456789" },
//     },
//     {
//       age: { op: "GREATER_THAN", value: "15" },
//     },
//   ];
// });
// });
describe("test on sql generator with quering on books", () => {
  const authorClause: SimpleWhereExpression<IBook> = {
    author: {
      op: "CONTAINS",
      value: "Sudha Murthy",
    },
  };
  const authAndPublisher: SimpleWhereExpression<IBook> = {
    author: {
      op: "CONTAINS",
      value: "Sudha Murthy",
    },
    publisher: {
      op: "EQUALS",
      value: "Penguin UK",
    },
  };
  const authAndPublisherOrCopies: OrWhereExpression<IBook> = {
    OR: [
      {
        author: {
          op: "CONTAINS",
          value: "Sudha Murthy",
        },
        publisher: {
          op: "EQUALS",
          value: "Penguin UK",
        },
      },
      {
        totalNumberOfCopies: {
          op: "GREATER_THAN_EQUALS",
          value: 10,
        },
      },
    ],
  };
  const authorTotalCopies: OrWhereExpression<IBook> = {
    OR: [
      {
        author: {
          op: "EQUALS",
          value: "SUDHA MURTHY",
        },
      },
      {
        totalNumberOfCopies: {
          op: "GREATER_THAN",
          value: 15,
        },
      },
    ],
  };
  test("where clause generator", () => {
    //author like Sudha Murthy
    const queryStr =
      MySqlQueryGenerator.generateWhereClauseSql<IBook>(authorClause);
    expect(queryStr).toEqual('(`author`  LIKE  "%Sudha Murthy%")');
    
    const authAndPublisherQuery =
      MySqlQueryGenerator.generateWhereClauseSql<IBook>(authAndPublisher);
    expect(authAndPublisherQuery).toEqual(
      '(`author`  LIKE  "%Sudha Murthy%" AND `publisher`  =  "Penguin UK")'
    );
    
    const authAndPublisherOrCopiesQuery =
      MySqlQueryGenerator.generateWhereClauseSql<IBook>(
        authAndPublisherOrCopies
      );
    expect(authAndPublisherOrCopiesQuery).toEqual(
      '((`author`  LIKE  "%Sudha Murthy%" AND `publisher`  =  "Penguin UK") OR (`totalNumberOfCopies`  >=  10))'
    );

        const authorTotalCopiesQuery =
          MySqlQueryGenerator.generateWhereClauseSql<IBook>(authorTotalCopies);
        expect(authorTotalCopiesQuery).toEqual(
          '((`author`  =  "SUDHA MURTHY") OR (`totalNumberOfCopies`  >  15))'
        );
  });
  test("select clause gen", () => {
    const selectByAuthor=MySqlQueryGenerator.generateSelectSql<IBook>('books', [], authorClause, 0, 10);
    expect(selectByAuthor).toEqual('SELECT * FROM books WHERE (`author`  LIKE  "%Sudha Murthy%") LIMIT 10 OFFSET 0');
    
    const selectauthAndPublisherOrCopies = MySqlQueryGenerator.generateSelectSql<IBook>(
      "books",
      [],
      authAndPublisherOrCopies,
      0,
      10
    );
    expect(selectauthAndPublisherOrCopies).toEqual(
      'SELECT * FROM books WHERE ((`author`  LIKE  "%Sudha Murthy%" AND `publisher`  =  "Penguin UK") OR (`totalNumberOfCopies`  >=  10)) LIMIT 10 OFFSET 0'
    );
  
  });
});
