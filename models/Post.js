import mongoose from 'mongoose';

const LinkSchema = new mongoose.Schema({
  label: String,
  url: String,
  clicks: { type: Number, default: 0 },
  isPremium: { type: Boolean, default: false },
});

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: String,
  genre: String,
  year: String,
  language: String,
  rating: String,
  description: String,
  thumbnail: String,
  tags: [String],
  links: [LinkSchema],
  views: { type: Number, default: 0 },
  isPremium: { type: Boolean, default: false },
  status: { type: String, enum: ['published', 'draft'], default: 'published' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
