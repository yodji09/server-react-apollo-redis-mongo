import React from 'react';
import Detail from '../components/Detail';
import {useQuery} from '@apollo/react-hooks';
import {gql} from 'apollo-boost'
import {useParams, useHistory} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

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

export default function Home() {
  let {category} = useParams()
  category === undefined ? category = "movies" : category = "tvseries"
  const {loading, data, error} = useQuery(category === "movies" ? MOVIES : TVSERIES)
  const classes = useStyles()
  const history = useHistory()

  function handleAdd(event) {
    event.preventDefault();
    history.push(`/${category}/add`)
  }

  if(loading) return <p>loading .....</p>
  if(error) return <p>Error.....{error}</p>

  return (
    <div className={classes.root}>
      <Button onClick={event => handleAdd(event)} color="primary" style={{backgroundColor: 'red', margin: '10px'}}> Add {category}</Button>
      <Grid container spacing={3}>
        {category === "tvseries" ? data.tvSeries.map(element => {
          return (
          <Grid item xs={3} key={element._id}>
              <Detail element={element} category={category}/>
          </Grid>)
        }) : data.movies.map(element => {
          return (
          <Grid item xs={3} key={element._id}>
              <Detail element={element} category={category}/>
          </Grid>)
        })}
      </Grid>
    </div>
  )
}
