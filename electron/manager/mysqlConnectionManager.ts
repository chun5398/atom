import { MySqlConnection } from "../service/connect/msyqlConnection";
import { Resp } from "./types/common";

export class MySqlConnetionManager {
    mysqlConnectionMap: Map<string, MySqlConnection> = new Map();
    constructor() {}

    async createMySqlConnection(args: { connectionName: string }): Promise<Resp<null> | undefined> {
        try {
            const mysqlConnection = new MySqlConnection({
                host: "127.0.0.1",
                port: 3306,
                user: "root",
                password: "root",
            });
            await mysqlConnection.connect();
            if (mysqlConnection && mysqlConnection.conn) {
                this.mysqlConnectionMap.set(args.connectionName, mysqlConnection);
            } else {
                return {
                    err: new Error("新建 Mysql Connection 失败"),
                    data: null,
                };
            }
        } catch (error) {
            return {
                err: error,
                data: null,
            };
        }
    }

    getMySqlConnection(connectionName: string) {
        console.log("getMySqlConnection", connectionName);
        
        if (this.mysqlConnectionMap.has(connectionName)) {
            return this.mysqlConnectionMap.get(connectionName);
        }
        throw new Error("未找到对应名字链接");
    }
}
