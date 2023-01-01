import { Schema, Document } from 'mongoose';

const UserSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    refreshToken: String,
    twoFactorAuthenticationSecret: String,
    isTwoFactorAuthenticationEnabled: { type: Boolean, default: false },
  },
  {
    collection: 'users',
  },
);

UserSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
  // count: true,
  match: {
    categories: { $size: 2 },
  },
});

export { UserSchema };

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  refreshToken: string;
  twoFactorAuthenticationSecret: string;
  isTwoFactorAuthenticationEnabled: boolean;
}
