
import express from 'express';




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