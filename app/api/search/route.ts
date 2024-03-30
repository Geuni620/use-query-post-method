import fs from 'fs';
import { NextResponse } from 'next/server';

import { handleErrorResponse } from '@/app/api/errorHandler';
import data from '@/app/mock/data.json';

/**
 * TODO: useQuery
export async function GET(request: Request) {
  try {
    const list = JSON.parse(fs.readFileSync('app/mock/data.json', 'utf-8'));

    return NextResponse.json({ list });
  } catch (error) {
    return handleErrorResponse(error);
  }
}
 */

type ListItem = (typeof data)[0];

export async function POST(request: Request) {
  try {
    const { searchCondition } = await request.json();
    const list: ListItem[] = JSON.parse(
      fs.readFileSync('app/mock/data.json', 'utf-8'),
    );

    const filteredList = list.filter((item: ListItem) => {
      return item.task.toLowerCase().includes(searchCondition.toLowerCase());
    });

    return NextResponse.json({ list: filteredList });
  } catch (error) {
    return handleErrorResponse(error);
  }
}
