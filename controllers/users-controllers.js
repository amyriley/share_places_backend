const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

let DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Bob',
        email: 'test@test.com',
        password: 'testers'
    },
    {
        id: 'u2',
        name: 'Max',
        email: 'test@test.com',
        password: 'testers'
    }
]

const getUsers = (req, res, next) => {
    res.json({users: DUMMY_USERS});
};

const createUser = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed. Please check your data.', 422)
        ) 
    }
    
    const { name, email, password, places } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError('Signing up failed, please try again later.', 500);
        return next(error);
    }

    if (existingUser) {
        const error = new HttpError('User exists already. Please login instead.', 422);
        return next(error);
    }

    const createdUser = new User({
        name,
        email,
        image: 'https://live.staticflickr.com/7631/26849088292_36fc52ee90_b.jpg',
        password,
        places
    });

    try {
        await createdUser.save();
      } catch (err) {
        const error = new HttpError(
          'Signing up failed failed, please try again.',
          500
        );
        return next(error);
      }

    res.status(201).json({user: createdUser.toObject({ getters: true } )});
};

const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError('Logging in failed, please try again later.', 500);
        return next(error);
    }

    if (!existingUser || existingUser.password !== password) {
        const error = new HttpError('Invalid credentials. Could not log you in.', 401);
        return next(error);
    }
    
    res.json({message: 'Logged in!'});
};

exports.getUsers = getUsers;
exports.createUser = createUser;
exports.loginUser = loginUser;