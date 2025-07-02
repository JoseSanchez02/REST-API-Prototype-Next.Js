import { NextResponse } from 'next/server';
import { items } from '@/lib/data';

interface Params {
  params: {
    id: string;
  };
}

// GET a single item by ID
export async function GET(request: Request, { params }: Params) {
  const item = items.find(item => item.id === params.id);
  if (!item) {
    return NextResponse.json({ message: 'Item not found' }, { status: 404 });
  }
  return NextResponse.json(item);
}

// PUT (update) an item by ID
export async function PUT(request: Request, { params }: Params) {
  const itemIndex = items.findIndex(item => item.id === params.id);
  if (itemIndex === -1) {
    return NextResponse.json({ message: 'Item not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { name, description } = body;

    if (name === undefined && description === undefined) {
      return NextResponse.json({ message: 'Name or description must be provided for update' }, { status: 400 });
    }
    
    const updatedItem = { ...items[itemIndex] };

    if (name !== undefined) {
      updatedItem.name = name;
    }

    if (description !== undefined) {
      updatedItem.description = description;
    }

    items[itemIndex] = updatedItem;

    return NextResponse.json(updatedItem);
  } catch (error) {
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
  }
}

// DELETE an item by ID
export async function DELETE(request: Request, { params }: Params) {
  const itemIndex = items.findIndex(item => item.id === params.id);
  if (itemIndex === -1) {
    return NextResponse.json({ message: 'Item not found' }, { status: 404 });
  }

  items.splice(itemIndex, 1);

  return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });
}
