const { response, json } = require('express')
const express = require('express')
const app = express()
const uuid = require('uuid')
const morgan = require('morgan')

app.use(express.json())

morgan.token('body', (req, res) => console.log(JSON.stringify(req.body)));	
app.use(morgan(":method :url :status :response-time ms :body"))


let persons = [
    {
      name: "Arto Hellas",
      number: "040-123456",
      id: 1
    },
    {
      name: "Ada Lovelace",
      number: "39-44-5323523",
      id: 2
    },
    {
      name: "Dan Abramov",
      number: "12-43-234345",
      id: 3
    },
    {
      name: "Mary Poppendieck",
      number: "39-23-6423122",
      id: 4
    }
  ]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/info', (req,res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p> `)
})

app.get('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => id === person.id)

    if(person) {
        res.json(person)
    } else {
        res.status(404).send('person not found')
    } 
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => id === person.id)
    if(person){
        const index = persons.indexOf(person)
        persons.splice(index, 1)
        res.json(persons)
    } else {
        res.status(404).send('person not found')
    } 

})

app.post('/api/persons', (req, res) => {
    //console.log(req.body)
    const {name, number} = req.body

    if(!name || !number){
        return res.json({error: "The name or number is missing"})
    } else if (persons.find(per => per.name === name)){
        return res.json({error: "The name must be unique"})
    } else if (persons.find(per => per.number === number)){
        return res.json({error: "The number must be unique"})
    } 
        persons = persons.concat({name: name, number: number, id: uuid.v1()})
        //console.log(persons)
        return res.json(persons)
    })



const PORT = 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})