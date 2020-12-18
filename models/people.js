require('dotenv').config()
const mongoose = require('mongoose');
const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
.then(result => console.log('connected to MongoDB'))
.catch(error => console.log('error connecting to MongoDB:', error.message))

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', personSchema)

// let persons = [
//     {
//       name: "Arto Hellas",
//       number: "040-123456",
//     },
//     {
//       name: "Ada Lovelace",
//       number: "39-44-5323523",
//     },
//     {
//       name: "Dan Abramov",
//       number: "12-43-234345",
//     },
//     {
//       name: "Mary Poppendieck",
//       number: "39-23-6423122",
//     },
//     {
//         name: "Laura Otter",
//         number: "0000-sweetheart",
//       }
//   ]

// Person.insertMany(persons).then(result => {
//     console.log(result)
//     mongoose.connection.close()
// })

module.exports = { Person }




