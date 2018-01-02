
import * as express from 'express';


export const apiRouter = express.Router()
    .get('/', (req, res) => res.status(200).send({ test: 'get' }))
    .get('/:id', (req, res) => res.status(200).send({ test: 'get id' }))
    .post('/', (req, res) => res.status(200).send({ test: 'post' }))
    .put('/:id', (req, res) => res.status(200).send({ test: 'put id' }))
    .delete('/:id', (req, res) => res.status(200).send({ test: 'delete id' }))