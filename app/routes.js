module.exports = function (app, passport, db, ObjectId) {

  // normal routes ===============================================================

  // show the home page (will also have our login links)


  app.get('/', function (req, res) {
    res.render('index.ejs');
  });

  // PROFILE SECTION =========================
  // this retrieves the profile route from the ejs file
  app.get('/profile', isLoggedIn, function (req, res) {
    db.collection('order').find().toArray((err, result) => {
      if (err) return console.log(err)

      res.render('profile.ejs', {
        user: req.user,
        orders: result.filter(order => order.completed == false),
        completedOrders: result.filter(order => order.completed == true)
      })
    })
  });

  // LOGOUT ==============================
  // get is the read in CRUD
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
    // the backslash is the home page
  });

  // message board routes ===============================================================

  // create part of crud 
  app.post('/customerOrders', (req, res) => {
    db.collection('order').save({

      flavor: req.body.flavor,
      mixins: req.body.mixins,
      msg: req.body.msg,
      completed: false

    }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/profile')
    })
  })


  app.put('/customerOrders', (req, res) => {
    console.log(req.body._id)
    db.collection('order').findOneAndUpdate({
      _id: ObjectId(req.body._id)

    }, {
      $set: {
        completed: true
      }
    }, {
      sort: { _id: -1 },
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
  })



  //THIS ROUTE SPECIFIES THAT WE WANT TO DELETE THE COMMENT

  app.delete('/customerOrders', (req, res) => {
    db.collection('order').findOneAndDelete({
      _id: ObjectId(req.body._id)

    }, (err, result) => {
      if (err) return res.send(500, err)
      res.send(JSON.stringify('Message deleted!'))
    })
  })

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

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
    failureFlash: true // allow flash messages
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
    failureFlash: true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
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
