import mysql from "mysql2/promise"
import { loadEnvFile } from "process";
interface DBConfig{
    dbURL: string;
}

export class MYSQLAdapter {
    private pool: mysql.Pool | null = null;
    private connection: mysql.PoolConnection | null = null;
    constructor(private readonly config: DBConfig) { }
async loadEnvFile(){
    this.pool = mysql.createPool(this.config.dbURL);
    this.connection = await this.pool.getConnection();
}
    async shutdown() {
        this.connection?.release()
        this.pool?.releaseConnection
        this.pool,this.connection = null,null;

    }    
    async runQuery(sql:string):Promise<mysql.QueryResult> {
        if (this.connection) {
            const [result] = await this.connection?.query(sql);
            return result; 
        }
        else {
            throw new Error("Fuxk off sd not ready for connection");
        }
        
    }

    }
