const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

console.log("connecting to MongoDB", process.env.MONGODB_URI);

mongoose
  .connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(result => {
    console.log('connected to MongoDB');
  })
  .catch(error => {
    console.log('error connecting to MongoDB', error);
  });

const personSchema = mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Person', personSchema);