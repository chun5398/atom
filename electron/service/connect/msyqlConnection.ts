import * as mysql from "mysql2/promise";
import { BaseConnection } from "./baseConnection";

export class MySqlConnection extends BaseConnection {
    conn: mysql.Connection | undefined;
    private config:
        | {
              host?: string;
              port?: number;
              user?: string;
              password?: string;
              database?: string;
              timezone?: string;
              connectTimeout?: string;
          }
        | undefined;
    constructor(connectionConfig: {
        host?: string;
        port?: number;
        user?: string;
        password?: string;
        database?: string;
        timezone?: string;
        connectTimeout?: string;
    }) {
        super();
        this.config = connectionConfig;
    }

    async connect() {
        try {
            this.conn = await mysql.createConnection({
                ...this.config,
                typeCast: (field: any, _next: () => void) => {
                    const buf = field.buffer();
                    if (field.type == "BIT") {
                        return this.bitToBoolean(buf);
                    }
                    return buf?.toString();
                },
            } as mysql.ConnectionOptions);
            await this.conn.connect();
        } catch (error) {
            console.log("catch error: ", error);
        }
    }

    bitToBoolean(buf: Buffer): any {
        return buf ? buf[0] == 1 : null;
    }

    async listDatabases() {
        const databases = await this.conn?.query("show DATABASES;");
        return databases?.[0];
    }
}
