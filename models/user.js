var mongoose = require('mongoose')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')
var saltRounds = 10
var secret = 'Dwiko Secret'

const userSchema = new mongoose.Schema({
    email: { type: String, required: true},
    password: { type: String, required: true},
    token: { type: String}
});

userSchema.pre('save', function (next) {
    bcrypt.hash(this.password, saltRounds, (err, hash) => {
        if (err) 
            console.log(err)
         else {
            this.password = hash;
            next();
        }
    })
})

module.exports = mongoose.model('User', userSchema)