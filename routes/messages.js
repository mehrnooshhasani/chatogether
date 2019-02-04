const express = require('express');
const router = express.Router();
const passport = require('passport');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

// @route  GET messages/
// @desc   Get chat-room conversation
// @access Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const response = { success: true };

    Conversation.findOne({ name: 'chat-room' }).then(conversation => {
      // Chat-room does not exist so create it
      if (!conversation) {
        const chatRoom = new Conversation({ name: 'chat-room' });

        chatRoom
          .save()
          .then(conversation => {
            response.conversation = conversation;
            res.json(response);
          })
          .catch(err => {
            console.log(err);
            response.success = false;
            res.json(response);
          });
      } else {
        // Chat-room exist so fetch its messages
        Message.find({ conversationId: conversation._id })
          .then(messages => {
            // Add messages array to conversation object
            const conversationObj = Object.assign({}, conversation, {
              messages: messages
            });
            response.conversation = conversationObj;
            res.json(response);
          })
          .catch(err => {
            console.log(err);
            response.success = false;
            res.json(response);
          });
      }
    });
  }
);

// @route  GET messages/:chatWith
// @desc   Get private conversation
// @access Private
router.get(
  '/:chatWith',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const response = { success: true };

    const combo1 = '' + req.user.username + '-' + req.params.chatWith;
    const combo2 = '' + req.params.chatWith + '-' + req.user.username;

    Conversation.findOne()
      .or([{ name: combo1 }, { name: combo2 }])
      .then(conversation => {
        // Conversation does not exist so create it
        if (!conversation) {
          User.findOne({ username: req.params.chatWith })
            .then(user => {
              // Specified user does not exist
              if (!user) {
                response.success = false;
                return res.status(404).json(response);
              }

              // Specified user exist
              const user1 = {
                id: req.user._id,
                username: req.user.username
              };
              const user2 = {
                id: user._id,
                username: user.username
              };
              const participants = [user1, user2];

              const newConv = new Conversation({
                participants: participants,
                name: '' + user1.username + '-' + user2.username
              });

              newConv
                .save()
                .then(conversation => {
                  response.conversation = conversation;
                  res.json(response);
                })
                .catch(err => {
                  console.log(err);
                  response.success = false;
                  res.status(500).json(response);
                });
            })
            .catch(err => {
              console.log(err);
              response.success = false;
              res.status(500).json(response);
            });
        } else {
          // Conversation exist so fetch its messages
          Message.find({ conversationId: conversation._id })
            .then(messages => {
              // Add messages array to conversation object
              const conversationObj = Object.assign({}, conversation, {
                messages: messages
              });
              response.conversation = conversationObj;
              res.json(response);
            })
            .catch(err => {
              console.log(err);
              response.success = false;
              res.json(response);
            });
        }
      });
  }
);

module.exports = router;
