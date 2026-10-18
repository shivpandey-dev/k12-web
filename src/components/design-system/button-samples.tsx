import Button from '@mui/material/Button';
import { PreviewRow } from './preview-row';
import { PreviewSection } from './preview-section';

export function ButtonSamples() {
  return (
    <PreviewSection
      title="Buttons"
      description="contained = primary (one per screen), outlined = secondary (default), text = tertiary."
    >
      <PreviewRow label="Hierarchy">
        <Button variant="contained">Save student</Button>
        <Button>Export</Button>
        <Button variant="text">View report</Button>
        <Button variant="contained" color="error">
          Delete
        </Button>
        <Button color="error">Remove</Button>
      </PreviewRow>
      <PreviewRow label="Sizes · 28 / 36 / 44">
        <Button variant="contained" size="small">
          Small
        </Button>
        <Button variant="contained">Medium</Button>
        <Button variant="contained" size="large">
          Large
        </Button>
        <Button size="small">Small</Button>
        <Button>Medium</Button>
        <Button size="large">Large</Button>
      </PreviewRow>
      <PreviewRow label="Disabled">
        <Button variant="contained" disabled>
          Save student
        </Button>
        <Button disabled>Export</Button>
        <Button variant="text" disabled>
          View report
        </Button>
      </PreviewRow>
    </PreviewSection>
  );
}
