import { Document, Schema, Types, model } from 'mongoose';

export interface IFollow extends Document {
  followerId: Types.ObjectId;
  followingId: Types.ObjectId;
  createdAt: Date;
}

const followSchema = new Schema<IFollow>(
  {
    followerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    followingId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// আলাদা কালেকশন — user ডকুমেন্টে followers/following embedded array রাখলে জনপ্রিয় লেখকের
// ডকুমেন্ট অস্বাভাবিক বড় হয়ে যেত (mongodb.md-তে এই সিদ্ধান্তের যুক্তি নোট করা আছে)।
followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

export const Follow = model<IFollow>('Follow', followSchema);
