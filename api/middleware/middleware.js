const User = require('../users/users-model.js')

function logger(req, res, next) {
  // DO YOUR MAGIC
  console.log( req.method, req.url, Date.now());
  next();
}

const validateUserId = (req, res, next)=> {
  // DO YOUR MAGIC
    const {id} = req.params
    User.getById(id)
      .then(user =>{
        if(!user) {
          res.status(404).json({message: "user not found"})
        } else {
          req.user = user
          next()
        }
      })
      .catch(error =>{
        console.log(error)
        res.status(500).json({
          message: "Could not validate user id"
        })
      })
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  if(!req.body.name) {
    res.status(400).json({message: "missing required name field"})
  } else {
    next()
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  if(!req.body.text){
    res.status(400).json({message: "missing required text field"})
  } else {
    next()
  }
}

// do not forget to expose these functions to other modules
module.exports = { logger, validatePost, validateUser, validateUserId }
