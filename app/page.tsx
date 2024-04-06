'use client';

import { FormEvent, useRef } from 'react';

import { TableComponents } from '@/components/table';
import { Input } from '@/components/ui/input';
import { useTableDataGetQuery } from '@/hook/useTableDataGetQuery';

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const tableList = useTableDataGetQuery({
    searchCondition: inputRef.current?.value || '',
  });

  console.log('inputRef.current?.value', inputRef.current?.value);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log('inputRef.current?.value', inputRef.current?.value);

    if (inputRef.current?.value) {
      console.log('hihi');
      tableList.refetch();
    }
  };

  return (
    <div className="h-screen w-screen">
      <div className="mx-auto w-[900px] pb-20 pt-10">
        <form
          onSubmit={onSubmit}
          className="mb-2 flex items-center justify-between gap-2"
        >
          <Input
            ref={inputRef}
            className="w-[20%]"
            type="text"
            placeholder="Task name"
          />
        </form>
        <TableComponents data={tableList.data?.list || []} />
      </div>
    </div>
  );
}
