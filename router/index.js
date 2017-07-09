const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.Promise = require("bluebird");
mongoose.connect("mongodb://localhost:27017/activity");

const activitySchema = new Schema({
    actDesc: { type: String, required: true, unique: true },
    actUnit: String,
    actQty: Number
});

const actModel = mongoose.model('EXERCISES', activitySchema);

router.get('/', function (req, res) {
    movie.find({}).then(function (flix) {
        res.render('index', { moviez: flix });
    })
})

router.post("/index", function (req, res) {
    var newMovie = new movie({
        name: req.body.name,
        genre: req.body.genre,
        year: req.body.year,
        mpaaRating: req.body.filmrating,
        rottenTomatoScore: req.body.rottentomatoscore,
        specialFeatures: [{
            deletedScenes: req.body.numberofdeletedscenes,
            alternateEndings: req.body.numberofendings,
            audioCommentary: req.body.audiocommentary
        }],
        runTime: req.body.runtime
    });
    newMovie.save().then(function (movie) {
        res.redirect('/')
    })
})


router.post('/delete', function (req, res) {
    movie.deleteOne({ _id: req.body.deleteButton }).then(function (movie) {
        res.redirect('/');
    })
});

router.get('/edit/:id', function (req, res) {
    var idDisc = req.params.id;
    movie.findOne({ _id: idDisc }).then(function (flix) {
        console.log(flix);
        res.render('edit', { moviez: flix })
    })
});


router.post('/edit', function (req, res) {
    movie.updateOne({ _id: req.body.edit },
        {
            name: req.body.name,
            genre: req.body.genre,
            year: req.body.year,
            mpaaRating: req.body.filmrating,
            rottenTomatoScore: req.body.rottentomatoscore,
            specialFeatures: [{
                deletedScenes: req.body.numberofdeletedscenes,
                alternateEndings: req.body.numberofendings,
                audioCommentary: req.body.audiocommentary
            }],
            runTime: req.body.runtime
        }).then(function (movie) {
            res.redirect('/');
        })
});

module.exports = blurayDiscs;
module.exports = router;