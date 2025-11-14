const mongoose = require('mongoose')

const MONGODB_URI = 'your_mongodb_connection_string_here'

async function testConnection() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ MongoDB connection successful!')
    
    // Test creating a document
    const testSchema = new mongoose.Schema({ test: String })
    const TestModel = mongoose.model('Test', testSchema)
    
    const doc = await TestModel.create({ test: 'Hello MongoDB!' })
    console.log('✅ Document created:', doc)
    
    await TestModel.deleteOne({ _id: doc._id })
    console.log('✅ Document deleted successfully')
    
    await mongoose.disconnect()
    console.log('✅ All tests passed!')
  } catch (error) {
    console.error('❌ Connection failed:', error)
  }
}

testConnection()
