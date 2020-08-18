var express = require('express');
var router = express.Router();
var Data = require('../models/data');

router.post('/search', (req, res) => {
    let letter = req.body.letter;
    let frequency = req.body.frequency
    let reg = new RegExp(letter, 'i')
    let response = [];
    let filter = {}

    if (letter && frequency) {
        filter.letter = { $regex: reg };
        filter.frequency = frequency;
    } else if (letter) {
        filter.letter = { $regex: reg };
    } else if (frequency) {
        filter.frequency = frequency;
    }

    Data.find(filter)
        .then(data => {
            response = data.map(item => {
                return {
                    _id: item._id,
                    letter: item.letter,
                    frequency: item.frequency
                }
            })
            res.status(200).json(response)
        }).catch(err => {
            res.status(401).json(err)
        })
})

router.get('/', (req, res) => {
    let response = [];

    Data.find()
    .then(data => {
        response = data.map(item => {
            return {
                _id: item._id,
                letter: item.letter,
                frequency: item.frequency
            }
        })
        res.status(200).json(response)
    })
    .catch(err => {
        res.status(500).json(err)
    })
})

router.post('/', (req, res) => {
    let letter = req.body.letter;
    let frequency = req.body.frequency;

    let response = {
        success: false,
        message: "",
        data: {}
    }

    const data = new Data({
        letter: letter,
        frequency: frequency
    })

    data.save()
    .then(result => {
        response.success = true
        response.message = "data have been added"
        response.data._id = result.id
        response.data.letter = result.letter
        response.data.frequency = result.frequency
        res.status(201).json(response)
    })
    .catch(err => {
        res.status(500).json(response)
    })
})

router.put('/:id', (req, res) => {
    let id = req.params.id;
    let letter = req.body.letter;
    let frequency = req.body.frequency
    let response = {
        success: false,
        message: "",
        data: {}
    }

    Data.findByIdAndUpdate(id, {letter, frequency}, {new: true})
    .then(data => {
        response.success = true;
        response.message = "data have been updated"
        response.data._id = data._id;
        response.data.letter = data.letter;
        response.data.frequency = data.frequency
        res.status(201).json(response)
    })
    .catch(err => {
        response.message = "failed update data"
        res.status(500).json(response)
    })
})

router.delete('/:id', (req,res) => {
    let id = req.params.id;
    let response = {
        success: false,
        message: "",
        data: {}
    }

    Data.findByIdAndRemove(id)
    .then(data => {
        response.success = true;
        response.message = "data have been deleted"
        response.data = data._id;
        response.data.letter = data.letter;
        response.data.frequency = data.frequency
        res.status(201).json(response)
    })
    .catch(err => {
        response.message = "failed delete data"
        res.status(500).json(response)
    })
})

router.get('/:id', (req, res) => {
    let id = req.params.id
    let response = {
        success: false,
        message: "",
        data: {}
    }

    Data.findById(id)
    .then(data => {
        response.success = true
        response.message = "data found"
        response.data._id = data._id
        response.data.letter = data.letter
        response.data.frequency = data.frequency
        res.status(201).json(response)
    })
    .catch(err => {
        response.message = "data can't be found"
        res.status(500).json(response)
    })
})

module.exports = router