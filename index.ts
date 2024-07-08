import "dotenv/config";
import mysql from "mysql2/promise";
import { readLine, readChar } from "./input.utils";

function consoleDir(param: any) {
  console.dir(param, {
    showHidden: false,
    depth: null,
    colors: true,
  });
}
const tableName = "`trainees`";
const selectSql = `
    SELECT * FROM ${tableName}
`;
const countSql = `
    SELECT COUNT(*) AS \`count\` FROM ${tableName}
`;
const insertSql = `
    INSERT INTO ${tableName} (
        \`name\`, 
        \`email\`, 
        \`dob\`, 
        \`address\`
    ) VALUES (
        'Krishanu',
        'krishanu@codecraft.co.in',
        '1990-09-21',
        'Kolkata, West Bengal'
    )
`;

const updateSql = `
    UPDATE ${tableName} SET
        \`name\` = 'Krishanu Dey',
        \`address\` = 'Berhampore, Murshidabd, West Bengal'
    WHERE 
        \`email\` = "krishanu@codecraft.co.in"
`;

const deleteSql = `
    DELETE FROM ${tableName} WHERE \`email\` = "krishanu@codecraft.co.in" AND \`name\` = "Krishanu Dey"
`;
type InsertData = {
  name: string;
  DOB: string;
  email: string;
  address: string;
};
async function InsertFunction(
  connection: mysql.PoolConnection,
  data: InsertData
): Promise<T> {
  const rawData = { ...data };
  const DOB = rawData.DOB;
  const name = rawData.name;
  const email = rawData.email;
  const address = rawData.address;
  const insertSql = `
    INSERT INTO ${tableName} (
        \`name\`, 
        \`email\`, 
        \`dob\`, 
        \`address\`
    ) VALUES (
        '${name}',
        '${email}',
        '${DOB}',
        '${address}'
    )
`;
  try {
    await runQuery(connection, "insert", insertSql);
  } catch (err) {
    consoleDir(err as Error);
  }
}

async function runQuery(
  connection: mysql.PoolConnection,
  label: string,
  sql: string
) {
  try {
    console.log(`---${label.toUpperCase()} RESULT---`);
    const [result] = await connection.query(sql);
    consoleDir(result);
    console.log("\n\n\n");
  } catch (err) {
    consoleDir(err);
  }
}

async function main() {
  try {
    const pool = mysql.createPool(process.env.DATABASE_URL!);
    const connection = await pool.getConnection();
    const insertData = await insertInternData();
    const updateData = await updateInternData();
    const deleteId = await deleteInternId();
    await runQuery(connection, "select", selectSql);
    await runQuery(connection, "count", countSql);

    await runQuery(connection, "select", selectSql);
    await runQuery(connection, "count", countSql);

    await runQuery(connection, "update", updateSql);
    await runQuery(connection, "select", selectSql);
    await runQuery(connection, "count", countSql);

    await runQuery(connection, "delete", deleteSql);
    await runQuery(connection, "select", selectSql);
    await runQuery(connection, "count", countSql);

    connection.release();
    pool.end();
  } catch (err) {
    consoleDir(err);
  }
  while (true) {
    console.log("1. Insert Intern Data");
    console.log("2. Update Intern Data");
    console.log("3. Delete Intern Data");
    console.log("4. Quit ");
  }
}

main();
async function insertInternData(): Promise<InsertData> {
  const InternName = await readLine("Enter Intern  name: ");
  const InternDOB = await readLine("Enter Intern  DOB: ");
  const Internemail = await readLine("Enter Intern  email address: ");
  const InternAddress = await readLine("Enter Intern  address: ");
  return {
    name: InternName,
    DOB: InternDOB,
    email: Internemail,
    address: InternAddress,
  };
}

async function updateInternData() {
  throw new Error("Function not implemented.");
}

async function deleteInternId(): Promise<number> {
  const InternId = await readLine("Enter Intern  Id: ");
  return +InternId;
}
