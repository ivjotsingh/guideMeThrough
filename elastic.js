const { Client } = require('elasticsearch')

const client = new Client({ node: 'http://localhost:9200' })


const result = await client.search({
    index: 'my-index',
    body: { foo: 'bar' }
  })

  