module.exports = function (app, passport, db) { // sends function to server.js
  const { ObjectId } = require('mongodb') //gives access to _id in mongodb

  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function (req, res) {
    res.render('index.ejs');
  });

  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function (req, res) {
    db.collection('jobListings').find().toArray((err, result) => { // uses the db connection 
      if (err) return console.log(err)
      // console.log('this is the result', result)
      res.render('profile.ejs', {
        user: req.user, //use to just show profile name
        jobListings: result
      })
    })
  });

  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  // message board routes ===============================================================

  app.post('/jobListings', (req, res) => {
    db.collection('jobListings').save({
      positionTitle: req.body.positionTitle,
      companyName: req.body.companyName,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      employmentStatus: req.body.employmentStatus,
      companyDescription: req.body.companyDescription,
      positionDescription: req.body.positionDescription,
      requirements: req.body.requirements,
      positionFilled: false,
      comments: []
    }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/profile')
    })
  })

  app.post('/comments', (req, res) => {
    db.collection('jobListings').updateOne({ _id: ObjectId(req.body.hiddenId) }, {
      $push: {
        comments: {name: req.body.name, comment: req.body.comment}
      }
    },
      (err, result) => {
        if (err) return console.log(err)
        console.log('comment saved to database')
        res.redirect('/profile')
      })
  })

  

  app.put('/jobListings', (req, res) => {
    console.log(req.body)
    db.collection('jobListings')
    .findOneAndUpdate({ _id: ObjectId(req.body._id) }, {
      $set: {
        positionFilled: req.body.positionFilled
      }
    }, {
      sort: {_id: -1},
      upsert: false
    }, (err, result) => {
      // console.log(result)
      if (err) return res.send(err)
      res.send(result)
    })
  })

  // app.put('/comments', (req, res) => {
  //   db.collection('jobListings')
  //   .updateOne({comments: {name: req.body.name, comment: req.body.comment}}, {
  //     $pull: {
  //       'comments': {name: req.body.name, comment: req.body.comment}
  //     }
  //   }, {
  //     sort: {_id: -1},
  //     upsert: false
  //   }, (err, result) => {
  //     if (err) return res.send(err)
  //     res.send(result)
  //   })
  // })

  app.delete('/jobListings', (req, res) => {
    db.collection('jobListings').findOneAndDelete({ _id: ObjectId(req.body._id) }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('job listing deleted!')
    })
  })


  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================PDNT

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash jobListings
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash jobListings
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    let user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}
