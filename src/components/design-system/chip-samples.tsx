import Chip from '@mui/material/Chip';
import { PreviewRow } from './preview-row';
import { PreviewSection } from './preview-section';

export function ChipSamples() {
  return (
    <PreviewSection
      title="Chips"
      description="Filled = status and tags (soft tint). Outlined = filters."
    >
      <PreviewRow label="Status">
        <Chip label="Paid" color="success" />
        <Chip label="Overdue" color="error" />
        <Chip label="Due soon" color="warning" />
        <Chip label="Present" color="info" />
        <Chip label="Draft" />
      </PreviewRow>
      <PreviewRow label="Tags">
        <Chip label="Teacher" color="secondary" />
        <Chip label="Class 5-B" color="primary" />
        <Chip label="Small" color="primary" size="small" />
      </PreviewRow>
      <PreviewRow label="Filters">
        <Chip label="Class 5" variant="outlined" clickable />
        <Chip label="Unpaid only" variant="outlined" color="primary" clickable />
      </PreviewRow>
    </PreviewSection>
  );
}
