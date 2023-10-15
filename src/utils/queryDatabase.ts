import {RowDataPacket} from "mysql2";
import dbConnection from "../loader/dbConnect";


// Convert callback-based query to a Promise-based one
const QueryDatabase = (query: string, values: any[]): Promise<RowDataPacket[]> => {
    return new Promise((resolve, reject) => {
        dbConnection.query(query, values, (err, results: RowDataPacket[]) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

export default QueryDatabase;