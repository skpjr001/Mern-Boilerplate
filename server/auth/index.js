const { Router } = require('express');
const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../db/connection');
const users = db.get('mern');
// users.index('username');
users.createIndex('email', {unique: true});

const router = Router();

const schema =Joi.object().keys({
    email: Joi.string().alphanum().min(4).max(30).required(),
    password: Joi.string().trim().min(8).max(50).required(),
    //repeat_password: Joi.ref('password')
});

// this function creates jwt token and sends to the user
function createTokensendResponse(user, res, next) {
	const payload ={
		_id: user._id,
		email: user.email
	};
	jwt.sign(payload, process.env.TOKEN_SECRET,{expiresIn: '1d'},(err, token) => {
		if(err){
			respondError422(res, next);
		} else {
			res.status(200);
			res.json({
				status: 'ok',
				data:token
			});
		}
	});
}


//any route in here is pre-pended with /auth/
//GET /auth
router.get('/', (req, res) => {
    res.json({message: 'auth router 🔑'})
});

//POST /auth/signup
router.post('/register', (req, res, next) => {
    const result = schema.validate(req.body);
    if(result.error == null) {
      // make sure username is unique
      users.findOne({
        email: req.body.email
        }).then((user) => {
				// if user is undefined , username is not in the db, else duplicate username
				if (user) {
						// there is already a user in the db with this username
						// respond with an error!
						const error = new Error('email already registered! Try another email.');
						res.status(409);
						next(error);
				} else {
						// hash the password
						bcrypt.hash(req.body.password.trim(), 12).then((hashedPassword) => {
								//insert the user with the hashed password
								const newUser = {
										email: req.body.email,
										password: hashedPassword
								};
								// inserting user object into db
								users.insert(newUser).then((insertedUser) => {
									createTokensendResponse(insertedUser, res, next)
									// delete(insertedUser.password);
									// res.json(insertedUser);
								})
							});
            }
        });
    }else{
      //error in validation
      res.status(422);
      next(result.error);
    }  
});

function respondError422(res, next) {
	res.status(422);
	const error = new Error('Unable to login!');
	next(error);
}

//POST /auth/login
router.post('/login', (req, res, next)=>{
	const result = schema.validate(req.body);
	// chexks
	if(result.error == null) {
		users.findOne({
			email: req.body.email,
		}).then((user) => {
			if(user){
				// found the user in the db ... so this is the actual username
				// now we compare password to confirm user
				bcrypt.compare(req.body.password, user.password)
					.then((result) => {
						if(result){
							// user sent us right password user confirmed
							createTokensendResponse(user, res, next)
						} else {
							// user sent wrong passowrd
							respondError422(res, next);
						}
					});
			} else {
				// username not found in the db
				respondError422(res, next);
			}
		});
	} else {
		//error in validation //result.error
		respondError422(res, next);
	}
})

module.exports = router;