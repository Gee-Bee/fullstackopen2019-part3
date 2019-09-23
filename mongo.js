const mongoose = require('mongoose');

if ( process.argv.length !== 3 && process.argv.length !== 5 ) {
  console.log('Usage - arguments:')
  console.log('  <mongodb password> - display all entries');
  console.log('  <mongodb password> <entry name> <entry number> - add new entry');
  process.exit(1);
}

const password = process.argv[2];

const url =
  `mongodb+srv://fullstack:${password}@cluster0-9sasw.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const personSchema = mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model('Person', personSchema)

const listPeople = () => {
  Person
    .find({})
    .then(result => {
      mongoose.connection.close();
      console.log('phonebook:');
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`);
      })
    });
};

const addPerson = (obj) => {
  new Person(obj)
    .save()
    .then(result => {
      mongoose.connection.close();
      console.log(`added ${result.name} number ${result.number} to phonebook`);
    });
};

if ( process.argv.length === 3 ) {
  listPeople();
}

if ( process.argv.length === 5 ) {
  const name = process.argv[3]
  const number = process.argv[4]
  addPerson({ name, number });
}