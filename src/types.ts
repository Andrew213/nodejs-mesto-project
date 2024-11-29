import mongoose, { Types } from "mongoose";

export interface AuthContext{
  user?: {_id: Types.ObjectId | string}
}

export type JWTpayload = {
  _id: mongoose.Types.ObjectId
}
