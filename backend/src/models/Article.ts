import { Document, Schema, Types, model } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  authorId: Types.ObjectId;
  likeCount: number;
  createdAt: Date;
}

const articleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    coverImage: { type: String },
    category: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    likeCount: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

articleSchema.index({ createdAt: -1 });
articleSchema.index({ category: 1 });
articleSchema.index({ tags: 1 });
articleSchema.index({ title: 'text', content: 'text' });

export const Article = model<IArticle>('Article', articleSchema);
