module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        console.log("user not logged in");
        req.flash("infoMessage", "Please login to access this page.")
        res.redirect('/login');
    } else {
        next();
    }
}