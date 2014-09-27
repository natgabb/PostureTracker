
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'PostureTracker' });
};

exports.android = function(req, res) {
  if (!req.body) {
    res.send(400);
  } else {
    console.log("body", req.body);
    res.send(200);
  }
};