import { test, expect, describe, beforeAll } from "vitest";
import { MYSQLAdapter } from "./sqldb";
import { AppEnvs } from "./read-env";
import {
  SimpleWhereExpression,
  OrWhereExpression,
  WhereExpression,
} from "./types";
import { IBook } from "./src/books/model/book.model";
import { MySqlQueryGenerator } from "./mysql-query-generator";
import { afterEach, beforeEach } from "node:test";
// describe("my sql db ", () => {
//   let mysqlAdapter: MYSQLAdapter;
//   mysqlAdapter = new MYSQLAdapter({ dbURL: AppEnvs.DATABASE_URL });
//   beforeEach(async () => {
//     await mysqlAdapter.loadEnvFile();
//   });
//   afterEach(async () => {
//     await mysqlAdapter.shutDown();
//   });
//   test("run a select on books table", async () => {
//     const authOrTotalAndPubCopies: WhereExpression<IBook> = {
//       OR: [
//         {
//           author: {
//             op: "CONTAINS",
//             value: "Sudha Murthy",
//           },
//           publisher: {
//             op: "EQUALS",
//             value: "Penguin UK",
//           },
//         },
//         {
//           totalCopies: {
//             op: "GREATER_THAN",
//             value: 5,
//           },
//         },
//       ],
//     };
//     const selectString = MySqlQueryGenerator.generateSelectSql(
//       "books",
//       [],
//       authOrTotalAndPubCopies,
//       0,
//       10
//     );
//     const result = await mysqlAdapter.runQuery(selectString);
//     console.log(result);
//   });
// });
describe("sql db adapter tests", () => {
  let mySQLAdapter: MYSQLAdapter;
  beforeAll(async () => {
    mySQLAdapter = new MYSQLAdapter({
      dbURL: AppEnvs.DATABASE_URL,
    });
    await mySQLAdapter.loadEnvFile();
  });
  test("run a select on books table", async () => {
    const authOrTotalAndPubCopies: WhereExpression<IBook> = {
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
      ],
    };
    const authorClause: SimpleWhereExpression<IBook> = {};
    const selectByAuthorClause = MySqlQueryGenerator.generateSelectSql<IBook>(
      "books",
      [],
      authOrTotalAndPubCopies,
      0,
      10
    );
    console.log(selectByAuthorClause);
    let result: Promise<IBook> = (await mySQLAdapter.runQuery(
      selectByAuthorClause
    )) as unknown as Promise<IBook>;
    console.log(result);
  });
});
