import { Document, Schema, Types, model } from 'mongoose';

export interface ILike extends Document {
  userId: Types.ObjectId;
  articleId: Types.ObjectId;
  createdAt: Date;
}

const likeSchema = new Schema<ILike>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    articleId: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// একজন ইউজার একটা আর্টিকেল একবারই লাইক করতে পারবে — DB লেভেলে গ্যারান্টি করা।
likeSchema.index({ userId: 1, articleId: 1 }, { unique: true });

export const Like = model<ILike>('Like', likeSchema);
