module.exports = async (req, res, next) => {

    if (req.session.hasOwnProperty('admin')) {
        global.adminData = req.session.admin;
    }

    global.baseUrl = `${req.protocol}://${req.get('host')}`;
    global.flashMessage = req.flash('flashMessage');

    return next();
}