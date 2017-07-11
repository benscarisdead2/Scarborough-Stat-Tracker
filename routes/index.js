const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.Promise = require("bluebird");
mongoose.connect("mongodb://localhost:27017/activity");

const statSchema = new Schema({
  statistic: {
    type: Number
  },
  statDate: {
    Date: {type: Date, default: Date.now()},
  }
});

const activitySchema = new Schema({
  activityName: {
    type: String,
    required: true,
    unique: true
  },
  activityStats : [statSchema]
});

const actModel = mongoose.model('activities', activitySchema)

//
//  GET routers
//

router.get('/', function(req, res) {
  actModel.find().then(function(items) {
    res.render('index', {
      activity: items
    });
  })
})

router.get('/activities', function(req, res) {
  // all the activities with all their stats
  actModel.find({}).then(function(allActivities) {
    if (allActivities) {
      res.setHeader('Content-Type', 'application/json')
      res.status(200).json(allActivities)
    }
  })
})


router.get('/activities/:description', function(req, res) {
  let description = req.params.description.toLowerCase();
  actModel.find({activityName: description}).then(function(activity) {
    if (activity) {
      res.setHeader('Content-Type', 'application/json')
      res.status(200).json(activity)
    }
  })
})

//
//  POSTS
//

router.post('/activities/:description/stats/:statistic', function(req, res) {
  // find the _id for the given activity
  actModel.findOne({
    activityName: req.params.description.toLowerCase()
  }).then(function(selectedActivity) {
    if (selectedActivity) {
      // use the _id to store the stat
      selectedActivity.activityStats.push({ statistic: req.params.statistic })
      res.setHeader('Content-Type', 'application/json')
      res.status(200).json(selectedActivity)
    }
  })

})

router.post('/activities/:description', function(req, res) {
  let description = req.params.description.toLowerCase();
  actModel.create({
    activityName: description
  }).then(function(items) {
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

router.put('/activities/:description/:newDescription', function(req, res) {
  let description = req.params.description.toLowerCase();
  let newDescription = req.params.newDescription.toLowerCase();
  actModel.updateOne({
    activityName: description
  }, {
    activityName: newDescription
  }).then(function(items) {
    if (items) {
      res.setHeader('Content-Type', 'application/json')
      res.status(200).json(items)
    }
  })
})

//
// DELETES
//

router.delete('/activities/:description', function(req, res) {
  let description = req.params.description.toLowerCase();
  actModel.deleteOne({
    activityName: description
  }).then(function(items) {
    if (items) {
      res.setHeader('Content-Type', 'application/json')
      res.status(200).json(items)
    }
  })
});


module.exports = router;
