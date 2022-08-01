module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        console.log("user not logged in");
        res.redirect('/login');
    } else {
        next();
    }
}