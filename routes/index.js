const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.Promise = require("bluebird");
mongoose.connect("mongodb://localhost:27017/activity");

const activitySchema = new Schema({
    actDesc: { type: String, required: true, unique: true }
});

const statSchema = new Schema({
    statNumber: { type: Number },
    statDate: { type: Date, default: Date.now },
    activityId: { type: Schema.Types.ObjectId, ref: 'actModel' }
});

const actModel = mongoose.model('activities', activitySchema);
const statModel = mongoose.model('stats', statSchema);

// actModel.insertMany([
//     {actDesc: "swimming"},
//     {actDesc: "running"},
//     {actDesc: "basketball"},
//     {actDesc: "driving"},
//     {actDesc: "walking"},
//     {actDesc: "skydiving"}
// ])

//
//  GET routers
//

router.get('/', function (req, res) {
    actModel.find().then(function (items) {
        res.render('index', { activity: items });
    })
})

router.get('/activities', function (req, res) {
    // all the activities with all their stats
    var output = [];
    actModel.find({}).then(function (allActivities) {
        if (allActivities) {
            allActivities.forEach(function (elt) {
                statModel.find({activityId: elt._id}).then(function(stats){
                    output.push(stats) 
                    console.log(output)  
                })
            })
            
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(output);
        }
    })
})


router.get('/activities/:description', function (req, res) {
    let description = req.params.description.toLowerCase();
    actModel.find({ actDesc: description }).then(function (activity) {
        if (activity) {
            statModel.find({ activityId: activity._id }).then(function (stats) {
                if (stats) {
                    res.setHeader('Content-Type', 'application/json')
                    res.status(200).json(stats)
                }
            })
        }
    })
})

//
//  POSTS
//

router.post('/activities/:description/:stat', function (req, res) {
    let description = req.params.description.toLowerCase();
    // find the _id for the given activity
    actModel.findOne({ actDesc: description }).then(function (item) {
        if (item) {
            // use the _id to store the stat
            statModel.create({ activityId: item._id, statNumber: req.params.stat }).then(function (stats) {
                if (stats) {
                    res.setHeader('Content-Type', 'application/json')
                    res.status(200).json(stats)
                }
            })
        }
    })

})

router.post('/activities/:description', function (req, res) {
    let description = req.params.description.toLowerCase();
    actModel.create({ actDesc: description }).then(function (items) {
        if (items) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(items)
        } else {
            res.status(400).send("Activity already exists. Please try again.")
        }
    })
})


//
//  PUTS
//

router.put('/activities/:description/:newDescription', function (req, res) {
    let description = req.params.description.toLowerCase();
    let newDescription = req.params.newDescription.toLowerCase();
    actModel.updateOne({ actDesc: description }, { actDesc: newDescription }).then(function (items) {
        if (items) {
            res.setHeader('Content-Type', 'application/json')
            res.status(200).json(items)
        }
    })
})

//
// DELETES
//

router.delete('/activities/:description', function (req, res) {
    let description = req.params.description.toLowerCase();
    actModel.deleteOne({ actDesc: description }).then(function (items) {
        if (items) {
            res.setHeader('Content-Type', 'application/json')
            res.status(200).json(items)
        }
    })
});


module.exports = router;