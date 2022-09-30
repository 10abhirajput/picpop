/*
|----------------------------------------------------------------------------------------------------------------------------
|   Helpers File
|----------------------------------------------------------------------------------------------------------------------------
|
|   All helper methods in this file.
|
*/
const models = require('../models');
const sequelize = require('sequelize');
const { Op } = sequelize;
const bcrypt = require('bcrypt');
const crypto = require('crypto');
var path = require('path');
var uuid = require('uuid');
const fs = require('fs');
var apn = require('apn');

const nodemailer = require('nodemailer');
const constants = require('../config/constants')
const client = require('twilio')(constants.twilioSID, constants.twilioToken);
const fileExtension   =     require('file-extension')
const sharp           =     require('sharp') //for image thumbnail
const Thumbler        =     require('thumbler');//for video thumbnail
const util            =     require('util')
/*
|----------------------------------------------------------------------------------------------------------------------------
|   Exporting all methods
|----------------------------------------------------------------------------------------------------------------------------
*/
module.exports = {
  vaildObject: async function (required, non_required, res) {
    let message = '';
    let empty = [];

    let model = required.hasOwnProperty('model') && models.hasOwnProperty(required.model)
      ? models[required.model]
      : models.user;

    for (let key in required) {
      if (required.hasOwnProperty(key)) {
        if (required[key] == undefined || required[key] === '' && (required[key] !== '0' || required[key] !== 0)) {
          empty.push(key);
        }
      }
    }

    if (empty.length != 0) {
      message = empty.toString();
      if (empty.length > 1) {
        message += " Fields are required"
      } else {
        message += " Field is required"
      }
      throw {
        'code': 400,
        'message': message
      }
    } else {
      if (required.hasOwnProperty('securitykey')) {
        if (required.securitykey != "__picpop") {
          message = "Invalid security key";
          throw {
            'code': 400,
            'message': message
          }
          
        }
      }

      if (required.hasOwnProperty('checkExists') && required.checkExists == 1) {
        const checkData = {
          email: 'Email Already Exists, kindly use another.',
          mobile: 'Mobile already exists, kindly use another',
          // phone: 'Phone number already exists, kindly use another',
        }

        for (let key in checkData) {
          if (required.hasOwnProperty(key)) {
            const checkExists = await model.findOne({
              where: {
                [key]: required[key].trim()
              }
            });
            if (checkExists) {
              throw {
                code: 400,
                message: checkData[key]
              }
            }
          }
        }
      }

      const merge_object = Object.assign(required, non_required);
      delete merge_object.checkexit;
      delete merge_object.securitykey;

      if (merge_object.hasOwnProperty('password') && merge_object.password == '') {
        delete merge_object.password;
      }

      for (let data in merge_object) {
        if (merge_object[data] == undefined) {
          delete merge_object[data];
        } else {
          if (typeof merge_object[data] == 'string') {
            merge_object[data] = merge_object[data].trim();
          }
        }
      }

      return merge_object;
    }
  },
  readFile: async function (path) {
    console.log("  ************ readFile *******************",path)
    return new Promise((resolve, reject) => {
        const readFile = util.promisify(fs.readFile);
        readFile(path).then((buffer) => {
            resolve(buffer);
        }).catch((error) => {
            reject(error);
        });
    });
},
writeFile: async function (path, buffer) {
  console.log("  ************ write file *******************")
  return new Promise((resolve, reject) => {
      const writeFile1 = util.promisify(fs.writeFile);
      writeFile1(path, buffer).then((buffer) => {
          resolve(buffer);
      }).catch((error) => {
          reject(error);
      });
  });
},
  fileUploadApi: async function (FILE, FOLDER, FILE_TYPE) {
    //async function fileUpload(FILE, FOLDER, FILE_TYPE) {
        try {
          //  var form = new multiparty.Form();

           console.log(FILE,'-------------------------------------------------------------------FILE-------------------------------')
            var FILENAME = FILE.name; // actual filename of file
            var FILEPATH = FILE.tempFilePath; // will be put into a temp directory
      
            let THUMBNAIL_IMAGE_SIZE = 300
            let THUMBNAIL_IMAGE_QUALITY = 100
      
            let EXT = fileExtension(FILENAME); //get extension
            console.log(FILEPATH,'------------------------------FILEPATH----------------------------')

            EXT = EXT ? EXT : 'jpg';
            FOLDER_PATH = FOLDER ? (FOLDER + "/") : ""; // if folder name then add following "/" 
            var ORIGINAL_FILE_UPLOAD_PATH = "/public/uploads/" + FOLDER_PATH;
            var THUMBNAIL_FILE_UPLOAD_PATH = "/uploads/" + FOLDER_PATH;
            var NEW_FILE_NAME = (new Date()).getTime()  +  "-" + "file." + EXT;
            // var NEW_THUMBNAIL_NAME = (new Date()).getTime() + "-" + "thumbnail"  + "-"  + "file." + ((FILE_TYPE=="video") ? "jpg" : EXT);
      
            let NEWPATH = path.join(__dirname, '../', ORIGINAL_FILE_UPLOAD_PATH, NEW_FILE_NAME);
            // let THUMBNAIL_PATH = path.join(__dirname, '../', ORIGINAL_FILE_UPLOAD_PATH, NEW_THUMBNAIL_NAME);
      
            let FILE_OBJECT = {
                "image": '',
                // "thumbnail": '',
                "fileName": FILENAME,
                "folder": FOLDER,
                "file_type": FILE_TYPE
            } 
      
            let BUFFER = await this.readFile(FILEPATH);//read file from temp path
            await this.writeFile(NEWPATH, BUFFER);//write file to destination
      
            FILE_OBJECT.image =    NEW_FILE_NAME;
            // FILE_OBJECT.image =  THUMBNAIL_FILE_UPLOAD_PATH + NEW_FILE_NAME;
            let THUMB_BUFFER = "";
            console.log('-------------------------------------------HERE------------------------------------------------')
            // if(FILE_TYPE == 'image') { // image thumbnail code
            //     var THUMB_IMAGE_TYPE = (EXT == "png") ? "png" :(EXT=="jpg")?"jpg": "jpeg";
            //     THUMB_BUFFER = await sharp(BUFFER)
            //         .resize({width: 300})
            //         .toBuffer();
                
            //     // FILE_OBJECT.thumbnail = THUMBNAIL_FILE_UPLOAD_PATH + NEW_THUMBNAIL_NAME;
            //     // await this.writeFile(THUMBNAIL_PATH, THUMB_BUFFER);
            // }
            // else if (FILE_TYPE=="resume") { // video thumbnail code
            //     //await this.createVideoThumb(NEWPATH,THUMBNAIL_PATH, NEW_THUMBNAIL_NAME);
            //     // FILE_OBJECT.thumbnail = THUMBNAIL_FILE_UPLOAD_PATH + NEW_THUMBNAIL_NAME;
            // }
            return FILE_OBJECT;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    },
  vaildObjectUser: async function (required, non_required, res) {
    let message = '';
    let empty = [];
    let table_name = (required.hasOwnProperty('table_name')) ? required.table_name : 'users';

    for (let key in required) {
      if (required.hasOwnProperty(key)) {
        if (required[key] == undefined || required[key] == '') {
          empty.push(key);
        }
      }
    }

    if (empty.length != 0) {
      message = empty.toString();
      if (empty.length > 1) {
        message += " Fields are required"
      } else {
        message += " Field is required"
      }
      res.status(400).json({
        'success': false,
        'message': message,
        'code': 400,
        'body': {}
      });
      return;
    } else {
      if (required.hasOwnProperty('security_key')) {
        if (required.security_key != "picpop@123") {
          message = "Invalid security key";
          res.status(403).json({
            'success': false,
            'message': message,
            'code': 403,
            'body': []
          });
          res.end();
          return false;
        }
      }

      const marge_object = Object.assign(required, non_required);
      delete marge_object.checkexit;

      for (let data in marge_object) {
        if (marge_object[data] == undefined) {
          delete marge_object[data];
        } else {
          if (typeof marge_object[data] == 'string') {
            marge_object[data] = marge_object[data].trim();
          }
        }
      }

      return marge_object;
    }
  },
  isJson: (item) => {
    item = typeof item !== "string" ? JSON.stringify(item) : item;

    try {
      item = JSON.parse(item);
    } catch (e) {
      return false;
    }

    if (typeof item === "object" && item !== null) {
      return true;
    }

    return false;
  },
  save: async (model, data, returnData = false, req = {}) => {
    try {
      if (!(typeof data == 'object' && !Array.isArray(data))) {
        throw 'Please send valid object in second argument of save function.';
      }
      console.log(model, '===================>model');
      const tableColumns = model.rawAttributes
      console.log(tableColumns, '==============>tableColumns');
      const defaultValues = {
        'INTEGER': 0,
        'STRING': '',
        'TEXT': '',
        'FLOAT': 0,
        'DECIMAL': 0,
      }

      data = { ...data };
      let rawData = { ...data };

      for (let key in data) {
        if (!tableColumns.hasOwnProperty(key)) {
          delete data[key];
        } else {
          const tableColumn = tableColumns[key];
          const tableDataType = tableColumn.type.key;
          if (!data[key] && !tableColumn.hasOwnProperty('defaultValue')) {
            data[key] = defaultValues[tableDataType]
          }
        }
      }

      for (let column in tableColumns) {
        if (column != 'createdAt' && column != 'updatedAt' && column != 'id' && !data.hasOwnProperty('id')) {
          const tableColumn = tableColumns[column];
          const tableDataType = tableColumn.type.key;

          // console.log(tableColumn, '=================>tableColumn');

          if (!data.hasOwnProperty(column)) {
            if (!tableColumn.hasOwnProperty('defaultValue')) {
              data[column] = defaultValues[tableDataType];
            } else {
              // console.log(tableDataType, '===========>tableDataType');
              // console.log(tableColumn.defaultValue, '===========>tableColumn.defaultValue');
              data[column] = tableColumn.defaultValue;
            }
          }
        }
      }

      let id;
      console.log(data, '===========================>data');
      // return;

      if (data.hasOwnProperty('id')) {
        const updatedEntry = await model.update(
          data,
          {
            where: {
              id: data.id,
            },
            individualHooks: true
          }
        );
        id = data.id;
      } else {
        
        const createdEntry = await model.create(data);
        id = createdEntry.dataValues.id;
      }

      if (returnData) {
        let getData = await model.findOne({
          where: {
            id
          }
        });
        getData = getData.toJSON();
        if (getData.hasOwnProperty('password')) {
          delete getData['password'];
        }

        if (rawData.hasOwnProperty('imageFolders') && typeof rawData.imageFolders == 'object' && !Array.isArray(rawData.imageFolders) && Object.keys(rawData.imageFolders).length > 0 && Object.keys(req).length > 0) {
          for (let column in rawData.imageFolders) {
            const folder = rawData.imageFolders[column];
            if (getData.hasOwnProperty(column) && getData[column] != '') {
              getData[column] = `${req.protocol}://${req.get('host')}/uploads/${folder}/${getData[column]}`
            }
          }
        }

        return getData;
      }

      return id;
    } catch (err) {
      throw err;
    }
  },
  delete: async (model, id) => {
    await model.destroy({
      where: {
        id: {
          [sequelize.Op.in]: Array.isArray(id) ? id : [id]
        }
      }
    });
  },

  clone: function (value) {
    return JSON.parse(JSON.stringify(value));
  },


  time: function () {
    var time = Date.now();
    var n = time / 1000;
    return time = Math.floor(n);
  },

  nowTimestamp: function () {
    return Math.floor(Date.now() / 1000);
  },

  generateTransactionNumber: function (length = 10) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    text += this.time();

    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  },

  success: function (res, message = '', body = {}) {
    return res.status(200).json({
      'success': 1,
      'code': 200,
      'message': message,
      'body': body
    });
  },
  error: function (res, err, req) {
    console.log(err, '===========================>error');
    let code = (typeof err === 'object') ? (err.code) ? err.code : 400 : 400;
    let message = (typeof err === 'object') ? (err.message ? err.message : '') : err;
    if (req) {
      req.flash('flashMessage', { color: 'error', message });

      const originalUrl = req.originalUrl.split('/')[1];
      return res.redirect(`/${originalUrl}`);
    }

    return res.status(code).json({
      'success': false,
      'message': message,
      'code': code,
      'body': {}
    });

  },
  bcryptHash: (myPlaintextPassword, saltRounds = 10) => {
    const bcrypt = require('bcrypt');
    const salt = bcrypt.genSaltSync(saltRounds);
    let hash = bcrypt.hashSync(myPlaintextPassword, salt);
    hash = hash.replace('$2b$', '$2y$');
    return hash;
  },

  comparePass: async (requestPass, dbPass) => {
    dbPass = dbPass.replace('$2y$', '$2b$');
    const match = await bcrypt.compare(requestPass, dbPass);
    return match;
  },
  sendEmail(object) {
    try {
      var transporter = nodemailer.createTransport(mailAuth);
      var mailOptions = {
        from: `${appName} <${mailAuth.auth.user}>`,
        ...object,
      };

      console.log(mailAuth); // mail auth configured in config/constants.js
      console.log(mailOptions);
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log('error', error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    } catch (err) {
      throw err;
    }
  },
  // sendEmail(object) {
  //     try {
  //         var transporter = nodemailer.createTransport(constants.mailAuth);
  //         var mailOptions = object;

  //         console.log(constants.mail_auth);
  //         console.log(mailOptions);
  //         transporter.sendMail(mailOptions, function (error, info) {
  //             if (error) {
  //                 console.log('error', error);
  //             } else {
  //                 console.log('Email sent: ' + info.response);
  //             }
  //         });
  //     } catch (err) {
  //         throw err;
  //     }
  // },

  sendMail: function (object) {
    const nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport(config.mail_auth);
    var mailOptions = object;
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  },

  createSHA1: function () {
    let key = 'abc' + new Date().getTime();
    return crypto.createHash('sha1').update(key).digest('hex');
  },

  imageUpload: (file, folder = 'user') => {
    console.log("-----------------------file--------------",file);
    
    if (file.name == '') return;

    let file_name_string = file.name;
    console.log("======================================================file_name_string",file_name_string);
    
    var file_name_array = file_name_string.split(".");
    var file_extension = file_name_array[file_name_array.length - 1];
    var letters = "ABCDE1234567890FGHJK1234567890MNPQRSTUXY";
    var result = "";
    // while (result.length<28)
    // {
    //     var rand_int = Math.floor((Math.random() * 19) + 1);
    //     var rand_chr= letters[rand_int];
    //     if (result.substr(-1, 1)!=rand_chr) result+=rand_chr;
    // }
     result = (new Date()).getTime();

    // result = uuid();
    let name = result + '.' + file_extension;
    console.log("------------------------------",name);
    
    // console.log(name);return false;
    file.mv('public/uploads/' + folder + '/' + name, function (err) {
      if (err) throw err;
    });
    return name;
  },

  uploadImage: function (fileName, file, folderPath) {
    const rootPath = path.join(path.resolve(__dirname), '../');
    const imageBuffer = decodeBase64Image(file);
    const newPath = `${rootPath}${folderPath}${fileName}`;
    writeDataStream(newPath, imageBuffer.data);
    return newPath;
  },

  fileUpload(file, folder = 'users') {
    let file_name_string = file.name;
    var file_name_array = file_name_string.split(".");
    var file_extension = file_name_array[file_name_array.length - 1];
    var letters = "ABCDE1234567890FGHJK1234567890MNPQRSTUXY";
    var result = "";
    while (result.length < 28) {
      var rand_int = Math.floor((Math.random() * 19) + 1);
      var rand_chr = letters[rand_int];
      if (result.substr(-1, 1) != rand_chr) result += rand_chr;
    }
    let name = result + '.' + file_extension;
    // console.log(name);return false;
    file.mv('public/images/' + folder + '/' + name, function (err) {
      if (err) {
        throw err;
      }
    });
    return name;
  },

  sendPushNotificationTifiFunction: function (notification_data) {
    try {
      // console.log("pushhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
      
      if (notification_data.device_token != '' && notification_data.device_token != null) {
        // console.log("pushhhhhhhhhh22222222222222222222222222222222222222222222222");

        bundel_id = 'com.cqlsys.picpoc';
        var message = {
            to: notification_data.device_token,
            // collapse_key: 'your_collapse_key',

            /* notification: {
                  title: title,
                  body: get_message
                },
         */
            data: {
              ...notification_data
                // body: get_message,
                // receiver_data: data_to_send,
                // notitype: notitype
            }
        };

      if (notification_data.device_type==1) {
        // console.log("push333333333333333333333333333333333333333333333333333333333333333333");
        
        var serverKey = 'AAAA9ir-_IY:APA91bElglvpyOVKpmjtvnnXT5ByhO-qK3En_C0WwF9O-DgRzVV11NkO7Ew9REw1QbfNpPdD2SniWpR7BKb20X5A_gbaD7hK_6iaDpZFKz626c_2p4bvdMzl4PNGNFSawiCUF1BJelxT';
      const FCM = require('fcm-node');
      var fcm = new FCM(serverKey);
      // console.log("999999999999999999999993333333333333",notification_data.device_token);
      
      var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: notification_data.device_token,
        // registration_ids: regTokens  // for multiple device_tokens use "registration_ids" instead of "to"

        // notification: {
        //   title: 'Picpop Notification',
        //   body: notification_data.user_name,
        // },


        data: {  //you can send only notification or only data(or include both)
          ...notification_data
        }
      };
      // console.log(message);
      // return false;

      fcm.send(message, function (err, response) {
        if (err) {
          console.log("sendPushNotificationTifiFunction")
          console.log("Something has gone wrong!", err);
        } else {
          console.log("Successfully sent with response: ", response);
        }
      });
      } else if (notification_data.device_type==2) {
        const apn = require('apn');

        const options = {
          token: {
            key: __dirname + "/AuthKey_Q3NW9UXH2J.p8",
            keyId: "4XVQBWH9QF",
            teamId: "Q3NW9UXH2J"
            //   keyId: "N62K9PCCD2",
            //   teamId: "4XVQBWH9QF"
          },
          production: true
        };
        const apnProvider = new apn.Provider(options);
    
          var myDevice = notification_data.device_token;
          var note = new apn.Notification();
    
          console.log(myDevice);
          note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
          note.badge = 1;
          note.sound = "ping.aiff";
    
          note.alert = notification_data.message;
          note.payload = { 'data': notification_data };
          // note.topic = "com.cqlsys.picpoc";
          note.topic = "com.cqlsys.picpoc";
    
          console.log("send note", note);
    
          apnProvider.send(note, myDevice).then((result) => {
            // see documentation for an explanation of result
            console.log("send failed result", result.failed);
            console.log("send err",err);
          }).catch((err) => {
            console.error("error while sending user notification", err);
          });
          // Close the server
          //apnProvider.shutdown();
      }
    } else {
      return;
  }
    } catch (err) {
      throw err;
    }
  },

  sendPushNotification: async function (dataForSend) {
    // console.log(dataForSend);

    const apn = require('apn');

    const options = {
      token: {
        key: __dirname + "/AuthKey_2PNTKZ4V8T.p8",
        keyId: "2PNTKZ4V8T",
        teamId: "7KU34ZBRT8"
        //   keyId: "N62K9PCCD2",
        //   teamId: "4XVQBWH9QF"
      },
      production: true
    };
    const apnProvider = new apn.Provider(options);

    if (dataForSend && dataForSend.deviceToken && dataForSend.deviceToken != '') {
      var myDevice = dataForSend.deviceToken;
      var note = new apn.Notification();

      console.log(myDevice);

      note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
      note.badge = 1;
      note.sound = "ping.aiff";

      note.alert = dataForSend.message;
      note.payload = { 'data': dataForSend };
      // note.topic = "cqlsys.BahamaEats";
      note.topic = "com.cqlsys.picpoc";

      console.log("send note", note);

      apnProvider.send(note, myDevice).then((result) => {
        // see documentation for an explanation of result
        console.log("send failed result", result.failed);
        //console.log("send err",err);
      }).catch((err) => {
        console.error("error while sending user notification", err);
      });
      // Close the server
      //apnProvider.shutdown();
    }
  },

  twilioResponse: async function (body,to_phone) {
    
    await client.messages.create({
        body: body,
        from: constants.twilioNumber,
        to: to_phone
    })
    .then(message => {
        console.log("message ------------- ",message)
        return true;
    }).catch(err => {
        console.log("err ------------- ",err)
        return false;
    }).done();
    return true;
},

  sendPushNotificationDriver: async function (dataForSend) {
    // console.log(dataForSend);

    const apn = require('apn');

    const options = {
      token: {
        key: __dirname + "/AuthKey_2PNTKZ4V8T.p8",
        keyId: "2PNTKZ4V8T",
        teamId: "7KU34ZBRT8"
        //   keyId: "2D764P6QG8",
        //   teamId: "UL6P4CWL4N"
      },
      production: true
    };
    const apnProvider = new apn.Provider(options);
    // console.log(apnProvider);

    if (dataForSend && dataForSend.deviceToken && dataForSend.deviceToken != '') {
      var myDevice = dataForSend.deviceToken;
      var note = new apn.Notification();

      console.log(myDevice);

      note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
      note.badge = 1;
      note.sound = "ping.aiff";

      note.alert = dataForSend.message;
      note.payload = { 'data': dataForSend };
      // note.topic = "cqlsys.BahamaEats";
      note.topic = "com.cqlsys.picpoc";

      console.log("send note", note);

      apnProvider.send(note, myDevice).then((result) => {
        // see documentation for an explanation of result
        console.log("send failed result", result.failed);
        //console.log("send err",err);
      }).catch((err) => {
        console.error("error while sending user notification", err);
      });
      // Close the server
      //apnProvider.shutdown();
    }
  },

  distance: function (lat1, lon1, lat2, lon2, unit) {
    //:::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
    //:::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
    //:::    unit = the unit you desire for results                               :::
    //:::           where: 'M' is statute miles (default)                         :::
    //:::                  'K' is kilometers                                      :::
    //:::                  'N' is nautical miles                                  :::

    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1 / 180;
      var radlat2 = Math.PI * lat2 / 180;
      var theta = lon1 - lon2;
      var radtheta = Math.PI * theta / 180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "K") { dist = dist * 1.609344 }
      if (unit == "N") { dist = dist * 0.8684 }
      return dist;
    }
  },

  

  checkId: async (model, where, modelIdName = 'id') => {
    const data = await model.findOne({
      where,
    });

    if (!data) throw `Invalid ${modelIdName}.`;
    return data.toJSON();
  },
  makeImageUrlSql: (model, field, modelFolder = 'user', returnField = field) => ([
    sequelize.literal(`(IF (LOCATE('http', \`${model}\`.\`${field}\`) > 0, \`${model}\`.\`${field}\`, IF (\`${model}\`.\`${field}\`='', '', CONCAT('${baseUrl}/uploads/${modelFolder}/', \`${model}\`.\`${field}\`)) ))`),
    returnField
  ]),
  makeImageUrlSqlsocket: (socket, model, field, modelFolder = 'user', returnField = field) => ([
    sequelize.literal(`(IF (LOCATE('http', \`${model}\`.\`${field}\`) > 0, \`${model}\`.\`${field}\`, IF (\`${model}\`.\`${field}\`='', '', CONCAT('http://${socket.handshake.headers.host}/uploads/${modelFolder}/', \`${model}\`.\`${field}\`)) ))`),
    returnField
  ]),
  image_base_64: async function (messageType, get_message, extension_data) {
    var image = get_message;
    if (messageType == 1) {
      var data = image.replace(/^data:image\/\w+;base64,/, '');
    } else if (messageType == 2) {
      var data = image.replace(/^data:video\/\w+;base64,/, '');
    } else if (messageType == 3) {
      var data = image.replace(/^data:audio\/\w+;base64,/, '');
    }
    var extension = extension_data;
    var filename = Math.floor(Date.now() / 1000) + '.' + extension;
    var base64Str = data;
    upload_path = path.join(__dirname, '../public/uploads/chat/' + filename);
    if (extension) {
      fs.writeFile(upload_path, base64Str, {
        encoding: 'base64'
      }, function (err) {
        if (err) {
          console.log(err)
        }
      })
    }
    return filename;
  },
  //userdetail.deviceToken, messaage, "1", createMessage
  async sendNotification(deviceTokens, message, notification_type, data_to_send = {}) {
    var options = {
      token: {
        key: __dirname + "/AuthKey_5B82466549.p8",
        keyId: "5B82466549",
        teamId: "4XVQBWH9QF"
      },
      production: false
    };

    var apnProvider = new apn.Provider(options);

    var note = new apn.Notification();

    // note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    // note.badge = 3;
    note.sound = "ping.aiff";
    note.alert = message;
    // note.payload = {};
    note.payload = {
      notification_type: notification_type,
      data: data_to_send
    }
    note.topic = "com.cqlsys.picpoc";
    // note.body = {
    //     notification_type: notification_type,
    //     message: message
    // };

 console.log(data_to_send,"===========")
    // return

    apnProvider.send(note, deviceTokens).then((result) => {
      // see documentation for an explanation of result
      console.log(result.failed, "==========failed");
      console.log(result, "=========Success");
    });
  },

  
}
