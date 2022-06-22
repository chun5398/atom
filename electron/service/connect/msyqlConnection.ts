import * as mysql from "mysql2";
import { BaseConnection } from "./baseConnection";

export class MySqlConnection extends BaseConnection {
    private conn: mysql.Connection;
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
        this.conn = mysql.createConnection({
            ...connectionConfig,
            typeCast: (field: any, _next: () => void) => {
                const buf = field.buffer();
                if (field.type == "BIT") {
                    return this.bitToBoolean(buf);
                }
                return buf?.toString();
            },
        } as mysql.ConnectionOptions);
        console.log("123, 456", this.conn);
    }

    bitToBoolean(buf: Buffer): any {
        return buf ? buf[0] == 1 : null;
    }
}
