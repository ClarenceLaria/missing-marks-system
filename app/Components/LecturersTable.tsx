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

interface Lecturer {
  name: string;
  email: String;
  phoneNo: string;
  role: string;
}

interface ColumnData {
  dataKey: keyof Lecturer;
  label: string;
  numeric?: boolean;
  width: number;
  button?: string;
}

interface TableProps{
  lecturers: Lecturer[];
}


const columns: ColumnData[] = [
  {
    width: 200,
    label: "Lecturer's Name",
    dataKey: 'name',
  },
  {
    width: 120,
    label: 'Email',
    dataKey: 'email',
    numeric: true,
  },
  {
    width: 150,
    label: 'Phone Number',
    dataKey: 'phoneNo',
    numeric: true,
  },
  {
    width: 150,
    label: 'user Role',
    dataKey: 'role',
    numeric: true,
  },
];

const VirtuosoTableComponents: TableComponents<Lecturer> = {
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
    EmptyPlaceholder: () => (
      <TableRow>
        <TableCell colSpan={columns.length} align="center">
          <div className="p-4 text-gray-500">There are no Lecturers here!</div>
        </TableCell>
      </TableRow>
    ),
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

function rowContent(_index: number, row: Lecturer) {
  return (
    <>
      {columns.map((column) => (
        <TableCell key={column.dataKey} align={column.numeric ? 'right' : 'left'}>
          {row[column.dataKey]}
        </TableCell>
      ))}
    </>
  );
}

export default function ReactVirtualizedTable({lecturers}: TableProps) {
  return (
    <Paper style={{ height: 550, width: '100%' }} className="mt-6">
      <TableVirtuoso
        data={lecturers}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
      />
    </Paper>
  );
}
