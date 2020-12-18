const { response, json } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const { Person } = require('./models/people.js')


app.use(express.json())
app.use(cors())
app.use(express.static('build')) 

morgan.token('body', (req, res) => console.log(JSON.stringify(req.body)));	
app.use(morgan(":method :url :status :response-time ms :body"))




app.get('/api/persons', async (req, res, next) => {
    try {
        const people = await Person.find({})
        res.json(people)
    } catch (err) {
        next(err)
    }
})

app.get('/api/info', async (req,res, next) => {
    
    try {
        const people = await Person.find({})
        res.send(`<p>Phonebook has info for ${people.length} people</p> `)
    } catch(err){
        next(err)
    }

})

app.get('/api/persons/:id', async (req,res, next) => {
    try {
            const personFound = await Person.findById(req.params.id)
            if(personFound){
                res.json(personFound)
            } else (
                res.status(404).end()
            )
     }   
    catch (err) {
            next(err)
     }

})

app.delete('/api/persons/:id', async (req, res, next) => {
    
    try {
            const personFound = await Person.findById(req.params.id)
            if(personFound){
                await Person.findByIdAndDelete(req.params.id)
                res.status(204).end()
            } else (
                res.status(404).end()
            )
     }   
    catch (err) {
            next(err)
     }
})


app.post('/api/persons', async (req, res, next) => {
    try{
        const {name, number} = req.body
        if(!name || !number){
            return res.json({error: "The name or number is missing"})
        }
    
        const person = new Person({
            name, number
        })
            const savedPerson = await person.save()
            return res.json(savedPerson)
        }
     catch (err){
        next(err)
    }
})


app.put('/api/persons/:id', async (req, res, next) => {
    
    try {
            const personFound = await Person.findById(req.params.id)
            const newPerson = {
                name: req.body.name,
                number: req.body.number
            }

            if(personFound){
                const updatedPerson = await Person.findByIdAndUpdate(req.params.id, newPerson, {new: true})
                res.json(updatedPerson)
            } else (
                res.status(404).end()
            )
     }   
    catch (err) {
            next(err)
     }
})


app.use((req, res) => {
        res.status(404).send({ error: 'unknown endpoint' })
    })


app.use((err, req, res, next) => {
     const { status = 500, message = 'Something went wrong', name} = err;
    if (name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
        } 

    res.status(status).send(message)
    next(err)
 })

    



    const PORT = process.env.PORT || 3001
    app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
    })


