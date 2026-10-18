'use client';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useState } from 'react';
import { PreviewRow } from './preview-row';
import { PreviewSection } from './preview-section';

const PAGE_TABS = ['Profile', 'Fees', 'Attendance', 'Documents'] as const;
const RANGES = ['Day', 'Week', 'Month'] as const;
type Range = (typeof RANGES)[number];

export function NavigationSamples() {
  const [tab, setTab] = useState(0);
  const [range, setRange] = useState<Range>('Day');

  const handleRangeChange = (_event: unknown, next: Range | null) => {
    // A segmented control always has one option selected.
    if (next) setRange(next);
  };

  return (
    <PreviewSection title="Tabs">
      <PreviewRow label="Page tabs">
        <Tabs
          value={tab}
          onChange={(_event, next: number) => setTab(next)}
          aria-label="Student sections"
          sx={{ width: '100%' }}
        >
          {PAGE_TABS.map((label) => (
            <Tab key={label} label={label} />
          ))}
        </Tabs>
      </PreviewRow>
      <PreviewRow label="Segmented control">
        <ToggleButtonGroup
          value={range}
          exclusive
          onChange={handleRangeChange}
          aria-label="Date range"
        >
          {RANGES.map((label) => (
            <ToggleButton key={label} value={label}>
              {label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </PreviewRow>
    </PreviewSection>
  );
}
