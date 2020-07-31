const axios = require('axios')
const MongoClient = require('mongodb').MongoClient;
const express = require('express')
const redis = require('./redis')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3000
const baseUrlTvSeries = 'http://localhost:3001/'
const baseUrlMovies = 'http://localhost:3002/'

app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url, {useUnifiedTopology: true});

app.get('/', async(req, res) => {
  try {
    const cacheMovies = await redis.get('Movies')
    const cacheTvSeries = await redis.get('TvSeries')
    if (cacheMovies && cacheTvSeries) {
      res.status(200).json({response: [JSON.parse(cacheTvSeries), JSON.parse(cacheMovies)]});
    } else {
      const asyncMovies = await axios({
        url: baseUrlMovies,
        method: 'GET'
      });
      const asyncTvSeries = await axios({
        url: baseUrlTvSeries,
        method: 'GET'
      });
      let TvSeries = asyncTvSeries.data;
      let Movies = asyncMovies.data;
      if(TvSeries && Movies) {
        res.status(200).json({response: [TvSeries, Movies]});
        await redis.set('TvSeries', JSON.stringify(TvSeries))
        await redis.set('Movies', JSON.stringify(Movies))
        client.close();
      }
    }
  } catch (error) {
    res.status(500).json({error});
    client.close();
  }
})

app.post('/tvseries', async(req, res) => {
  try {
    const asyncTvSeries = await axios({
      url: baseUrlTvSeries,
      method: 'POST',
      data: req.body
    });
    const tvSeries = asyncTvSeries.data;
    if(tvSeries) {
      res.status(201).json(tvSeries);
      const cacheTvSeries = await redis.get('TvSeries');
      const cache = JSON.parse(cacheTvSeries)
      cache.TvSeries.push(tvSeries.TvSeries[0])
      await redis.set('TvSeries', JSON.stringify(cache))
      client.close();
    }
  } catch (error) {
    res.status(500).json({error});
    client.close();
  }
})

app.post('/movies', async(req, res) => {
  try {
    const asyncMovies = await axios({
      url: baseUrlMovies,
      method: 'POST',
      data: req.body
    });
    const Movies = asyncMovies.data;
    if(Movies) {
      res.status(201).json(Movies);
      const cacheMovies = await redis.get('Movies');
      const cache = JSON.parse(cacheMovies)
      cache.Movies.push(Movies.Movies[0])
      await redis.set('Movies', JSON.stringify(cache));
      client.close();
    }
  } catch (error) {
    res.status(500).json({error});
    client.close();
  }
})

app.put('/tvseries/:id', async(req, res) => {
  const {id} = req.params;
  try {
    const asyncTvSeries = await axios({
      url: baseUrlTvSeries + id,
      method: 'PUT',
      data: req.body
    })
    const {data} = asyncTvSeries
    if (data) {
      res.status(200).json({message: 'Succes Update data with id ' + id});
      await redis.set('TvSeries', JSON.stringify(data))
      client.close();
    }
  } catch (error) {
    res.status(500).json({error});
    client.close();
  }
})

app.put('/movies/:id', async(req, res) => {
  const id = req.params;
  try {
    const asyncMovies = await axios({
      url: baseUrlMovies + id,
      method: 'PUT',
      data: req.body
    })
    const {data} = asyncMovies
    if (data) {
      res.status(200).json({message: 'succes update movies with id ' + id});
      await redis.set('Movies', JSON.stringify(data))
      client.close();
    }
  } catch (error) {
    res.status(500).json({error});
    client.close();
  }
})

app.delete('/tvseries/:id', async(req, res) => {
  const {id} = req.params;
  try {
    const asyncTvSeries = await axios({
      url: baseUrlTvSeries + id,
      method: 'DELETE',
    })
    const {data} = asyncTvSeries
    if (data) {
      res.status(200).json({message: 'Succes delete Tv Series with id ' + id});
      await redis.set('TvSeries', JSON.stringify(data))
      client.close();
    }
  } catch (error) {
    res.status(500).json({error});
    client.close();
  }
})

app.delete('/movies/:id', async(req, res) => {
  const {id} = req.params;
  try {
    const asyncMovies = await axios({
      url: baseUrlMovies + id,
      method: 'delete'
    })
    const {data} = asyncMovies
    if (data) {
      res.status(200).json({message: 'Succes delete Movies with id ' + id});
      await redis.set('Movies', JSON.stringify(data))
      client.close();
    }
  } catch (error) {
    res.status(500).json({error});
    client.close();
  }
})

app.listen(port, () => {
  console.log('App is Listen to port ', port)
})