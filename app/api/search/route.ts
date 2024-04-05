import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { handleErrorResponse } from '@/app/api/errorHandler';
import data from '@/app/mock/data.json';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
);

const getRandomDate = (start: Date, end: Date): Date => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
};

type ListItem = (typeof data)[0];
type ListItemWithDate = ListItem & { date: Date };

export async function POST(request: Request) {
  try {
    const startDate = new Date(2020, 0, 1);
    const endDate = new Date(2024, 11, 31);

    const { searchCondition } = await request.json();
    const list: ListItem[] = JSON.parse(
      fs.readFileSync('app/mock/data.json', 'utf-8'),
    );

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .ilike('task', `%${searchCondition}%`);

    if (error) throw new Error(error.message);

    const listWithRandomDates: ListItemWithDate[] = list.map((item) => ({
      ...item,
      date: getRandomDate(startDate, endDate),
    }));

    const filteredList = listWithRandomDates.filter((item: ListItem) => {
      return item.task.toLowerCase().includes(searchCondition.toLowerCase());
    });

    return NextResponse.json({ list: filteredList });
  } catch (error) {
    return handleErrorResponse(error);
  }
}
