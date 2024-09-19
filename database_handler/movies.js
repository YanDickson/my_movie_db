import pg from 'pg';
import dotenv from 'dotenv'
dotenv.config()

const { Client } = pg;
const connection = {
  host: process.env.HOST,
  port: process.env.PORT,
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD,
};

export const getAllMovies = async () => {
  const client = new Client(connection)
  await client.connect()
  const moviesData = await client.query('SELECT * FROM movies')
  await client.end()
  return moviesData.rows
};

export const getMovieById = async (id) => {
  const client = new Client(connection)
  await client.connect()
  const movieData = await client.query('SELECT * FROM movies WHERE id = $1', [id])
  await client.end()
  return movieData.rows
};

export const updateMovieById = async (id, inputObject) => {
  const client = new Client(connection)
  await client.connect()
  const fields = []
  const keys = [id]

  Object.keys(inputObject).forEach((key, index) => {
    fields.push(`${key} = $${index + 2}`)
    keys.push(inputObject[key])
  })

  const query = `UPDATE movies SET ${fields.join(', ')} WHERE id = $1 RETURNING *`
  const movieData = await client.query(query, keys)
  await client.end()
  return movieData.rows
};

export const createMovies = async (inputObject) => {
  const client = new Client(connection)
  await client.connect()
  const params = []
  const keys = []
  const values = []

  Object.keys(inputObject).forEach((key, index) => {
    params.push(`$${index + 1}`)
    keys.push(key)
    values.push(inputObject[key])
  })

  const query = `INSERT INTO movies (${keys.join(', ')}) VALUES (${params.join(', ')}) RETURNING *`
  const newMovie = await client.query(query, values)
  await client.end()
  return newMovie.rows
};

export const deleteMovieById = async (id) => {
  const client = new Client(connection)
  await client.connect()
  const movieData = await client.query('DELETE FROM movies WHERE id = $1 RETURNING *', [id])
  await client.end()
  return movieData.rows
};
