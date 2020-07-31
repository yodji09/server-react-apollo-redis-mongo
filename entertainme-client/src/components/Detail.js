import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {useHistory} from 'react-router-dom';
import {gql} from 'apollo-boost';
import {useMutation} from '@apollo/react-hooks';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 300,
    height: 460,
    paddingTop: '10px',
    marginTop: '10px',
    marginLeft: '10px',
    border: '1px solid red'
  },
  media: {
    justifyContent: 'center',
    height: '200px'
  },
  content: {
    height: 400,
    paddingBot: '15px'
  },
   modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
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
const DELETETVSERIES = gql`
  mutation($_id: ID) {
    deleteTvSeries(_id: $_id) {
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
const DELETEMOVIES = gql`
  mutation($_id: ID) {
    deleteMovies(_id: $_id) {
      _id
      title
      overview
      poster_path
      popularity
      tags
    }
  }
`

export default function Detail({element, category}) {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = React.useState(false);

  const handleOpen = (event) => {
    event.preventDefault()
    setOpen(true);
  };

  const handleClose = (event) => {
    event.preventDefault()
    setOpen(false);
  };

  const [deleteTvSeries] = useMutation(DELETETVSERIES, {
    update(cache, { data: { deleteTvSeries } }) {
      cache.writeQuery({
        query: TVSERIES,
        data: {tvSeries: deleteTvSeries},
      });
    },
  });

  const [deleteMovies] = useMutation(DELETEMOVIES, {
    update(cache, { data: { deleteMovies } }) {
      cache.writeQuery({
        query: MOVIES,
        data: {movies: deleteMovies},
      });
    },
  });

  function handleEdit(event, data) {
    event.preventDefault();
    history.push(`/${category}/${data._id}`, data={data})
  }
  function deleteData(event, data) {
    event.preventDefault();
    if(category === "tvseries") {
      deleteTvSeries({variables: {_id: data._id}})
    } else if (category === "movies") {
      deleteMovies({variables: {_id: data._id}})
    }
  }

  return (
    <Card className={classes.root}>
      <CardActionArea className={classes.content}>
        <CardMedia
          className={classes.media}
          image={element.poster_path}
          title="Tv-Series"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Title: {element.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Overview: {element.overview}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Popularity: {element.popularity}
          </Typography> Tags:
          {
            element.tags.map((elemt, index) => {
              return <Typography key={index}>{index + 1}. {elemt} </Typography>
            })
          }
        </CardContent>
      </CardActionArea>
      <CardActions style={{display: 'flex', justifyContent: 'space-around', backgroundColor: 'red'}}>
        <Button size="small" color="primary" onClick={event => handleEdit(event, element)}>
          Edit
        </Button>
        <Button size="small" color="primary" onClick={handleOpen}>
          Delete
        </Button>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className={classes.paper}>
              <h2 id="transition-modal-title">Are you sure to Delete this {category}?</h2>
              <Button size="small" color="primary" style={{backgroundColor: 'red'}} onClick={event => deleteData(event, element)}>
                Yes
              </Button>
              <Button size="small" color="primary" style={{backgroundColor: 'red'}} onClick={event => handleClose(event)}>
                No
              </Button>
            </div>
          </Fade>
        </Modal>
      </CardActions>
    </Card>
  );
}
