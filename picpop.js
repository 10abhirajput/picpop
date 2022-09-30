const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cors = require('cors');
const useragent = require('express-useragent');
const flash = require('connect-flash');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const constants = require('./config/constants');
const modules = require('./config/modules');
const baseMiddleware = require('./middlewares/baseMiddleware');

// myapi
const userRouter = require('./routes/myapiRoutes')
// const webRouter = require('./routes/websiteRoutes')


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));
app.use(session({
  secret: 'djhxc34231241252asdf23slsakdf3adsflkas2',
	resave: true,
	saveUninitialized: true
}));

app.use(baseMiddleware);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules_url', express.static(path.join(__dirname, 'node_modules')));

app.use(useragent.express());
app.use('/api',userRouter)
// app.use('/website',webRouter)

require('./routes/router')(app);
require('./socket')(io);

http.listen(global.appPort, (err, resu) => {
  if (err) throw err;
  console.log(`server listening on port: ${global.appPort}`);
});

module.exports = app;