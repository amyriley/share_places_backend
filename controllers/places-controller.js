const HttpError = require('../models/http-error');

const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        location: {
            lat: 40.754429,
            long: -73.9947217
        },
        address: '20 W 34th St, New York, NY 10001, United States',
        creator: 'u1'
    }
]

const getPlaceById = router.get('/:pid', (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId
    });

    if (!place) {
        throw new HttpError('Could not find a place for the provided id.', 404);
    }

    res.json({place});
});

const getPlaceByUserId = router.get('/user/:uid', (req, res, next) => {
    const userId = req.params.uid;
    const place = DUMMY_PLACES.find(p => {
        return p.creator === userId
    });

    if (!place) {
        return next(
            new HttpError('Could not find a place for the provided user id.', 404)
        );
    }

    res.json({place});
})

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;