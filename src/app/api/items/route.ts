import { NextResponse } from 'next/server';
import { items } from '@/lib/data';
import type { Item } from '@/lib/data';

// GET all items
export async function GET() {
  return NextResponse.json(items);
}

// POST a new item
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name || !description) {
      return NextResponse.json({ message: 'Name and description are required' }, { status: 400 });
    }

    const newItem: Item = {
      id: (items.length + 1).toString(), // simple id generation
      name,
      description,
    };

    items.push(newItem);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
  }
}
