const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const cors = require('cors');
const { ObjectID } = require('mongodb');

const app = express();
const port = process.env.PORT || 3002;
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
      const Movies = await db.collection('Movies').find({}).toArray();
      if(Movies){
        res.status(200).json({Movies});

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
      const Movies = await db.collection('Movies').insertOne(value);
      const {ops} = Movies;
      if(ops) {
        res.status(201).json({Movies: ops});

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
      const response = await db.collection('Movies').findOneAndUpdate({_id: ObjectID(id)}, {$set: value});
      const Movies = await db.collection('Movies').find({}).toArray()
      if (Movies) {
        res.status(200).json({Movies});
      }
    } catch (error) {
      res.status(500).json({error})

    }
  })
  app.delete('/:id', async (req, res) => {
    try {
      const {id} = req.params;
      const message = await db.collection('Movies').findOneAndDelete({_id: ObjectID(id)});
      const Movies = await db.collection('Movies').find({}).toArray()
      if(message && Movies) {
        res.status(200).json({Movies});
      }
    } catch (error) {
      res.status(500).json({error})

    }
  })
})

app.listen(port, () => {
  console.log('client connect at port ', port);
})