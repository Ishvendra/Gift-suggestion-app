const mongoose = require('mongoose')
const db = process.env.DATABASE;

mongoose.connect(db, {useNewUrlParser: true}).then(()=>{
    console.log(`DB connection successful`);
}).catch((err)=>{
    console.log(`Error in DB connection- ${err}`);
})