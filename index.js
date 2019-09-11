const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/info', (req, res) => {
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `)
})

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);
  res.status(204).end();
});

const generateId = () => {
  const limit = 100;
  if (persons.length >= limit) {
    throw new Error("Too many people");
  }
  let generatedId;
  do {
    generatedId = Math.floor(Math.random() * limit) + 1;
  } while (persons.some(p => p.id === generatedId))
  return generatedId;
}

app.post('/api/persons', (req, res) => {
  const name = req.body.name;
  const number = req.body.number;

  let errors = [];
  if (!name) errors.push('name missing');
  if (!number) errors.push('number missing');
  if (persons.some(p => p.name === name))
    errors.push('name must be unique');
  if (errors.length)
    return res.status(400).json({ error: errors });

  let id;
  try { id = generateId(); } catch (err) {
    return res.status(406).json({ error: err.message })
  }
  const person = {
    name: name,
    number: number,
    id: id,
  };
  persons = persons.concat(person);
  res.status(201).send(person);
});

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
];

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});