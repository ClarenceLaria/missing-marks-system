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

interface Student {
  name: string;
  email: String;
  regNo: string;
  role: string;
}

interface ColumnData {
  dataKey: keyof Student;
  label: string;
  numeric?: boolean;
  width: number;
  button?: string;
}

interface TableProps{
  students: Student[];
}

const columns: ColumnData[] = [
  {
    width: 200,
    label: 'User Name',
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
    label: 'Reg Number',
    dataKey: 'regNo',
    numeric: true,
  },
  {
    width: 150,
    label: 'user Role',
    dataKey: 'role',
    numeric: true,
  },
];

const VirtuosoTableComponents: TableComponents<Student> = {
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

function rowContent(_index: number, row: Student) {
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

export default function ReactVirtualizedTable({students}: TableProps) {
  return (
    <Paper style={{ height: 550, width: '100%' }} className="mt-6">
      <TableVirtuoso
        data={students}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
      />
    </Paper>
  );
}
