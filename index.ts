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
type InsertData = {
  name: string;
  DOB: string;
  email: string;
  address: string;
};
async function InsertFunction(
  connection: mysql.PoolConnection,
  data: InsertData
) {
  const rawData = { ...data };
  const DOB = rawData.DOB;
  const name = rawData.name;
  const email = rawData.email;
  const address = rawData.address;
  const insertSql = `
    INSERT INTO ${tableName} (
        \`Name\`, 
        \`Email\`, 
        \`D.O.B\`, 
        \`Address\`
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
async function DeleteFunction(connection: mysql.PoolConnection, deleteID: number) {
  const deleteSql = `
    DELETE FROM ${tableName} WHERE \`ID\` = "${deleteID}"`;
  try {
    await runQuery(connection, "delete", deleteSql);
  } catch (err) {
    consoleDir(err as Error);
  }
}
async function UpdateFunction(
  connection: any,
  updateData: {
    InternId: string;
    InternName: string;
    InternDOB: string;
    InternEmail: string;
    InternAddress: string;
  }
) {
  const updateSql = `
    UPDATE ${tableName}
    SET
      \`Name\` = "${updateData.InternName}",
      \`D.O.B\` = "${updateData.InternDOB}",
      \`Email\` = "${updateData.InternEmail}",
      \`Address\` = "${updateData.InternAddress}"
    WHERE \`ID\` = "${+updateData.InternId}"`;
  try {
    await runQuery(connection, "update", updateSql);
  } catch (err) {
    console.error(err as Error);
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
  let connection:any;

  try {
    const pool = mysql.createPool(process.env.DATABASE_URL!);
    connection = await pool.getConnection();
    
    await runQuery(connection, "select", selectSql);
    await runQuery(connection, "count", countSql);
    
    
    
    while (true) {
      console.log("1. Insert Intern Data");
      console.log("2. Update Intern Data");
      console.log("3. Delete Intern Data");
      console.log("4. Quit ");
      const op = await readChar("Enter your choice:");

      switch (op) {
        case "1": {
          const insertData = await insertInternData();
          await InsertFunction(connection, insertData);
          break;
        }
        case "2": {
          const updateData = await updateInternData();
          await UpdateFunction(connection, updateData);
          break;
        }
        case "3": {
          const deleteID = await deleteInternId();
          await DeleteFunction(connection, deleteID);
          break;
        }
        case "4": {
          console.log("Exiting....");
          process.exit(0);
        }
        default: {
          console.log(`Invalid Choice ${op}\nEnter Valid choice`);
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
  finally {
    if (connection) {
      connection.release();
    }
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

async function updateInternData(){
  const InternId = await readLine("Enter Intern  Id: ");
  const InternDOB = await readLine("Enter  Updated Intern  D.O.B: ");
  const InternEmail = await readLine("Enter  Updated Intern  Email-ID: ");
  const InternAddress = await readLine("Enter  Updated Intern  Address: ");
  const InternName = await readLine("Enter  Updated Intern  Name: ");
  return {
InternId,
InternName,
InternDOB,
InternEmail,
InternAddress
  }
}

async function deleteInternId(): Promise<number> {
  const InternId = await readLine("Enter Intern  Id: ");
  return +InternId;
}





