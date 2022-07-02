import React, { useEffect, useState } from "react";
import AppBar from "./AppBar";

export enum ConnectionStatus {
    DISCONNECT,
    CONNECTING,
    CONNECTED,
}
export interface MysqlData {
    status: ConnectionStatus;
    databases: any[];
}

function App() {
    const [isOpen, setOpen] = useState(false);
    const [isSent, setSent] = useState(false);
    const [fromMain, setFromMain] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>("");

    const [mysqlData, setMysqlData] = useState<MysqlData>({
        status: ConnectionStatus.DISCONNECT,
        databases: [],
    });

    const handleToggle = () => {
        if (isOpen) {
            setOpen(false);
            setSent(false);
        } else {
            setOpen(true);
            setFromMain(null);
        }
    };
    const handleCreateMysqlConnection = async () => {
        if (window.Main) {
            const data = await window.Main.createMysqlConnection({
                connectionName: Date.now().toString(),
            });
            console.log(data);
            
        } else {
            setStatusMessage("You are in a Browser, so no Electron functions are available");
        }
    };
    const handleCreateRedisConnection = () => {};

    const sendMessageToElectron = () => {
        if (window.Main) {
            window.Main.sendMessage("Hello I'm from React World");
        } else {
            setFromMain("You are in a Browser, so no Electron functions are available");
        }
        setSent(true);
    };

    useEffect(() => {
        if (isSent && window.Main)
            window.Main.on("message", (message: string) => {
                setFromMain(message);
            });
    }, [fromMain, isSent]);

    useEffect(() => {
        if (window.Main) {
            window.Main.on("server_error", (message: string) => {
                setStatusMessage(message);
            });
            window.Main.on("create_mysql_connection", (data: MysqlData) => {
                setMysqlData(data);
            });
        }
    }, []);

    return (
        <div className="flex flex-col h-screen divide-y divide-gray-900">
            {window.Main && (
                <div className="flex-none">
                    <AppBar />
                </div>
            )}
            <div className="flex-auto ">
                <div className="flex flex-column justify-center items-center h-full bg-gray-800 space-y-4">
                    <div className="flex flex-col text-gray-200 text-lg p-3 h-full">
                        <button
                            className="flex-none bg-blue-500 p-1 rounded-full text-xs"
                            onClick={handleCreateMysqlConnection}
                        >
                            Create Mysql Connection
                        </button>
                        <div className="flex-grow text-base my-1 overflow-scroll-y text-lg">
                            <div className="mb-1">
                                <p>当前连接数</p>
                            </div>
                            <div className="mb-1">
                                <p>当前连接状态：</p>
                                {mysqlData?.status}
                            </div>
                            <div className="mb-1">
                                <p>当前库列表：</p>
                                {mysqlData?.databases
                                    ? mysqlData.databases.map((item: { Database: string }, index) => {
                                          return <div key={index}>{item.Database}</div>;
                                      })
                                    : "暂无"}
                            </div>
                        </div>
                    </div>
                    <div className="flex-grow text-gray-200 h-full pl-0 py-3 pr-3 p-3 bg-gray-700">123</div>
                </div>
            </div>

            <div className="h-4 px-3 bg-gray-800">{statusMessage}</div>
        </div>
    );
}

export default App;
