import 'dotenv/config'
import mysql from 'mysql2'

const dbConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'bedatabase'
}
);

// dbConnection.connect(function(err) {
//     if (err) {
//         console.error('something went wrong：' + err.message);
//         return;
//     }
//     console.log('connect database！');
//
//     //disconnect DB
//     dbConnection.end();
// });

export default dbConnection;