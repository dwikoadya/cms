var express = require('express');
var router = express.Router();

const Datadate = require('../models/datadate')

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
        res.status(500).json(response)
    })
})

module.exports = router;