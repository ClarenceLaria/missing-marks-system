'use client'; // Ensure this file runs on the client-side

import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import Link from 'next/link';

type Report = {
  id: number;
  title: string;
  unitCode: string;
  date: Date;
  status: string;
  button?: string;
}

interface ColumnData {
  dataKey: keyof Report;
  label: string;
  numeric?: boolean;
  width: number;
  button?: string;
}

interface TableProps {
  reports: Report[];
}

const columns: ColumnData[] = [
  {
    width: 200,
    label: 'Unit Name',
    dataKey: 'title',
  },
  {
    width: 120,
    label: 'Unit Code',
    dataKey: 'unitCode',
    numeric: true,
  },
  {
    width: 120,
    label: 'Date',
    dataKey: 'date',
    numeric: true,
  },
  {
    width: 150,
    label: 'Action',
    dataKey: 'button',
    numeric: true,
  },
  {
    width: 150,
    label: 'Status',
    dataKey: 'status',
    numeric: true,
  },
];

const VirtuosoTableComponents: TableComponents<Report> = {
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
  ),
  TableHead: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableHead {...props} ref={ref} />
  )),
  TableRow,
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

if (VirtuosoTableComponents.Scroller) {
    VirtuosoTableComponents.Scroller.displayName = 'Scroller';
  }
  if (VirtuosoTableComponents.TableHead) {
    VirtuosoTableComponents.TableHead.displayName = 'TableHead';
  }
  if (VirtuosoTableComponents.TableBody) {
    VirtuosoTableComponents.TableBody.displayName = 'TableBody';
  }
  
function fixedHeaderContent() {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          variant="head"
          align={column.numeric ? 'right' : 'left'}
          style={{ width: column.width }}
          sx={{ backgroundColor: 'background.paper' }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
}

function rowContent(_index: number, row: Report) {
  return (
    <>
      {columns.map((column) => (
        <TableCell key={column.dataKey} align={column.numeric ? 'right' : 'left'}>
          {column.dataKey === 'date' ? (row.date as Date).toLocaleDateString() : row[column.dataKey]}
          {column.dataKey === 'button' ? 
           <Link href={`/Lecturer/submissions/${row.id}`} >
              <button className='bg-sky-300 rounded-full p-1 lg:rounded-md'>
                <h1 className='px-2 hidden lg:block'>View</h1>
              </button></Link> : ''}
            
        </TableCell>
      ))}
    </>
  );
}

export default function ReactVirtualizedTable({reports}: TableProps) {
  return (
    <Paper style={{ height: 550, width: '100%' }} className="mt-6">
      <TableVirtuoso
        data={reports}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
      />
    </Paper>
  );
}
