import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export const CHAT_ROOM_TYPES = {
  ENDUSER_TO_ENDUSER: "enduser-to-enduser",
  ENDUSER_TO_ADMIN: "enduser-to-admin",
};

const chatRoomSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    userIds: Array,
    roomName: String,
    description: String,
    type: String,
    chatInitiator: String,
  },
  {
    timestamps: true,
    collection: "chatrooms",
  }
);

chatRoomSchema.statics.initiateChat = async function (
	userIds, roomName, description, type, chatInitiator
) {
  try {
    const availableRoom = await this.findOne({
      roomName
    });
    if (availableRoom) {
      return {
        isNew: false,
        message: `retrieving an old chat room... ${availableRoom._doc.roomName} channel retrieved`,
        chatRoomId: availableRoom._doc._id,
        type: availableRoom._doc.type,
      };
    }

    const newRoom = await this.create({ userIds, roomName, description, type, chatInitiator });
    return {
      isNew: true,
      message: `creating a new chatroom... ${newRoom._doc.roomName} channel is created`,
      chatRoomId: newRoom._doc._id,
      type: newRoom._doc.type,
    };
  } catch (error) {
    console.log('error on start chat method', error);
    throw error;
  }
}

chatRoomSchema.statics.getChatRoomByRoomId = async function (roomId) {
  try {
    const room = await this.findOne({ _id: roomId });
    return room;
  } catch (error) {
    throw error;
  }
}

export default mongoose.model("ChatRoom", chatRoomSchema);