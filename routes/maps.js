var express = require('express');
var router = express.Router();
const Map = require('../models/map')

router.post('/search', (req, res) => {
    let reg = new RegExp(req.body.title, 'i');
    let response = [];
    let filter = {}

    if (req.body.title) {
        filter.title = { $regex: reg };
    }

    Map.find(filter)
    .then(data => {
        response = data.map(item => {
            return {
                _id: item._id,
                title: item.title,
                lat: item.lat,
                lng: item.lng
            }
        })
        res.status(200).json(response)
    })
    .catch(err => {
        res.status(401).json(response)
    })
})

router.get('/', (req, res) => {
    let response = [];

    Map.find()
    .then(data => {
        response = data.map(item => {
            return {
                _id: item._id,
                title: item.title,
                lat: item.lat,
                lng: item.lng
            }
        })
        res.status(200).json(response)
    })
    .catch(err => {
        res.status(500).json(err)
    })
})

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