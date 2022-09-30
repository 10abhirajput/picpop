const models = require('../../models');
const helper = require('../../helpers/helper');
const sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const secretKey = jwtSecretKey;

const BASE_PREFIX = 'reviewAdmin';
const User = models.user;
const AdminDetail = models.adminDetail;
const venderDetail = models.adminDetail;

module.exports = {  
    loginPage: async (req, res) => {
        try {
            if (req.session.authenticated) {            
                res.redirect(`/${BASE_PREFIX}/dashboard`);
            } else {
                
                res.render(`${BASE_PREFIX}/home/login`, { BASE_PREFIX });
            }
        } catch (err) {
            return helper.error(res, err, req);
        }
    },
    loginSubmit: async (req, res) => {
        try {
            const required = {                
                // securitykey: req.headers.securitykey,
                email: req.body.email,
                password: req.body.password,
            };
            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            let getUser = await User.findOne({
                where: {
                    email: requestData.email,
                    role: 4,
                },
                include: [
                    {
                        model: models['adminDetail'],
                        attributes: {
                            include: [
                                [sequelize.literal(`(IF (adminDetail.image='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', adminDetail.image)) )`), 'image']
                            ]
                        }
                    }
                ],
                raw: true,
                nest: true
            });
            // console.log(getUser,'========================>getUser'); return;
            if (!getUser) {
                throw "Incorrect Email or Password.";
            }
            checkPassword = await helper.comparePass(requestData.password, getUser.password);

            if (!checkPassword) {
                throw "Email or Password did not match, Please try again.";
            }
            console.log(getUser, '================================>getUser');
            if (getUser.status == 0) throw "Your acount has been disabled by the admin.";

            delete getUser.password;

            let userData = {
                id: getUser.id,
                email: getUser.email,
                password: getUser.password,
            }
            
            var token = jwt.sign({
                data: userData
            }, secretKey);
            
            getUser.token = token;
            delete getUser.password;

            console.log(getUser, '==========>getUser');

            req.session.admin = getUser;
            req.session.authenticated = true;

            req.flash('flashMessage', { color: 'success', message: 'Logged in Successfully.' });
            res.redirect(`/${BASE_PREFIX}/dashboard`);
        } catch (err) {
            return helper.error(res, err, req);
        }
    },

    logout: async (req, res) => {        
        req.session.authenticated = false;
        req.session.admin = {};
        req.flash('flashMessage', { color: 'success', message: 'Logged out Successfully.' });
        res.redirect(`/${BASE_PREFIX}`);
    },
}