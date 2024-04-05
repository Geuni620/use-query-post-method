import fs from 'fs';
import { NextResponse } from 'next/server';

import { handleErrorResponse } from '@/app/api/errorHandler';

export async function POST(request: Request) {
  // TODO: 서버데이터
  try {
    return NextResponse.json({ list: filteredList });
  } catch (error) {
    return handleErrorResponse(error);
  }
}
