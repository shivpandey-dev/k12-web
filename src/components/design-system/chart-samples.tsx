'use client';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { ChartCard } from '@/components/ui';
import { PreviewSection } from './preview-section';

const CLASSES = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6'];
const COLLECTED_LAKH = [2.0, 2.5, 1.6, 2.3, 1.8, 1.3];

const WEEKS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'];
const ATTENDANCE = {
  '5-A': [92, 95, 93, 96, 97, 95],
  '5-B': [87, 90, 86, 92, 93, 95],
};

const lakh = (value: number | null) => (value === null ? '' : `₹${value.toFixed(1)} lakh`);
const percent = (value: number | null) => (value === null ? '' : `${value}%`);

export function ChartSamples() {
  return (
    <PreviewSection
      title="Charts"
      description="MUI X Charts with the validated series order. Every chart card can switch to a table view."
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
        <ChartCard
          title="Fee collected by class"
          subtitle="October · ₹ lakh"
          table={
            <Table aria-label="Fee collected by class">
              <TableHead>
                <TableRow>
                  <TableCell>Class</TableCell>
                  <TableCell align="right">Collected</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {CLASSES.map((name, index) => (
                  <TableRow key={name}>
                    <TableCell>{name}</TableCell>
                    <TableCell align="right">{lakh(COLLECTED_LAKH[index] ?? null)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          }
        >
          <BarChart
            height={240}
            xAxis={[{ scaleType: 'band', data: CLASSES.map((name) => name.replace('Class ', '')) }]}
            series={[{ data: COLLECTED_LAKH, label: 'Collected', valueFormatter: lakh }]}
            grid={{ horizontal: true }}
            hideLegend
          />
        </ChartCard>
        <ChartCard
          title="Attendance trend"
          subtitle="Last 6 weeks · %"
          table={
            <Table aria-label="Attendance trend">
              <TableHead>
                <TableRow>
                  <TableCell>Week</TableCell>
                  <TableCell align="right">5-A</TableCell>
                  <TableCell align="right">5-B</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {WEEKS.map((week, index) => (
                  <TableRow key={week}>
                    <TableCell>{week}</TableCell>
                    <TableCell align="right">{percent(ATTENDANCE['5-A'][index] ?? null)}</TableCell>
                    <TableCell align="right">{percent(ATTENDANCE['5-B'][index] ?? null)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          }
        >
          <LineChart
            height={240}
            xAxis={[{ scaleType: 'point', data: WEEKS }]}
            yAxis={[{ min: 80, max: 100 }]}
            series={[
              {
                data: ATTENDANCE['5-A'],
                label: 'Class 5-A',
                valueFormatter: percent,
                showMark: false,
              },
              {
                data: ATTENDANCE['5-B'],
                label: 'Class 5-B',
                valueFormatter: percent,
                showMark: false,
              },
            ]}
            grid={{ horizontal: true }}
          />
        </ChartCard>
      </Box>
    </PreviewSection>
  );
}
