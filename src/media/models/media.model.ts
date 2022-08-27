import { Schema, Document } from 'mongoose';

const MediaSchema = new Schema(
  {
    name: String,
    file_name: String,
    mime_type: String,
    size: Number,
    key: String,
    created_at: { type: Date, default: Date.now },
  },
  {
    collection: 'media__medias',
  },
);

export { MediaSchema };

export interface Media extends Document {
  name: string;
  file_name: string;
  mime_type: string;
  size: number;
  key: string;
  created_at: Date;
}
