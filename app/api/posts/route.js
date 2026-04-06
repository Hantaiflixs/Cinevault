import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import { NextResponse } from 'next/server';

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

// GET /api/posts?page=1&category=bollywood&q=kalki
export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 12;
  const category = searchParams.get('category');
  const q = searchParams.get('q');

  const query = { status: 'published' };
  if (category && category !== 'all') query.category = category;
  if (q) query.title = { $regex: q, $options: 'i' };

  const total = await Post.countDocuments(query);
  const posts = await Post.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .select('-links');

  return NextResponse.json({ posts, total, pages: Math.ceil(total / limit) });
}

// POST /api/posts — admin only
export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const slug = slugify(body.title) + '-' + Date.now();
  const post = await Post.create({ ...body, slug });
  return NextResponse.json(post, { status: 201 });
}
