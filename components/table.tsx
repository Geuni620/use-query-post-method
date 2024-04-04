import type { Row as TRow, Table as TTable } from '@tanstack/react-table';
import {
  ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Status {
  id: number;
  name: string;
}

interface ColumnDataProps {
  task: string;
  status: Status;
  notes: string;
  date: Date;
}

interface TableProps {
  table: TTable<ColumnDataProps>;
}

interface RowProps {
  row: TRow<ColumnDataProps>;
}

type TableComponentsProps = {
  data: ColumnDataProps[];
};

export const TableComponents: React.FC<TableComponentsProps> = ({ data }) => {
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  console.log('rowSelection', rowSelection);

  const columnHelper = createColumnHelper<ColumnDataProps>();
  const columns = [
    {
      id: 'select',
      header: ({ table }: TableProps) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }: RowProps) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      size: 50,
    },
    columnHelper.accessor('task', {
      header: ({ column }) => {
        return (
          <div
            className="flex cursor-pointer items-center justify-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Task
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        );
      },

      cell: (props) => <p>{props.getValue()}</p>,
      size: 250,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (props) => <p>{props.getValue().name}</p>,
      size: 100,
      enableSorting: false,
    }),
    columnHelper.accessor('notes', {
      header: 'Notes',
      size: 300,
      cell: (props) => <p>{props.getValue()}</p>,
      enableSorting: false,
    }),
    columnHelper.accessor('date', {
      header: 'Date',
      size: 200,
      cell: (props) => <p>{format(props.getValue(), 'yyyy-MM-dd HH:mm:ss')}</p>,
    }),
  ];

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,

    state: {
      rowSelection,
      columnFilters,
      sorting,
    },

    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

  return (
    <>
      {/* Table */}
      <Table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={{
                    width: `${header.getSize()}px`,
                    border: '1px solid gray',
                    textAlign: 'center',
                    padding: 0,
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  style={{
                    width: `${cell.column.getSize()}px`,
                    border: '1px solid gray',
                    textAlign: 'center',
                    padding: '0.5rem 0.5rem',
                    height: '40px',
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
