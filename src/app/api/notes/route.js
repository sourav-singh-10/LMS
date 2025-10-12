import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Note from '@/models/Note';
import { uploadToCloudinary } from '@/lib/cloudinary';

// GET all notes
export async function GET() {
  try {
    await connectDB();
    const notes = await Note.find().sort({ createdAt: -1 });
    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

// POST a new note
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is admin
    if (!session || !session.user.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const formData = await request.formData();
    const title = formData.get('title');
    const description = formData.get('description');
    const file = formData.get('file');
    
    if (!title || !file) {
      return NextResponse.json(
        { error: 'Title and file are required' },
        { status: 400 }
      );
    }
    
    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = `/tmp/${file.name}`;
    
    // Save file temporarily
    const fs = require('fs');
    fs.writeFileSync(filePath, buffer);
    
    // Upload to Cloudinary
    const { url, publicId } = await uploadToCloudinary(filePath);
    
    // Remove temporary file
    fs.unlinkSync(filePath);
    
    // Create new note
    const newNote = new Note({
      title,
      description,
      url,
      publicId,
      uploadedBy: session.user.email,
    });
    
    await newNote.save();
    
    return NextResponse.json(newNote);
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    );
  }
}