'use client';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import { PreviewRow } from './preview-row';
import { PreviewSection } from './preview-section';

const FEE_PLANS = ['Monthly', 'Quarterly', 'Yearly'] as const;
const RANGE_THUMB_LABELS = ['Minimum attendance', 'Maximum attendance'] as const;

const getRangeThumbLabel = (index: number) => RANGE_THUMB_LABELS[index] ?? 'Attendance';

/** Client component: FormControlLabel reads its control's props, which RSC can't pass through. */
export function SelectionSamples() {
  return (
    <PreviewSection title="Checkbox, radio, switch and slider">
      <PreviewRow label="Checkbox">
        <FormControlLabel control={<Checkbox defaultChecked />} label="Send SMS to parent" />
        <FormControlLabel control={<Checkbox />} label="Transport required" />
        <FormControlLabel control={<Checkbox indeterminate />} label="Some selected" />
        <FormControlLabel control={<Checkbox disabled />} label="Disabled" disabled />
        <FormControlLabel
          control={<Checkbox disabled defaultChecked />}
          label="Disabled on"
          disabled
        />
      </PreviewRow>
      <PreviewRow label="Radio">
        <FormControl>
          <FormLabel id="preview-plan-label">Fee plan</FormLabel>
          <RadioGroup
            row
            aria-labelledby="preview-plan-label"
            defaultValue="Monthly"
            name="preview-plan"
          >
            {FEE_PLANS.map((plan) => (
              <FormControlLabel key={plan} value={plan} control={<Radio />} label={plan} />
            ))}
          </RadioGroup>
        </FormControl>
      </PreviewRow>
      <PreviewRow label="Switch">
        <FormControlLabel control={<Switch defaultChecked />} label="Notifications" />
        <FormControlLabel control={<Switch />} label="Auto-reminders" />
        <FormControlLabel control={<Switch disabled defaultChecked />} label="Disabled" disabled />
      </PreviewRow>
      <PreviewRow label="Slider and range">
        <Box sx={{ width: 280, px: 2 }}>
          <Slider defaultValue={40} aria-label="Pass mark" valueLabelDisplay="auto" />
        </Box>
        <Box sx={{ width: 280, px: 2 }}>
          <Slider
            defaultValue={[60, 90]}
            getAriaLabel={getRangeThumbLabel}
            valueLabelDisplay="auto"
            marks={[
              { value: 0, label: '0%' },
              { value: 100, label: '100%' },
            ]}
          />
        </Box>
      </PreviewRow>
    </PreviewSection>
  );
}
