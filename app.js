// todo add authentication and break the code into modules

// require('express') will return a function 
const express = require('express')

// acts as a middleware, get's all the incoming requests and forward it to the correct resolves by parsing the request,
// deciding which schemas to use
// returns a valid middleware function
const graphqlHttp = require('express-graphql')


// allows us to define schema following graphql specifications etc
// buildSchema allows us to build schema in string(template literal) from and convert to JSON by it's own
const {buildSchema} = require('graphql')

// function returns object of type express and by convention we call that app
const app = express()


const Checkpoint = require('./models/checkpoint')
const Milestone = require('./models/milestones')

const getCheckpointById  = async (checkpointId) => {
    const checkpoint_data = await Checkpoint.findById(checkpointId)
    // console.log("logging assignedCheckPoint old")
    // console.log(assignedCheckpoint)

    console.log("logging checkpoint data")
    console.log(checkpoint_data)

    // console.log("logging assignedCheckPoint")
    // console.log(assignedCheckpoint)
    
    
    return checkpoint_data
}

// endpoint where all the graphql requests will be handled 
// as a object we will configure our GraphQl API-> queries to handle, where to find the resolvers 
app.use('/graphql', graphqlHttp({
    
    // graphql schema
    // ! says can't be null
    schema: buildSchema(`
        type Checkpoint{
            _id: ID!
            title: String!
            description: String
            number: Int
            created: String!
        }

        input CheckpointInput{
            title: String!
            description: String
            number: Int
        }

        type assignedCheckpoint{
            checkpoint: Checkpoint!
            completed: Boolean
        }

        input assignCheckpointInput{
            checkpointID: ID!
            milestoneID: ID!
        }

        type Milestone{
            _id: ID!
            title: String!
            created: String!
            assignedCheckpoints: [assignedCheckpoint!]!
        }

        type RootQuery{
            checkpoints: [Checkpoint!]!
            milestones: [Milestone!]!
        }

        type RootMutation{
            createCheckpoint(checkpointInput: CheckpointInput): Checkpoint
            assignCheckpoint(assignCheckpointInput: assignCheckpointInput): Milestone
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    // have all the resolver functions in it which should match the schema by name
    // name must be unique as graphQl don't have any namespace kind of things

    rootValue: {
        checkpoints: async () => {
            const checkpoints = await Checkpoint.find()
            return (checkpoints.map(checkpoint => {return { ...checkpoint._doc, _id: checkpoint.id, created: checkpoint.created.toString()}}))
        },

        createCheckpoint: async (args) => {
            const checkpoint = new Checkpoint({
                title: args.checkpointInput.title,
                description: args.checkpointInput.description,
                number: args.checkpointInput.number
            })
            checkpointData = await checkpoint.save()
            return {...checkpoint._doc, _id: checkpoint.id, created: checkpoint.created.toString()}
        },

        milestones: async (args) => {
            const milestones = await Milestone.find()
            console.log(milestones)
            return milestones.map(milestone => { return { ...milestone._doc,  _id: milestone.id, created: milestone.created.toString()}})
        },

        assignCheckpoint: async (args) => {
            console.log("comign here")
            const checkpointID = args.assignCheckpointInput.checkpointID
            const milestoneID = args.assignCheckpointInput.milestoneID
            const checkpoint = await Checkpoint.findById(checkpointID)
            const milestone = await Milestone.findById(milestoneID)
            milestone.assignedCheckpoints.push({checkpoint: checkpoint, completed: false})
            const milestone_data = await milestone.save()
            return { ...milestone_data._doc, assignedCheckpoints: milestone_data.assignedCheckpoints.map(assignedCheckpoint => {return {...assignedCheckpoint._doc, checkpoint:getCheckpointById(checkpoint.id)}})}           
        }
    },
    graphiql: true

}))

require('dotenv/config')
const cors = require('cors')


// importing routes
const milestoneRoutes = require('./routes/milestones')
const authRoutes = require('./routes/auth')

// creating middleware
app.use('/milestones', milestoneRoutes)
app.use('/user', authRoutes)
app.use(cors)

const mongoose = require('mongoose')
mongoose.connect(process.env.DB_CONNECTION,{ useNewUrlParser: true, useUnifiedTopology: true }, () => console.log("conected to DB..."))


// the payload in the put/post request will be automatically parsed as JSON
// express.json() returns a middleware which we use using app.use in request processing pipeline
app.use(express.json());


app.get('/', (req, res) => {
    return res.send("I am root!")
})

const port = process.env.PORT || 8000
app.listen(port, () => console.log(`listening to port ${port}...`))

