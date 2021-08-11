const express = require('express');
const { validatePost, validateUser, validateUserId } = require('../middleware/middleware.js')

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required
const User = require('./users-model.js')
const Posts = require('../posts/posts-model.js')

const router = express.Router();

router.get('/', (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  User.get()
    .then(user => {
      console.log(user)
      res.status(200).json(user);
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error retrieving the users',
      });
    });
});

router.get('/:id', validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  const { id } = req.params
  User.getById(id)
  .then(user => {
    console.log(user)
    res.status(200).json(user)
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({ message: 'Error retrieving user'})
  })
});

router.post('/', validateUser, (req, res) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  User.insert(req.body)
    .then(user=>{
      console.log('User created:', user)
      res.status(201).json(user)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ message: 'Error adding user'})
    })

  
});

router.put('/:id', validateUserId,validateUser, async (req, res) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const changes = req.body
  const {id} = req.params
  try{const updatedUser = await User.update(id, changes)
    if(!updatedUser){
      res.status(404).json({message: "The user with the specified ID does not exist"})
    }else{
      console.log('User updated:', updatedUser)
      res.status(200).json(updatedUser)
    }
  }catch(err){
    res.status(500).json({message: "The user information could not be modified"})
}
});

router.delete('/:id', validateUserId, async (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  try{
    const {id} = req.params
    const deletedUser = await User.remove(id)
    if(!deletedUser){
        res.status(404).json({message: "The user with the specified ID does not exist"})
    }else{
        console.log('User deleted:', deletedUser)
        res.status(200).json(deletedUser)
    }
}catch(err){
    res.status(500).json({message: "The user could not be removed"})
}
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  Posts.getById(req.params.id)
        .then(post =>{
            if (post) {
               res.status(200).json(post);
             }else(
               res.status(404).json({message: "The post with the specified ID does not exist"}))
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
              message: "User's posts could not be retrieved",
            });
          })
});

router.post('/:id/posts', validateUserId,validatePost, (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const newPost = { ...req.body, user_id: req.params.id };
  Posts.insert(newPost)
    .then(post => {
      console.log('Post created:', post)
      res.status(201).json(post)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ message: 'Error adding new post' })
    })
});

// do not forget to export the router
module.exports = router;
