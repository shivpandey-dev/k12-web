'use client';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { PreviewRow } from './preview-row';
import { PreviewSection } from './preview-section';

const CLASSES = ['5-A', '5-B', '6-A', '6-B'] as const;

const fieldSx = { width: 220 } as const;

/** Client component: Select reads its MenuItem children's props, which RSC can't pass through. */
export function FieldSamples() {
  return (
    <PreviewSection
      title="Text fields and select"
      description="Label above the field, 36px tall, focus ring on focus."
    >
      <PreviewRow label="States">
        <TextField
          label="First name"
          placeholder="Diya"
          required
          helperText="As on birth certificate"
          sx={fieldSx}
        />
        <TextField label="Admission no." defaultValue="KD-2026-0142" sx={fieldSx} />
        <TextField
          label="Phone"
          defaultValue="98765"
          error
          helperText="Enter a 10-digit number"
          sx={fieldSx}
        />
        <TextField label="Roll no." defaultValue="Auto" disabled sx={fieldSx} />
        <TextField
          label="Section"
          defaultValue="B"
          size="small"
          helperText="Small · 28px"
          sx={fieldSx}
        />
      </PreviewRow>
      <PreviewRow label="Select and multiline">
        <FormControl sx={fieldSx}>
          <InputLabel id="preview-class-label">Class</InputLabel>
          <Select labelId="preview-class-label" defaultValue="5-B">
            {CLASSES.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ width: { xs: '100%', sm: 456 } }}>
          <TextField
            label="Remarks"
            placeholder="Anything the class teacher should know"
            multiline
            minRows={3}
            fullWidth
          />
        </Box>
      </PreviewRow>
    </PreviewSection>
  );
}
