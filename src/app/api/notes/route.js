import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Note from '@/models/Note';
import { uploadToCloudinary } from '@/lib/cloudinary';
import fs from 'fs';

// GET all notes
export async function GET() {
  try {
    await connectDB();
    const notes = await Note.find().sort({ createdAt: -1 });
    return NextResponse.json(notes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

// POST a new note
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const formData = await request.formData();
    const title = formData.get('title');
    const description = formData.get('description');
    const file = formData.get('file');

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = `/tmp/${file.name}`;

    fs.writeFileSync(filePath, buffer);

    const { url, publicId } = await uploadToCloudinary(filePath);

    fs.unlinkSync(filePath);

    const newNote = await Note.create({
      title,
      description,
      url,
      publicId,
      uploadedBy: session.user.email,
    });

    return NextResponse.json(newNote);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}
