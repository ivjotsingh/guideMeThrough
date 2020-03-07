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

checkpoints = []
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
        }

        input CheckpointInput{
            title: String!
            description: String
            number: Int
        }

        type RootQuery{
            checkpoints: [Checkpoint!]!
        }

        type RootMutation{
            createCheckpoint(checkpointInput: CheckpointInput): Checkpoint
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    // have all the resolver functions in it which should match the schema by name
    // name must be unique as graphQl don't have any namespace kind of things

    rootValue: {
        checkpoints: () => {
            return checkpoints
        },
        createCheckpoint: (args) => {
            const checkpoint = {
                _id: Math.random().toString(),
                title: args.checkpointInput.title,
                description: args.checkpointInput.description,
                number: args.checkpointInput.number
            }
            checkpoints.push(checkpoint)
            return checkpoint;
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

