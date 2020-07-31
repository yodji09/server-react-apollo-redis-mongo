import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useParams, useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';
import {gql} from 'apollo-boost';
import {useMutation} from '@apollo/react-hooks';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '50ch',
      justifyContent: 'center',
      alignItems: 'center'
    },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
}));

const TVSERIES = gql`
  {
    tvSeries {
      _id
      title
      overview
      poster_path
      popularity
      tags
    }
  }
`
const ADDTVSERIES = gql`
  mutation($title: String, $overview: String, $poster_path: String, $popularity: Float, $tags: [String]) {
    addTvSeries(title: $title, overview: $overview, poster_path: $poster_path, popularity: $popularity, tags: $tags) {
      _id
      title
      overview
      poster_path
      popularity
      tags
    }
  }
`
const MOVIES = gql`
  {
    movies {
      _id
      title
      overview
      poster_path
      popularity
      tags
    }
  }
`
const ADDMOVIES = gql`
  mutation($title: String, $overview: String, $poster_path: String, $popularity: Float, $tags: [String]) {
    addMovies(title: $title, overview: $overview, poster_path: $poster_path, popularity: $popularity, tags: $tags) {
      _id
      title
      overview
      poster_path
      popularity
      tags
    }
  }
`

export default function AddForm() {
  const {category} = useParams();
  const classes = useStyles();
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [overview, setOverview] = useState('');
  const [poster_path, setPoster] = useState('');
  const [popularity, setPopularity] = useState('');
  const [tags, setTags] = useState('');

  const [addTvSeries] = useMutation(ADDTVSERIES, {
    update(cache, { data: { addTvSeries } }) {
      const {tvSeries} = cache.readQuery({query: TVSERIES})
      cache.writeQuery({
        query: TVSERIES,
        data: {tvSeries: tvSeries.concat(addTvSeries)},
      });
    },
  });

  const [addMovies] = useMutation(ADDMOVIES, {
    update(cache, { data: { addMovies } }) {
      const {movies} = cache.readQuery({query: MOVIES})
      console.log(movies)
      cache.writeQuery({
        query: MOVIES,
        data: {movies: movies.concat([addMovies])},
      });
    },
  });

  function handleTitle(event){
    event.preventDefault();
    setTitle(event.target.value)
  }
  function handleOverview(event){
    event.preventDefault();
    setOverview(event.target.value)
  }
  function handlePoster(event){
    event.preventDefault();
    setPoster(event.target.value)
  }
  function handlePopularity(event){
    event.preventDefault();
    setPopularity(event.target.value)
  }
  function handleTags(event){
    event.preventDefault();
    setTags(event.target.value)
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    const value = tags.split(',')
    let temp = []
    value.map(element => {
      element = element.split('')
      const index = element.indexOf(' ')
      if(index !== -1 && index === 0) {
        element.splice(index, 1)
      }
      element = element.join('')
      return temp = temp.concat(element)
    })
    if(category === 'movies') {
      await addMovies({variables: {title, overview, tags:temp, poster_path, popularity: parseFloat(popularity)}})
      setTitle('')
      setOverview('')
      setPoster('')
      setPopularity('')
      setTags('')
      history.push('/')
    } else if(category === 'tvseries') {
      await addTvSeries({variables: {title, overview, tags:temp, poster_path, popularity: parseFloat(popularity)}})
      setTitle('')
      setOverview('')
      setPoster('')
      setPopularity('')
      setTags('')
      history.push(`/$category`)
    }
  }

  return (
    <div>
      <form className={classes.content} noValidate autoComplete="off" onSubmit={event => handleSubmit(event)}>
        <Grid container spacing={2}>
         <Grid item xs={6}>
          <TextField id="filled-basic" style={{width: "100%"}} label="Title" variant="filled" defaultValue={title} onChange={event => handleTitle(event)} />
         </Grid>
         <Grid item xs={6}>
          <TextField style={{width: "100%"}} id="filled-basic" label="Over View" variant="filled" defaultValue={overview} onChange={event => handleOverview(event)} />
         </Grid>
         <Grid item xs={6}>
          <TextField style={{width: "100%"}} id="filled-basic" label="Poster Path" variant="filled" defaultValue={poster_path} onChange={event => handlePoster(event)} />
         </Grid>
         <Grid item xs={6}>
          <TextField style={{width: "100%"}} id="filled-basic" label="Popularity" variant="filled" defaultValue={popularity} onChange={event => handlePopularity(event)}/>
         </Grid>
         <Grid item xs={6}>
          <TextField style={{width: "100%"}} id="filled-basic" label="Tags" variant="filled" defaultValue={tags} onChange={event => handleTags(event) }/>
         </Grid>
        </Grid>
        <div style={{paddingTop : '10px'}}>
          <Button type='submit' color="primary" style={{backgroundColor: 'red'}}> Submit </Button>
        </div>
      </form>
    </div>
  );
}
