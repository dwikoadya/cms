var express = require('express');
var router = express.Router();

const Datadate = require('../models/datadate')

router.post('/search', (req, res) => {
    let letter = req.body.letter;
    let frequency = req.body.frequency;
    let reg = new RegExp(letter, 'i')
    let response = [];
    let filter = {};

    if (letter && frequency) {
        filter.letter = { $regex: reg };
        filter.frequency = frequency
    } else if (letter) {
        filter.letter = { $regex: reg };
    } else if (frequency) {
        filter.frequency = frequency
    }

    Datadate.find(filter)
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

router.get('/', (req, res) => {
    let response = [];

    Datadate.find()
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
    let letter = req.body.letter
    let frequency = req.body.frequency

    let response = {
        success: false,
        message: "",
        data: {}
    }

    const datadate = new Datadate ({
        letter: letter,
        frequency: frequency
    })

    datadate.save()
    .then(result => {
        response.success = true
        response.message = "data have been added"
        response.data._id = result.id
        response.data.letter = result.letter
        response.data.frequency = result.frequency
        res.status(201).json(response)
    })
    .catch(err => {
        res.status(500).json(err)
    })
})

router.put('/:id', (req, res) => {
    let id = req.params.id;
    let letter = req.body.letter;
    let frequency = req.body.frequency;
    let response = {
        success: false,
        message: "",
        data: {}
    };

    Datadate.findByIdAndUpdate(id, { letter, frequency }, { new: true })
    .then(data => {
        response.success = true;
        response.message = "data have been updated";
        response.data._id = data._id;
        response.data.letter = data.letter;
        response.data.frequency = data.frequency;
        res.status(201).json(response)
    })
    .catch(err => {
        response.message = "failed update data"
        res.status(500).json(err)
    })
})

router.delete('/:id', (req, res) => {
    let id = req.params.id;
    let response = {
        success: false,
        message: "",
        data: {}
    };

    Datadate.findByIdAndRemove(id)
    .then(data => {
        response.success = true;
        response.message = "data have been deleted";
        response.data = data._id;
        response.data.letter = data.letter;
        response.data.frequency = data.frequency;
        res.status(201).json(response)
    })
    .catch(err => {
        response.message = "failed delete data";
        res.status(500).json(err)
    })
})

module.exports = router;