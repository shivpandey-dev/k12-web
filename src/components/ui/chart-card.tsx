'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { ChartColumn, Table2 } from 'lucide-react';
import { useId, useState, type ReactNode } from 'react';

type ChartView = 'chart' | 'table';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  /** The chart, e.g. a MUI X `BarChart`. */
  children: ReactNode;
  /** The same data as a table, for screen readers, exact values and printing. */
  table?: ReactNode;
  /** Filters or menus shown on the right of the header. */
  action?: ReactNode;
}

/** Card wrapper for a chart with an optional chart/table switch. */
export function ChartCard({ title, subtitle, children, table, action }: ChartCardProps) {
  const [view, setView] = useState<ChartView>('chart');
  const titleId = useId();

  const handleViewChange = (_event: unknown, next: ChartView | null) => {
    if (next) setView(next);
  };

  return (
    <Card component="section" aria-labelledby={titleId}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, px: 4, pt: 3 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography id={titleId} variant="title" component="h3">
            {title}
          </Typography>
          {subtitle ? (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          ) : null}
        </Box>
        {action}
        {table ? (
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            aria-label={`${title} view`}
          >
            <ToggleButton value="chart" aria-label="Chart view">
              <ChartColumn size={16} />
            </ToggleButton>
            <ToggleButton value="table" aria-label="Table view">
              <Table2 size={16} />
            </ToggleButton>
          </ToggleButtonGroup>
        ) : null}
      </Box>
      <Box sx={{ px: view === 'chart' ? 2 : 0, pb: 2, pt: 2 }}>
        {view === 'chart' ? children : table}
      </Box>
    </Card>
  );
}
