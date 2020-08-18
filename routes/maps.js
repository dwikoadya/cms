var express = require('express');
var router = express.Router();
const Map = require('../models/map')

router.post('/', (req, res) => {
    let title = req.body.title;
    let lat = req.body.lat;
    let lng = req.body.lng;

    let response = {
        success: false,
        message: "",
        data: {}
    }

    const map = new Map({
        title: title,
        lat: lat,
        lng: lng
    })

    map.save()
    .then(result => {
        response.success = true;
        response.message = "data have been added";
        response.data._id = result.id;
        response.data.title = result.title;
        response.data.lat = result.lat;
        response.data.lng = result.lng;
        res.status(201).json(response)
    })
    .catch(err => {
        res.status(500).json(response)
    })
})

module.exports = router;