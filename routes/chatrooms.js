import express from 'express';
// controllers
import chatRoom from '../controllers/chatroom.js';

const router = express.Router();

router
  // .get('/', chatRoom.getRecentConversation)
  .get('/:roomId', chatRoom.getConversationByRoomId)
  .get('/search/:chatroom', chatRoom.getRoomByRoomName)
  .post('/initiate', chatRoom.initiate)
  .post('/:roomId/message', chatRoom.postMessage)
  .put('/:roomId/mark-read', chatRoom.markConversationReadByRoomId)

export default router;