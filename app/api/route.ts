import { NextResponse } from 'next/server';

import { handleErrorResponse } from '@/app/api/errorHandler';

export async function GET(request: Request) {
  try {
    return NextResponse.json({ message: 'hi' });
  } catch (error) {
    return handleErrorResponse(error);
  }
}
