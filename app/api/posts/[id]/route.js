import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  await connectDB();
  // params.id can be slug or _id
  const post = await Post.findOne({
    $or: [{ slug: params.id }, { _id: params.id.match(/^[a-f\d]{24}$/i) ? params.id : null }]
  });
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await Post.findByIdAndUpdate(post._id, { $inc: { views: 1 } });
  return NextResponse.json(post);
}

export async function PUT(req, { params }) {
  await connectDB();
  const body = await req.json();
  const post = await Post.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(post);
}

export async function DELETE(req, { params }) {
  await connectDB();
  await Post.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
