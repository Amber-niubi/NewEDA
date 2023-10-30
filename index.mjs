import mysql from 'mysql';
import express from 'express';

let connection = mysql.createConnection({
  host: 'localhost',
  user: '1ccode',
  password: '1ccode666',
  database: '1ccode'
})

connection.connect(err=>{
  console.log(err,'数据库连接成功');
})


connection.end()


const app = express()
const port = 3000
app.use('/', express.static('./'));
app.get('/', (req, res) => {
  res.send('OK')
})

app.listen(port, () => {
  console.log('open link ======')
  console.log(`http://localhost:${port}`)
  
})