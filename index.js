const { response, json } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const { Person } = require('./models/people.js')


app.use(cors())
app.use(express.json())
app.use(express.static('build')) 

morgan.token('body', (req, res) => console.log(JSON.stringify(req.body)));	
app.use(morgan(":method :url :status :response-time ms :body"))




app.get('/api/persons', async (req, res, next) => {
    
        const people = await Person.find({})
        return res.json(people)
   
})

app.get('/api/info', async (req,res, next) => {
    
    try {
        const people = await Person.count({})
        res.send(`<p>Phonebook has info for ${people} people</p> `)
    } catch(error){
        next(error)
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
    catch (error) {
            next(error)
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
    catch (error) {
            next(error)
     }
})


app.post('/api/persons', async (req, res, next) => {
    try{
        const {name, number} = req.body
        if(!name || !number){
             res.status(400).json({error: "The name or number is missing"})
        }
    
        const person = new Person({
            name: name, number:number
        })
        
            const savedPerson = await person.save()
            res.send(savedPerson)
        }
     catch (error){
        next(error)
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
    catch (error) {
            next(error)
     }
})



app.use((req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
})

app.use((error, req, res, next) => {
    const { message = 'Something went wrong'} = error;
     if (error === 'CastError' && err == 'ObjectId') {
         res.status(400).json({ error: 'malformatted id' })
    } else if (error === 'ValidationError') {
         res.status(400).json({ error: message })
    }
    next(error)
 })



    



    const PORT = process.env.PORT || 3001
    app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
    })


