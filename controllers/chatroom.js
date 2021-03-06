// utils
import makeValidation from '@withvoid/make-validation';
// models
import ChatRoomModel from '../models/ChatRoom.js';
import ChatMessageModel from '../models/ChatMessage.js';
import UserModel from '../models/User.js';

export default {
  initiate: async (req, res) => {
    try {
      const validation = makeValidation(types => ({
        payload: req.body,
        checks: {
          userIds: { 
            type: types.array, 
            options: { unique: true, empty: true, stringOnly: true } 
          },
          roomName: { type: types.string, empty: false, stringOnly: true},
          description: { type: types.string, empty: false, stringOnly: true},
        }
      }));
      if (!validation.success) return res.status(400).json({ ...validation });
  
      const { userIds, roomName, description } = req.body;
      const { userId: chatInitiator } = req;
      const allUserIds = [...userIds, chatInitiator];
      const chatRoom = await ChatRoomModel.initiateChat(allUserIds, roomName, description, chatInitiator);
      return res.status(200).json({ success: true, chatRoom });
    } catch (error) {
      return res.status(500).json({ success: false, error: error })
    }
  },
  postMessage: async (req, res) => {
    try {
      const { roomId } = req.params;
      const validation = makeValidation(types => ({
        payload: req.body,
        checks: {
          messageText: { type: types.string },
        }
      }));
      if (!validation.success) return res.status(400).json({ ...validation });
  
      const messagePayload = {
        messageText: req.body.messageText,
      };
      const currentLoggedUser = req.userId;
      const post = await ChatMessageModel.createPostInChatRoom(roomId, messagePayload, currentLoggedUser);
      global.io.sockets.in(roomId).emit('new message', { message: post });
      return res.status(200).json({ success: true, post });
    } catch (error) {
      return res.status(500).json({ success: false, error: error })
    }
  },
    getRoomByRoomName: async (req, res) => {
      try {
        const { chatroom } = req.params;
        const room = await ChatRoomModel.getRoomByName(chatroom);
        if (!room) {
          return res.status(400).json({
            success: false,
            message: 'This room does not exist',
          })
        }
        return res.status(200).json({ success: true, room });
      } catch (error) {
        return res.status(500).json({ success: false, error: error })
      }
    },
    getAllRooms: async (req, res) => {
      try {
        const rooms = await ChatRoomModel.getRooms();
        return res.status(200).json({ success: true, rooms });
      } catch (error) {
        return res.status(500).json({ success: false, error: error })
      }
    },
    getRoomUsers: async (req, res) => {
      try{
        const { roomName } = req.params;
        const room = await ChatRoomModel.getRoomByName(roomName)
        console.log(room)
        if (!room) {
          return res.status(400).json({
            success: false,
            message: 'No room exists for this name',
          })
        }
        const users = await UserModel.getUserByEmail(room.userIds);
        return res.status(200).json({ success: true, users})
      } catch (error) {
        return res.status(500).json({ success: false, error: error})
      }
    },
    getConversationByRoomId: async (req, res) => {
      try {
        const { roomId } = req.params;
        const room = await ChatRoomModel.getChatRoomByRoomId(roomId)
        if (!room) {
          return res.status(400).json({
            success: false,
            message: 'No room exists for this id',
          })
        }
        const users = await UserModel.getUserByEmail(room.userIds);
        const options = {
          page: parseInt(req.query.page) || 0,
          limit: parseInt(req.query.limit) || 10,
        };
        const conversation = await ChatMessageModel.getConversationByRoomId(roomId, options);
        return res.status(200).json({
          success: true,
          conversation,
          users,
        });
      } catch (error) {
        return res.status(500).json({ success: false, error });
      }
    },
    markConversationReadByRoomId: async (req, res) => {
      try {
        const { roomId } = req.params;
        const room = await ChatRoomModel.getChatRoomByRoomId(roomId)
        if (!room) {
          return res.status(400).json({
            success: false,
            message: 'No room exists for this id',
          })
        }
    
        const currentLoggedUser = req.userId;
        const result = await ChatMessageModel.markMessageRead(roomId, currentLoggedUser);
        return res.status(200).json({ success: true, data: result });
      } catch (error) {
        return res.status(500).json({ success: false, error });
      }
    },
  }