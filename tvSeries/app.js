const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const cors = require('cors');
const { ObjectID } = require('mongodb');

const app = express();
const port = process.env.PORT || 3001;
const url = 'mongodb://localhost:27017';
const dbName = 'EntertaintMe';
const client = new MongoClient(url, {useUnifiedTopology: true});

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

client.connect((err) => {
  const db = client.db(dbName);
  app.get('/', async (req, res) => {
    try {
      const TvSeries = await db.collection('TvSeries').find({}).toArray();
      if(TvSeries){
        res.status(200).json({TvSeries});
      }
    } catch (error) {
      res.status(500).json({error})
    }
  })
  app.post('/', async (req, res) => {
    try {
      const {title, overview, poster_path, popularity, tags} = req.body;
      const value = {
        title,
        overview,
        poster_path,
        popularity: parseFloat(popularity),
        tags
      };
      const TvSeries = await db.collection('TvSeries').insertOne(value);
      const {ops} = TvSeries;
      if(ops) {
        res.status(201).json({TvSeries: ops});
      }
    } catch (error) {
      res.status(500).json({error})

    }
  })
  app.put('/:id', async (req, res) => {
    try {
      const {id} = req.params;
      let {title, overview, poster_path, popularity, tags} = req.body;
      popularity = parseFloat(popularity)
      const value = {
        title, overview, poster_path, popularity, tags
      };
      const response = await db.collection('TvSeries').findOneAndUpdate({_id: ObjectID(id)}, {$set: value});
      const TvSeries = await db.collection('TvSeries').find({}).toArray()
      if (TvSeries) {
        res.status(200).json({TvSeries});

      }
    } catch (error) {
      res.status(500).json({error})

    }
  })
  app.delete('/:id', async (req, res) => {
    try {
      const {id} = req.params;
      const message = await db.collection('TvSeries').findOneAndDelete({_id: ObjectID(id)});
      const TvSeries = await db.collection('TvSeries').find({}).toArray()
      if(message && TvSeries) {
        res.status(200).json({TvSeries});
      }
    } catch (error) {
      res.status(500).json({error})

    }
  })
})

app.listen(port, () => {
  console.log('client connect at port ', port);
})