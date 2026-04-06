import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectDB();
  const categories = await Category.find().sort({ count: -1 });
  return NextResponse.json(categories);
}

export async function POST(req) {
  await connectDB();
  const { name } = await req.json();
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const cat = await Category.create({ name, slug });
  return NextResponse.json(cat, { status: 201 });
}
