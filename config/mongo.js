import mongoose from 'mongoose'
import config from './index.js'

const CONNECTION_URL = `mongodb+srv://Favalcodes:FAVOUR090@cluster0.4g08j.mongodb.net/${config.db.name}?retryWrites=true&w=majority`

mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

mongoose.connection.on('connected', () => {
  console.log('Mongo has connected succesfully')
})
mongoose.connection.on('reconnected', () => {
  console.log('Mongo has reconnected')
})
mongoose.connection.on('error', error => {
  console.log('Mongo connection has an error', error)
  mongoose.disconnect()
})
mongoose.connection.on('disconnected', () => {
  console.log('Mongo connection is disconnected')
})