const jwt = require('jsonwebtoken')
const checkTokenSetUser = (req, res, next) => {
	const authHeader = req.get('Authorization');
	console.log(authHeader);
	if (authHeader) {
		const token = authHeader.split(' ')[1];
		if (token) {
			jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
				if (err) {
					console.log(err);
				}

				req.user = user;
				console.log(req.user,"inside middleware 1")
				next();
			})
		} else {
			next();
		}
	}else{
		next();
	} 
}

function unAuthorized(res, next) {
	const error = new Error('Un-authorized ❌');
	res.status(401);
	next(error);
}

function isLoggedIn(req, res, next) {
	if(req.user) {
		next();
	}else {
		unAuthorized(res, next);
	}
}

function isAdmin(req, res, next) {
	if(req.user.role === 'admin') {
		next();
	} else {
		unAuthorized(res, next)
	}
}

module.exports = {
	checkTokenSetUser,
	isLoggedIn,
	isAdmin
}