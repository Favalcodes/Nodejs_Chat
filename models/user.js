import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    firstName: String,
    lastName: String,
    email: String,
  },
  {
    timestamps: true,
    collection: "users",
  }
);

userSchema.statics.createUser = async function (
	firstName, 
  lastName,
  email
) {
  try {
    const user = await this.create({ firstName, lastName, email });
    return user;
  } catch (error) {
    throw error;
  }
}

userSchema.statics.getUserById = async function (id) {
    try {
      const user = await this.findOne({ _id: id });
      if (!user) throw ({ error: 'No user with this id found' });
      return user;
    } catch (error) {
      throw error;
    }
}

userSchema.statics.getUserByEmail = async function (userId) {
    try {
      const user = await this.findOne({ email: userId });
      return user;
    } catch (error) {
      throw error;
    }
}

userSchema.statics.getUsers = async function () {
    try {
      const users = await this.find();
      return users;
    } catch (error) {
      throw error;
    }
}

userSchema.statics.getUserByIds = async function (userIds) {
  try {
    const users = await this.find({ _id: { $in: userIds } });
    if (!users) throw ({ error: "user doesn't exist" });
    return users;
  } catch (error) {
    throw error;
  }
}

userSchema.statics.deleteByUserByEmail = async function (email) {
    try {
      const result = await this.remove({ email: email });
      return result;
    } catch (error) {
      throw error;
    }
}

export default mongoose.model("User", userSchema);