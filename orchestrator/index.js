const {ApolloServer, gql} = require('apollo-server')
const axios = require('axios')
const baseUrlTvSeries = 'http://localhost:3001/'
const baseUrlMovies = 'http://localhost:3002/'
const redis = require('./redis')

const typeDefs = gql`
  type TvSeries {
    _id: ID
    title: String
    overview: String
    poster_path: String
    popularity: Float
    tags: [String]
  }
  type Movies {
    _id: ID
    title: String
    overview: String
    poster_path: String
    popularity: Float
    tags: [String]
  }

  type Query {
    tvSeries: [TvSeries]
    movies: [Movies]
  }

  type Mutation {
    addTvSeries(title: String, overview: String, poster_path: String, popularity: Float, tags:[String]) : TvSeries
    addMovies(title: String, overview: String, poster_path: String, popularity: Float, tags:[String]) : Movies
    editTvSeries(_id: ID, title: String, overview: String, poster_path: String, popularity: Float, tags:[String]) : [TvSeries]
    editMovies(_id: ID, title: String, overview: String, poster_path: String, popularity: Float, tags:[String]) : [Movies]
    deleteTvSeries(_id: ID) : [TvSeries]
    deleteMovies(_id: ID) : [Movies]
  }
`

const resolvers = {
  Query: {
    tvSeries: async () => {
      const cache = await redis.get('TvSeries')
      if(cache) {
        return (JSON.parse(cache))
      } else {
        return axios({
          url: baseUrlTvSeries,
          method: 'GET'
        })
        .then(async ({data}) => {
          await redis.set('TvSeries', JSON.stringify(data.TvSeries))
          return data.TvSeries
        })
        .catch(err => {
          console.log(err)
        })
      }
    },
    movies: async () => {
      const cache = await redis.get('Movies')
      if(cache){
        return (JSON.parse(cache))
      } else {
        return axios({
          url: baseUrlMovies,
          method: 'GET'
        })
        .then(async({data}) => {
          await redis.set('Movies', JSON.stringify(data.Movies))
          return data.Movies
        })
        .catch(err => {
          console.log(err)
        })
      }

    }
  },
  Mutation: {
    addTvSeries: async (parent, args, context, info) => {
      const {title, overview, poster_path, tags, popularity} = args
      const cacheTvSeries = await redis.get('TvSeries')
      return axios({
        url: baseUrlTvSeries,
        method: 'POST',
        data: {title, overview, poster_path, tags, popularity}
      })
        .then(async({data}) => {
          let cache = JSON.parse(cacheTvSeries)
          cache.push(data.TvSeries[0])
          await redis.set('TvSeries', JSON.stringify(cache))
          return data.TvSeries[0]
        })
        .catch(err => {
          console.log(err)
        })
    },
    addMovies: async (parent, args, context, info) => {
      const {title, overview, poster_path, tags, popularity} = args
      const cacheMovies = await redis.get('Movies')
      return axios({
        url: baseUrlMovies,
        method: 'POST',
        data: {title, overview, poster_path, tags, popularity}
      })
        .then(async({data}) => {
          let cache = JSON.parse(cacheMovies)
          cache.push(data.Movies[0])
          await redis.set('Movies', JSON.stringify(cache))
          return data.Movies[0]
        })
        .catch(err => {
          console.log(err)
        })
    },
    editTvSeries: async (parent, args, context, info) => {
      const {_id, title, overview, poster_path, tags, popularity} = args
      return axios({
        url: baseUrlTvSeries + _id,
        method: 'PUT',
        data: {title, overview, poster_path, tags, popularity}
      })
        .then(async({data}) => {
          await redis.set('TvSeries', JSON.stringify(data.TvSeries))
          return data.TvSeries
        })
        .catch(err => {
          console.log(err)
        })
    },
    editMovies: async (parent, args, context, info) => {
      const {_id, title, overview, poster_path, tags, popularity} = args
      return axios({
        url: baseUrlMovies + _id,
        method: 'PUT',
        data: {title, overview, poster_path, tags, popularity}
      })
        .then(async({data}) => {
          await redis.set('Movies', JSON.stringify(data.Movies))
          return data.Movies
        })
        .catch(err => {
          console.log(err.message)
        })
    },
    deleteTvSeries: async (parent, args, context, info) => {
      const {_id} = args
      return axios({
        url: baseUrlTvSeries + _id,
        method: 'delete'
      })
        .then(async({data}) => {
          await redis.set('TvSeries', JSON.stringify(data.TvSeries))
          return data.TvSeries
        })
        .catch(err => {
          console.log(err)
        })
    },
    deleteMovies: async (parent, args, context, info) => {
      const {_id} = args
      return axios({
        url: baseUrlMovies + _id,
        method: 'delete'
      })
        .then(async({data}) => {
          await redis.set('Movies', JSON.stringify(data.Movies))
          return data.Movies
        })
        .catch(err => {
          console.log(err)
        })
    },
  }
}
const server = new ApolloServer({typeDefs, resolvers})

server.listen({port: process.env.PORT || 4000}).then(({url}) => {
  console.log(`Server is running at ${url}`)
})