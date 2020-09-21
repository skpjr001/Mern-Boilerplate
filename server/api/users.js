const Joi = require('@hapi/joi');
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db/connection')
const users =db.get('users')
const router = express.Router();



const schema =Joi.object().keys({
    email: Joi.string().alphanum().min(4).max(30),
    password: Joi.string().trim().min(8),
    roles: Joi.array()
        .items(Joi.string().valid('user', 'admin')),
    active: Joi.bool()

});

router.get('/', async (req, res, next) => {
    try{
        const result = await users.find({},'-password');
        res.json(result);
    } catch (error){
        next(error);
    }  
});

router.patch('/:id', async (req, res, next) => {
    const { id: _id } = req.params; 
    // validate id params
    try {
        // validate req body
        const result = schema.validate(req.body);
        if(!result.error){
            // if valid: find user in db with given id
            const query = { _id }
            const user = await users.findOne(query);
            if(user){
                //update user in db
                //const updatedUser = Object.assign({}, user, req.body);
                const updatedUser = req.body;
                if(updatedUser.passowrd){
                    updatedUser.password = await bcrypt.hash(updatedUser.password, 12);
                }
                const result = await users.findOneAndUpdate(query,{
                    $set: updatedUser,
                });
                // respond with user
                delete result.password;
                res.json(result);
            }else {
                // if not exists - send 404 (with user not found)
                next();
            }
        } else {
            //if not valid - send an error with the reason
            res.status(422);
            throw new Error(result.error);
        }

    } catch (error) {
        next(error);
    }                     
})


// implement api to create user

module.exports = router;