const db = require("./models");
const database = require("./db/db.js");
var crypto = require('crypto');
var base64 = require('base-64');
const sequelize = require("sequelize");
const Op = sequelize.Op;
const jwt = require("jsonwebtoken");
const helper = require("./helpers/helper");
const constants = require("./config/constants");
const userDetail = require("./models/userDetail");
const { triggerAsyncId } = require("async_hooks");
const { ErrorEvent } = require("./config/constants");
const { makeImageUrlSql, makeImageUrlSqlsocket } = require("./helpers/helper");
//global.baseUrl = `${req.protocol}://${req.get('host')}`;

const user = db.user;
const socketUser = db.socketUser;
const chatConstant = db.chatConstant;
const message = db.message;
const user_detail = db.userDetail;
const business = db.businessDetail;
const business_prof = db.businessProfessionalDetail;

module.exports = io => {
  io.on('connection', socket => {
    console.log('SOCKET CONNECTED', socket.id);

    socket.on('connect_user', async function (data) {
      try {
        // let createSocketId = await socketFunction.createSocketId(data, socket.id);
        let findSocketId = await socketUser.findOne({
          where: {
            userId: data.userId,
          }
        })
        if (findSocketId) {
          let updateSocketId = await socketUser.update({
            socketId: socket.id,
            isOnline: 1
          }, {
            where: {
              userId: data.userId,
            }
          })
        }
        else {
          let createSocketId = await socketUser.create({
            userId: data.userId,
            socketId: socket.id,
            isOnline: 1
          })
        }

        let success_message = {
          'success_message': 'connected successfully'
        };

        socket.emit('connect_listener', success_message);

      } catch (error) {
        throw error;
      }
    }),
      socket.on('disconnect', async function () {
        try {
          let disconnectSockets = await socketUser.update({
            isOnline: 0
          }, {
            where: {
              socketId: socket.id
            }
          })
          console.log('SOCKET DISCONNECTED');

        } catch (error) {
          throw error;
        }

      });

    socket.on('send_message', async function (data) {
      try {
          //////////////////////////////////  MESSAGE TYPE 1=IMAGE 2=VIDEO 3=AUDIO   ///////////////////////////////
        if (data.messageType == 1) {
          extension_data = data.extension
          console.log("-------------------------------------------------------",extension_data);
          
          convert_image = await helper.image_base_64(data.messageType, data.message, extension_data);
          data.message = convert_image;
        }
        // console.log("----------------------------------------------------data.message-----------------",data.message);
        
        let checkCHatConstants = await chatConstant.findOne({
          where: {
            [Op.or]: [{
              senderId: data.senderId,
              receiverId: data.receiverId
            }, {
              senderId: data.receiverId,
              receiverId: data.senderId
            }]
          }
        });

        console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiffffffffffffffffff",checkCHatConstants)
        // return

        if (checkCHatConstants) {
          //////////////// FIND SENDER AND RECEIVER ROLES ///////////////////////////

          var findSenderRole = await user.findOne({
            attributes: ['role', 'image',`deviceType`,`notification`],
            where: {
              id: data.senderId
            },
            raw: true
          });
          // console.log(findSenderRole.image,'findSenderRole=========================');return

          let findReceiverRole = await user.findOne({
            attributes:  {
              include:['role','image',`deviceType`,`notification`]
            },
            where: {
              id: data.receiverId
            },
            raw: true
          });

          var createMessage = await message.create({
            senderId: data.senderId,
            receiverId: data.receiverId,
            senderType: findSenderRole.role,
            receiverType: findReceiverRole.role,
            message: data.message,
            chatConstantId: checkCHatConstants.id,
            messageType: data.messageType,
            booking_id: data.booking_id
          });

          // console.log(createMessage)
          // return

          let updateChatConstant = await chatConstant.update({
            lastMsgId: createMessage.id,
            deletedId: 0
          }, {
            where: {
              id: checkCHatConstants.id
            }
          });
          console.log("333333333333updateChatConstant333333333333",updateChatConstant);
          
          createMessage.dataValues.senderImage = findSenderRole.image
          createMessage.dataValues.receiverImage = findReceiverRole.image
          socket.emit('new_message', createMessage);

          let findReceivedSocketId = await socketUser.findOne({
            where: {
              userId: data.receiverId
            },
            raw: true
          });
          let userdetail = await user.findOne({
            attributes: [`id`, `role`, `verified`, `status`, `username`, `email`, `password`, `forgotPasswordHash`, `facebookId`, `phone`, `country_code`, `image`, `checked`, `socialId`, `socialType`, `googleId`, `deviceType`, `deviceToken`, `created`, `updated`, `createdAt`, `updatedAt`],
            where: {
              id: data.receiverId
            },
            raw: true
          });
          //  console.log(findSenderRole.role,'hhhhhhhhhhhhhhhhhhhhh');return
          if (findSenderRole.role== 1) {
            findsenderName = await user.findOne({
              attributes: ['username', ],
              where: {
                id: data.senderId
              },
              raw:true
            })
          }
          if (findSenderRole.role== 2) {
            findsenderName = await user.findOne({
              attributes: ['username'],
              where: {
                id: data.senderId
              },
              raw:true
            })
          }
          if (findSenderRole.role== 3) {
            findsenderName = await user.findOne({
              attributes: ['username', ],
              where: {
                id: data.senderId
              },
              raw:true
            })
          }
         messaage = findsenderName.username+' Sent You a Message'

         createMessage.dataValues.senderName=findsenderName.username
        console.log("createMessage===================iiiiiiiiiiiiiiiiffffffffffffffffff============================",createMessage);
          if (findReceivedSocketId) {
            io.to(findReceivedSocketId.socketId).emit('new_message', createMessage);
          }
          var messageData = {
            // name:"Booking"+" "+findlocationUser.adress,
            senderId: data.senderId,
            receiverId: data.receiverId,
            messaage:findsenderName.username+' Sent You a Message',
            device_type:findReceiverRole.deviceType,
            device_token:findReceiverRole.deviceToken,
            notification:findReceiverRole.notification,
            booking_id: data.booking_id,
            // role:2,
            type:4,                     //booking
            // job_id:findlocationUser.id
          }
          // console.log("00000000000000000000000000000000000000000",locationUserDeviceToken);
          
          // await helper.sendPushNotificationTifiFunction(locationUserDeviceToken);
          // if (findReceiverRole.deviceType==1 && findReceiverRole.notification==1){
            // helper.sendNotification(userdetail.deviceToken, messaage, "4", createMessage)
            await helper.sendPushNotificationTifiFunction(messageData);

          // }
          // if (findReceiverRole.deviceType==2 && findReceiverRole.notification==1){
          //   // helper.sendNotification(userdetail.deviceToken, messaage, "4", createMessage)
          //   await helper.sendPushNotificationTifiFunction(messageData);

          // }


        } else {
          let createChatConstant = await chatConstant.create({
            senderId: data.senderId,
            receiverId: data.receiverId,
            lastMsgId: 0
          });
// console.log("eeeeeeeeeeeeeeeeelllllllllllllllllssssssssssss");

          //////////////// FIND SENDER AND RECEIVER ROLES ///////////////////////////

          let findSenderRole = await user.findOne({
            attributes: ['role', makeImageUrlSqlsocket(socket, 'user', 'image', 'user')],
            where: {
              id: data.senderId
            },
            raw: true
          });
          // console.log(findSenderRole.image,'findSenderRole=========================')
          let findReceiverRole = await user.findOne({
            attributes:  {
              include:['role', makeImageUrlSqlsocket(socket, 'user', 'image', 'user')]
            },
            where: {
              id: data.receiverId
            },
            raw: true
          });

          var createMessage = await message.create({
            senderId: data.senderId,
            receiverId: data.receiverId,
            senderType: findSenderRole.role,
            receiverType: findReceiverRole.role,
            message: data.message,
            chatConstantId: createChatConstant.id,
            messageType: data.messageType,
            booking_id: data.booking_id
          });

          let updateChatConstant = await chatConstant.update({
            lastMsgId: createMessage.id
          }, {
            where: {
              id: createChatConstant.id
            }
          });
          createMessage.dataValues.senderImage = findSenderRole.image
          createMessage.dataValues.receiverImage = findReceiverRole.image

          socket.emit('new_message', createMessage);

          let findReceivedSocketId = await socketUser.findOne({
            where: {
              userId: data.receiverId
            },
            raw: true
          });
          let userdetail = await user.findOne({
            where: {
              id: data.receiverId
            },
            raw: true
          });

          if (findSenderRole.role == 1) {
             findName = await user.findOne({
              attributes: ['username',],
              where: {
                id: data.senderId
              }
            })
          }
          if (findSenderRole.role == 2) {
            findName = await user.findOne({
             attributes: ['username',],
             where: {
               id: data.senderId
             }
           })
         }
         if (findSenderRole.role == 3) {
          findName = await user.findOne({
           attributes:['username',],
           where: {
             id: data.senderId
           }
         })
       }
          messaage = findName.username+' Sent You a Message'
          createMessage.dataValues.senderName=findName.username
         // console.log(createMessage,"createMessage");return  findsenderName.name+' '+findsenderName.lastName
          if (findReceivedSocketId) {
            io.to(findReceivedSocketId.socketId).emit('new_message', createMessage);
          }
          var messageData = {
            // name:"Booking"+" "+findlocationUser.adress,
            senderId: data.senderId,
            receiverId: data.receiverId,
            messaage:findName.username+' Sent You a Message',
            device_type:findReceiverRole.deviceType,
            device_token:findReceiverRole.deviceToken,
            notification:findReceiverRole.notification,
            booking_id: data.booking_id,

            // role:2,
            type:4,                     //booking
            // job_id:findlocationUser.id
          }
          // helper.sendNotification(userdetail.deviceToken, messaage, "4", createMessage)
          await helper.sendPushNotificationTifiFunction(messageData);

        }
      } catch (error) {
        throw error;
      }
    }
    )

    socket.on('chat_listing', async function (data) {
      try {
        var url_get = "https://app.mypicspop.com/uploads/user/"

        var chat_listing = await database.query(`select *,(select Count(*) from message where (receiverId=${data.userId} and senderId=sender_id) and (readStatus=0)) as unreadcount from (SELECT *,CASE WHEN senderId = ${data.userId} THEN receiverId WHEN receiverId = ${data.userId} THEN senderId  END AS sender_id,
          ifnull((SELECT message FROM message where id=lastMsgId and deletedId!=${data.userId}),'') as lastMessage ,
          (SELECT username FROM user where id=sender_id) as userName,
          (select Count(mg.id) from message as mg where (mg.receiverId=${data.userId} and mg.senderId=sender_id) and (mg.readStatus=0)) as unreadcount1,
          (SELECT username FROM user where id=receiverId) as receiverName,
          (SELECT image FROM user where id=receiverId) as receiverImage,
          (SELECT Count(*) FROM socketUser where userId=senderId) as onlinestatus,
          ifnull((SELECT role FROM user where id=senderId ),'') as senderRole,
           ifnull((SELECT role FROM user where id=receiverId ),'') as receiverRole,
          ifnull((SELECT image FROM user where id=sender_id),'') as userImage,
          (SELECT  created  FROM message where id=lastMsgId) as created_att ,
          (SELECT messageType FROM message where id=lastMsgId) as msg_type from chatConstant where (senderId=${data.userId} or receiverId=${data.userId}) ORDER BY updatedAt DESC )tt where deletedId!=${data.userId}`,
        {
          model: message,
          model: chatConstant,
          mapToModel: true,
          type: database.QueryTypes.SELECT
        })
        // console.log('otheruserid===========',chat_listing);  name
        // chat_listing = await Promise.all(chat_listing.map( dataa => {
        //   dataa = dataa.toJSON();
        //   console.log('otheruserid===========', dataa )
          
        //   return dataa;
        // }));
        // if (chat_listing) {
          // return
          chat_listing = chat_listing.map(value => {
                value = value.toJSON();
                console.log("llllllllllllllllllllllllllllllllllllll",value);
                
                return value;
            });
        // }
        // console.log("-----------------chat_listing",chat_listing);
        
        socket.emit('chat_message', chat_listing)
      } catch (error) {
        throw error;
      }
    });

    socket.on('chat_listing_booking', async function (data) {
      try {
        var url_get = "https://app.mypicspop.com/uploads/user/"

        let chat_listing = await message.findAll({
          attributes: [`id`, `senderId`, `receiverId`, `senderType`,`booking_id`, `receiverType` , `message`, `created`, `updated`, `createdAt`, `updatedAt`,
          [sequelize.literal('(SELECT lastMsgId FROM chatConstant WHERE ((senderId = '+data.senderId+' and receiverId = '+data.receiverId+') OR (senderId = '+data.receiverId+' and receiverId = '+data.senderId+')))'), 'lastMsgId'],
          [sequelize.literal(`ifnull((SELECT message FROM message WHERE id = lastMsgId),'')`), 'lastMessage'],

           [sequelize.literal(`ifnull((SELECT locationOwnerId FROM bookings WHERE id = booking_id),'')`), 'locationOwnerId'],
           [sequelize.literal(`ifnull((SELECT adress FROM locationOwnerDetail WHERE id = locationOwnerId),'')`), 'locationName'],
           [sequelize.literal(`ifnull((SELECT serviceProviderId FROM bookings WHERE id = booking_id),'')`), 'serviceProviderId'],
           [sequelize.literal(`ifnull((SELECT businessName FROM businessProfessionalDetail WHERE id = serviceProviderId),'')`), 'businessName'],
           [sequelize.literal(`ifnull((SELECT username FROM user WHERE id = ${data.receiverId}),'')`), 'receiverName'],
           [sequelize.literal('(SELECT case when `user`.`image`="" then "" else concat("' + url_get + '",`user`.`image`) end FROM user WHERE user.id = '+data.receiverId+' )'), 'receiverImage'],
            [sequelize.literal(`(SELECT role FROM user WHERE id = ${data.senderId})`), 'senderRole'],
             [sequelize.literal(`(SELECT role FROM user WHERE id = ${data.receiverId})`), 'receiverRole']], group: ["message.booking_id"],
          where: {
            [Op.or]: [{
              senderId: data.senderId,
              receiverId: data.receiverId
            }, {
              senderId: data.receiverId,
              receiverId: data.senderId

            }],
            [Op.not]: [{
              deletedId: data.senderId
            }]
          },
        })
          chat_listing = chat_listing.map(value => {
                value = value.toJSON();
                return value;
            });
        // }
        // console.log("-----------------chat_listing",chat_listing);
        
        socket.emit('chat_message_booking', chat_listing)
      } catch (error) {
        throw error;
      }
    });
    socket.on('get_message', async function (data) {
      try {
        var url_get = "https://app.mypicpop.com/uploads/user/"

        let findMessage = await message.findAll({
          attributes: [`id`, `senderId`, `receiverId`, `senderType`, `booking_id`, `receiverType`, `chatConstantId`, `message`, `readStatus`, `messageType`, `deletedId`, `created`, `updated`, `createdAt`, `updatedAt`,
           [sequelize.literal(`ifnull((SELECT username FROM user WHERE id = ${data.senderId}),'')`), 'senderName'],
           [sequelize.literal('(SELECT case when `user`.`image`="" then "" else concat("' + url_get + '",`user`.`image`) end FROM user WHERE user.id = '+data.senderId+' )'), 'senderImage'],
           [sequelize.literal(`ifnull((SELECT username FROM user WHERE id = ${data.receiverId}),'')`), 'receiverName'],
           [sequelize.literal('(SELECT case when `user`.`image`="" then "" else concat("' + url_get + '",`user`.`image`) end FROM user WHERE user.id = '+data.receiverId+' )'), 'receiverImage'],
            [sequelize.literal(`(SELECT role FROM user WHERE id = ${data.senderId})`), 'senderRole'],
             [sequelize.literal(`(SELECT role FROM user WHERE id = ${data.receiverId})`), 'receiverRole']],
          where: {
            [Op.or]: [{
              senderId: data.senderId,
              receiverId: data.receiverId
            }, {
              senderId: data.receiverId,
              receiverId: data.senderId

            }],
            booking_id:data.booking_id,

            [Op.not]: [{
              deletedId: data.senderId
            }]
          }
        })
        console.log("------------------------------findMessagefindMessage--------------",findMessage);
        
        findMessage = await Promise.all(findMessage.map(async dataa => {
          dataa = dataa.toJSON();
          // console.log(dataa, 'dataa===========')

          // if (dataa.senderRole == 1) {
            let find_detail = await user.findOne({
              attributes: ['username','image'
                // [sequelize.literal('(SELECT case when `user`.`image`="" then "" else concat("' + url_get + '",`user`.`image`) end FROM user WHERE user.id = userDetail.userId )'), 'senderImage']
                // helper.makeImageUrlSqlsocket(socket, 'user', 'image', 'users')
              ],
              where: {
                id: data.senderId
              },
              raw: true
            })
            // console.log(find_detail, '--------------------------1')
            dataa.senderName = find_detail.username
            dataa.senderImage = find_detail.image
          // }
            // if (dataa.receiverRole == 3) {
              let find_detailreciever = await user.findOne({
                attributes: ['username','image'
                  // [sequelize.literal('(SELECT case when `user`.`image`="" then "" else concat("' + url_get + '",`user`.`image`) end FROM user WHERE user.id = userDetail.userId )'), 'recieverImage']
                  // helper.makeImageUrlSqlsocket(socket, 'user', 'image', 'users')
                ],
                where: {
                  id: data.receiverId,
                },
                raw: true
              })
              // console.log(find_detailreciever, '--------------------------1')
              dataa.receiverName = find_detailreciever.username
              dataa.receiverImage = find_detailreciever.image
            // }
            let update_read_status = await message.update({
              readStatus: 1
            },
              {
                where: {
                  senderId:   data.receiverId,
                  receiverId: data.senderId,
                  booking_id:data.booking_id,
                }
              }
            );
          // if (dataa.senderRole == 2) {
          //   let find_detail = await user.findOne({
          //     attributes: ['username','image'
          //       // [sequelize.literal('(SELECT case when `user`.`image`="" then "" else concat("' + url_get + '",`user`.`image`) end FROM user WHERE user.id = userDetail.userId )'), 'senderImage']
          //       // helper.makeImageUrlSqlsocket(socket, 'user', 'image', 'users')
          //     ],
          //     where: {
          //       id: data.senderId
          //     },
          //     raw: true
          //   })
          //   // console.log(find_detail, '--------------------------1')
          //   dataa.senderName = find_detail.username
          //   dataa.senderImage = find_detail.image
          // }

          // if (dataa.senderRole == 3) {
          //   let find_detail = await user.findOne({
          //     attributes: ['username','image'
          //       // [sequelize.literal('(SELECT case when `user`.`image`="" then "" else concat("' + url_get + '",`user`.`image`) end FROM user WHERE user.id = userDetail.userId )'), 'senderImage']
          //       // helper.makeImageUrlSqlsocket(socket, 'user', 'image', 'users')
          //     ],
          //     where: {
          //       id: data.senderId
          //     },
          //     raw: true
          //   })
          //   // console.log(find_detail, '--------------------------1')
          //   dataa.senderName = find_detail.username
          //   dataa.senderImage = find_detail.image
          // }

          // if (dataa.receiverRole == 1) {
          //   let find_detailreciever = await user.findOne({
          //     attributes: ['username','image'
          //       // [sequelize.literal('(SELECT case when `user`.`image`="" then "" else concat("' + url_get + '",`user`.`image`) end FROM user WHERE user.id = userDetail.userId )'), 'recieverImage']
          //       // helper.makeImageUrlSqlsocket(socket, 'user', 'image', 'users')
          //     ],
          //     where: {
          //       id: data.receiverId,
          //     },
          //     raw: true
          //   })
          //   // console.log(find_detailreciever, '--------------------------1')
          //   dataa.receiverName = find_detailreciever.username
          //   dataa.receiverImage = find_detailreciever.image
          // }

          // if (dataa.receiverRole == 2) {
          //   let find_detailreciever = await user.findOne({
          //     attributes: ['username','image'
          //       // [sequelize.literal('(SELECT case when `user`.`image`="" then "" else concat("' + url_get + '",`user`.`image`) end FROM user WHERE user.id = userDetail.userId )'), 'recieverImage']
          //       // helper.makeImageUrlSqlsocket(socket, 'user', 'image', 'users')
          //     ],
          //     where: {
          //       id: data.receiverId,
          //     },
          //     raw: true
          //   })
          //   // console.log(find_detailreciever, '--------------------------1')
          //   dataa.receiverName = find_detailreciever.username
          //   dataa.receiverImage = find_detailreciever.image
          // }

          
          console.log("===================================================================================",dataa);
          
          return dataa;
        }));

        socket.emit('get_data_message', findMessage)

      } catch (error) {
        throw error;
      }
    })

    socket.on('read_unread_status', async function (data) {
      try {
        let update_read_status = await message.update({
          readStatus: 1
        },
          {
            where: {
              senderId:   data.receiverId,
              receiverId: data.senderId,
              booking_id: data.booking_id

            }
          }
        );
     
        let success_message = {
          'success_message': 'Status update successfully'
        };

        socket.emit('read_unreadlistner', success_message);
      } catch (error) {
        throw error
      }

    })

    socket.on('delete_chat', async function (data) {
      try {
        get_block_status_data = await chatConstant.findOne({
          where: {
            [Op.or]: [
              { senderId: data.senderId, receiverId: data.receiverId },
              { receiverId: data.senderId, senderId: data.receiverId }
            ]
          },
          raw: true
        });
        //   console.log(get_block_status_data,"innnnnnnnnnnnnn");return
        if (get_block_status_data.deletedId != 0) {
          delete_chat_list_data_user = await chatConstant.destroy({
            where: {
              id: get_block_status_data.id
            }
          });

          delete_all_messages = await message.destroy({

            where: {
              [Op.or]: [
                { senderId: data.senderId, receiverId: data.receiverId },
                { receiverId: data.senderId, senderId: data.receiverId }

              ]
            }
          });

        } else {
          //  console.log("innnnnnnnnnnnnn");return
          delete_chat_list_data_user = await chatConstant.update({
            deletedId: data.senderId
          },
            {
              where: {
                [Op.or]: [
                  { senderId: data.senderId, receiverId: data.receiverId },
                  { receiverId: data.senderId, senderId: data.receiverId }

                ]
              }
            }
          );
          // console.log(delete_chat_list_data_user,"delete_chat_list_data_user");return
          destroy_all_messages = await message.destroy({

            where: {
              [Op.or]: [
                { senderId: data.senderId, receiverId: data.receiverId },
                { receiverId: data.senderId, senderId: data.receiverId }

              ],
              [Op.not]: {
                deletedId: 0
              }
            }
          });

          delete_all_messages = await message.update({
            deletedId: data.senderId
          },
            {
              where: {
                deletedId: 0,
                [Op.or]: [
                  { senderId: data.senderId, receiverId: data.receiverId },
                  { receiverId: data.senderId, senderId: data.receiverId }

                ]
              }
            }
          );

        }
        let success_message = {
          'success_message': 'chat cleared successfully'
        };

        socket.emit('cleared_chat', success_message);
      } catch (error) {
        throw error
      }

    })

  });
}