'use client';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Ellipsis, Search, Send } from 'lucide-react';
import { useMemo, useState } from 'react';
import { createDataTableColumns, DataTable, toast } from '@/components/ui';
import { PreviewRow } from './preview-row';
import { PreviewSection } from './preview-section';

type FeeStatus = 'paid' | 'dueSoon' | 'overdue';

interface StudentFee {
  id: string;
  name: string;
  className: string;
  admissionNo: string;
  due: number;
  status: FeeStatus;
}

const FIRST_NAMES = [
  'Aarav',
  'Diya',
  'Kabir',
  'Meera',
  'Ishaan',
  'Ananya',
  'Vihaan',
  'Saanvi',
  'Arjun',
  'Kiara',
];
const LAST_NAMES = ['Sharma', 'Kapoor', 'Mehta', 'Iyer', 'Reddy', 'Nair', 'Gupta', 'Singh'];
const CLASSES = ['5-A', '5-B', '6-A', '6-B'];
const STATUSES: readonly FeeStatus[] = ['paid', 'paid', 'dueSoon', 'overdue'];

const STUDENTS: StudentFee[] = Array.from({ length: 42 }, (_, index) => {
  const status = STATUSES[index % STATUSES.length] ?? 'paid';
  return {
    id: `stu-${index + 1}`,
    name: `${FIRST_NAMES[index % FIRST_NAMES.length]} ${LAST_NAMES[(index * 3) % LAST_NAMES.length]}`,
    className: CLASSES[index % CLASSES.length] ?? '5-A',
    admissionNo: `KD-2026-${String(140 + index).padStart(4, '0')}`,
    due: status === 'paid' ? 0 : 2500 * ((index % 5) + 1),
    status,
  };
});

const STATUS_CHIP: Record<FeeStatus, { label: string; color: 'success' | 'warning' | 'error' }> = {
  paid: { label: 'Paid', color: 'success' },
  dueSoon: { label: 'Due soon', color: 'warning' },
  overdue: { label: 'Overdue', color: 'error' },
};

const rupees = new Intl.NumberFormat('en-IN');

const helper = createDataTableColumns<StudentFee>();
const COLUMNS = helper.columns([
  helper.accessor('name', { header: 'Student' }),
  helper.accessor('className', { header: 'Class', meta: { width: 80 } }),
  helper.accessor('admissionNo', { header: 'Admission no.', enableSorting: false }),
  helper.accessor('due', {
    header: 'Due (₹)',
    cell: ({ getValue }) => rupees.format(getValue()),
    meta: { align: 'right', width: 110 },
  }),
  helper.accessor('status', {
    header: 'Status',
    cell: ({ getValue }) => {
      const { label, color } = STATUS_CHIP[getValue()];
      return <Chip label={label} color={color} />;
    },
    meta: { width: 120 },
  }),
  helper.display({
    id: 'actions',
    header: () => null,
    cell: ({ row }) => (
      <IconButton size="small" aria-label={`Actions for ${row.original.name}`}>
        <Ellipsis />
      </IconButton>
    ),
    meta: { align: 'right', width: 56 },
  }),
]);

type TableDemoState = 'data' | 'loading' | 'empty' | 'error';
const EMPTY: StudentFee[] = [];
const getStudentId = (row: StudentFee) => row.id;
const getStudentName = (row: StudentFee) => row.name;

export function TableSamples() {
  const [search, setSearch] = useState('');
  const [isUnpaidOnly, setIsUnpaidOnly] = useState(false);
  const [demoState, setDemoState] = useState<TableDemoState>('data');

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return STUDENTS.filter(
      (student) =>
        (!isUnpaidOnly || student.status !== 'paid') &&
        (!term ||
          student.name.toLowerCase().includes(term) ||
          student.admissionNo.toLowerCase().includes(term)),
    );
  }, [search, isUnpaidOnly]);

  return (
    <PreviewSection
      title="Data table"
      description="Sorting, paging, row selection with bulk actions, and loading / empty / error states."
    >
      <PreviewRow label="Demo state">
        <ToggleButtonGroup
          value={demoState}
          exclusive
          onChange={(_event, next: TableDemoState | null) => next && setDemoState(next)}
          aria-label="Table demo state"
        >
          <ToggleButton value="data">Data</ToggleButton>
          <ToggleButton value="loading">Loading</ToggleButton>
          <ToggleButton value="empty">Empty</ToggleButton>
          <ToggleButton value="error">Error</ToggleButton>
        </ToggleButtonGroup>
      </PreviewRow>
      <Card sx={{ width: '100%' }}>
        <DataTable
          label="Student fees"
          columns={COLUMNS}
          data={demoState === 'empty' ? EMPTY : rows}
          getRowId={getStudentId}
          enableRowSelection
          getRowLabel={getStudentName}
          isLoading={demoState === 'loading'}
          error={
            demoState === 'error'
              ? { message: "Couldn't load fees.", onRetry: () => setDemoState('data') }
              : null
          }
          toolbar={
            <>
              <TextField
                size="small"
                placeholder="Search students"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                slotProps={{
                  htmlInput: { 'aria-label': 'Search students' },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ width: 220 }}
              />
              <Chip
                label="Unpaid only"
                variant="outlined"
                color={isUnpaidOnly ? 'primary' : 'default'}
                clickable
                onClick={() => setIsUnpaidOnly((value) => !value)}
                aria-pressed={isUnpaidOnly}
              />
            </>
          }
          bulkActions={(selected) => (
            <Button
              size="small"
              variant="text"
              startIcon={<Send />}
              onClick={() => toast.success(`Reminder sent to ${selected.length} parents`)}
            >
              Send reminder
            </Button>
          )}
        />
      </Card>
    </PreviewSection>
  );
}
