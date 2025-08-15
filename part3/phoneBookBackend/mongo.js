const mongoose = require('mongoose')

if (process.argv.length < 2) {
  console.log('give pw as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullStackPhoneApp:${password}@cluster0.hkb9zch.mongodb.net/phoneBookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Entry = mongoose.model('Entry', phoneBookSchema)

const entry = new Entry({
  name:process.argv[3],
  number:process.argv[4],
})

if (process.argv.length === 5) {
  entry.save().then(() => {
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
  })
}

if (process.argv.length === 3) {
  Entry.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(entry => console.log(`${entry.name} ${entry.number}`))
    mongoose.connection.close()
  })
}