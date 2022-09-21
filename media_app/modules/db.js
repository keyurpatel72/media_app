const  mongoose = require('mongoose');
const {MONGODB_URL}  = require('../config')
console.log(MONGODB_URL);
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('successfull');
}).catch((error) => {
    console.log(error);
});