import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import { PreviewSection } from './preview-section';

export function AlertSamples() {
  return (
    <PreviewSection
      title="Alert banners"
      description="Inline messages in a soft tint. Toasts use the outlined variant."
    >
      <Stack spacing={2}>
        <Alert severity="warning">
          <AlertTitle>12 fees due this week</AlertTitle>
          Send reminders to parents before Friday.
        </Alert>
        <Alert severity="error">
          Couldn&apos;t save the student. Check the highlighted fields.
        </Alert>
        <Alert severity="success">Attendance for Class 5-B is submitted.</Alert>
        <Alert severity="info">Term 2 report cards open on 1 Nov.</Alert>
      </Stack>
    </PreviewSection>
  );
}
