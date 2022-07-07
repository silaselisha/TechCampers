const fs = require('fs')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const colors = require('colors/safe')
dotenv.config({path: '../../config/config.env'})

const Bootcamp = require('../../models/Bootcamps')
const Course = require('../../models/Courses')
const User = require('../../models/Users')
const Review = require('../../models/Reviews')

const database = process.env.DATABASE_URI.replace('<password>', process.env.DATABASE_PASSWORD)

mongoose.connect(database, {})
    .then(() => {
        console.log(colors.america('Database successfully connected...'))
    })
    .catch((err) => {
        console.log(err.message)
    })

const data = JSON.parse(fs.readFileSync('../bootcamps.json', 'utf-8'))
const data1 = JSON.parse(fs.readFileSync('../courses.json', 'utf-8'))
const data2 = JSON.parse(fs.readFileSync('../users.json', 'utf-8'))
const data3 = JSON.parse(fs.readFileSync('../reviews.json', 'utf-8'))

// IMPORT DATA
const importData = async () => {
    try {
        await Bootcamp.create(data)
        await Course.create(data1)
        await User.create(data2)
        await Review.create(data3)
        console.log(colors.green.inverse('Data successfully imported...'))
    } catch(err) {
        console.log(err.message)
    }
    process.exit()
}
// DESTROY DATA
const destroyData = async () => {
    try {
        await Bootcamp.deleteMany()
        await Course.deleteMany()
        await User.deleteMany()
        await Review.deleteMany()
        console.log(colors.red.inverse('Data successfully deleted...'))
    } catch(err) {
        console.log(err.message)
    }
    process.exit()
}

// CLI --import --delete
if(process.argv[2] === '--import' || process.argv[2] === '-i') {
    importData()
}else if(process.argv[2] === '--delete' || process.argv[2] === '-d') {
    destroyData()
}