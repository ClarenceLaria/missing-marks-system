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

interface Data {
  name: string;
  email: String;
  regNo: string;
  role: string;
  button?: string;
}

function createData(
  name: string,
  email: String,
  regNo: string,
  role: string,
  button?: string,
) {
  return { name, email, regNo, role, button};
}

interface ColumnData {
  dataKey: keyof Data;
  label: string;
  numeric?: boolean;
  width: number;
  button?: string;
}

const data = 'Student'
const sample = [createData('Byrone Kingsly', 'byronekingsly@gmail.com', 'MMUST/22807/2011', 'Student')];

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
    width: 120,
    label: 'Reg Number',
    dataKey: 'regNo',
    numeric: true,
  },
  {
    width: 120,
    label: 'user Role',
    dataKey: 'role',
    numeric: true,
  },
  {
    width: 150,
    label: 'Action',
    dataKey: 'button',
    numeric: true,
  },
];

// Generate rows
const rows: Data[] = Array.from({ length: 20 }, () => {
  const randomSelection = sample[Math.floor(Math.random() * sample.length)];
  return createData(randomSelection.name, randomSelection.email, randomSelection.regNo, randomSelection.role);
});

const VirtuosoTableComponents: TableComponents<Data> = {
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

function rowContent(_index: number, row: Data) {
  return (
    <>
      {columns.map((column) => (
        <TableCell key={column.dataKey} align={column.numeric ? 'right' : 'left'}>
          {row[column.dataKey]}
          {column.dataKey === 'button' ? 
           <button className='bg-sky-300 rounded-full p-1 lg:rounded-md'>
                    <h1 className='px-2 hidden lg:block'>Add</h1>
             </button> : ''}
        </TableCell>
      ))}
    </>
  );
}

export default function ReactVirtualizedTable() {
  return (
    <Paper style={{ height: 550, width: '100%' }} className="mt-6">
      <TableVirtuoso
        data={rows}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
      />
    </Paper>
  );
}
