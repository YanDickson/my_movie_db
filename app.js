import express from 'express';
import { getAllMovies, getMovieById, updateMovieById, createMovies, deleteMovieById} from './database_handler/movies.js';

const app = express();
app.use(express.json());
const port = 3000;

app.listen(port, () => {
  console.log("Server Listening on PORT:", port);
});

app.get('/silverscreen/v1/status', (request, response) => {
  try{
    response.status(200).json({ message: 'Running app.js' });
  } catch (error) {
    response.status(500).json({ message: error.message });
  };
});

app.get('/silverscreen/v1/movies', async (request, response) => {
  try{
    const movies = await getAllMovies();
    response.status(200).json({ movies: movies });
  } catch (error) {
    response.status(500).json({ message: error.message });
  };
});

app.get('/silverscreen/v1/movies/:id', async (request, response) => {
  const id = request.params.id;

  if(isNaN(id)) {
    return response.status(400).json({ message: 'Movie ID must be a number.'});
  };

  try {
    const movie = await getMovieById(id);
    if(movie.length) {
      response.status(200).json({ movie: movie });
    } else {
      response.status(400).json({ movie: `Movie ID ${id} not found.` });
    }
  } catch (error) {
    response.status(500).json({ message: error.message });
  };
});

app.patch('/silverscreen/v1/movies/:id', async (request, response) => {
  const id = request.params.id;
  const inputObject = request.body;
  const allowedKeys = ['name', 'genre', 'length'];
  const inputKeys = Object.keys(inputObject);
  const inputIncludesId = inputKeys.includes('id');
  const isValidInput = inputKeys.every(key => allowedKeys.includes(key));

  if(isNaN(id)) {
    return response.status(400).json({ message: 'Movie ID must be a number.'});
  };

  if(inputIncludesId) {
    return response.status(400).json({ message: 'Cannot update value of movie ID.'});
  };
  
  if(!isValidInput) {
    return response.status(400).json({ message: 'Invalid fields provided.' });
  };

  if(inputKeys.length === 0) {
    return response.status(400).json({ message: 'No data provided for update.' });
  };

  try {
    const movie = await updateMovieById(id, inputObject);
    if (movie.length > 0) {
      response.status(200).json({ messsage: 'Movie updated successfully.', movie: movie });
    } else {
      response.status(400).json({ message: `Movie ID ${id} not found.` });
    }
    
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

app.post('/silverscreen/v1/movies', async (request, response) => {
  const inputObject = request.body;
  const allowedKeys = ['id', 'name', 'genre', 'length'];
  const inputKeys = Object.keys(inputObject);
  const isValidInput = allowedKeys.every(key => inputKeys.includes(key));

  if(!isValidInput) {
    return response.status(400).json({ message: "Input must include 'id', 'name', 'genre', and 'length'." });
  };

  try {
    const newMovie = await createMovies(inputObject);
    response.status(200).json({ message: 'Movie added successfuly.', movie: newMovie });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

app.delete('/silverscreen/v1/movies/:id', async (request, response) => {
  const id = request.params.id;

  if (isNaN(id)) {
    return response.status(400).json({ message: 'Movie ID must be a number.' });
  };

  try {
    const deletedMovie = await deleteMovieById(id);
    if (deletedMovie.length > 0) {
      response.status(200).json({ message: `Movie deleted successfully.`, deleted_movie: deletedMovie });
    } else {
      response.status(400).json({ message: `Movie ID ${id} not found.` });
    }
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});
