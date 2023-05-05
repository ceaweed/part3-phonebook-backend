const mongoose = require('mongoose')

console.log(process.argv.length)

if (process.argv.length !== 5 && process.argv.length !== 3) {
    console.log('Incorrect number of parameters')
    process.exit(1)
}

let password = '';
let name = '';
let number = '';

if (process.argv.length === 3) {
    password = process.argv[2]
} else if (process.argv.length === 5) {
    password = process.argv[2]
    name = process.argv[3]
    number = process.argv[4]
}

const url = `mongodb+srv://fullstack:${password}@cluster0.qab6pyr.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

//Code for creating and saving a new Person
if (process.argv.length === 5) {
    const person = new Person({
        name: name,
        number: number,
    })
    
    person.save().then(result => {
        console.log('person saved!')
        mongoose.connection.close()
    })
}


// Code for people from MongoDB
if (process.argv.length === 3) {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}
