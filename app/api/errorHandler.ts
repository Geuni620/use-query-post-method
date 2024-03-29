import { NextResponse } from 'next/server';

export const handleErrorResponse = (error: unknown) => {
  const message =
    error instanceof Error ? error.message : '알 수 없는 오류 발생';

  return new NextResponse(JSON.stringify({ message }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  });
};
