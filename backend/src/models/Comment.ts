import { Document, Schema, Types, model } from 'mongoose';

export interface IComment extends Document {
  articleId: Types.ObjectId;
  authorId: Types.ObjectId;
  text: string;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    articleId: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

commentSchema.index({ articleId: 1, createdAt: -1 });

export const Comment = model<IComment>('Comment', commentSchema);
