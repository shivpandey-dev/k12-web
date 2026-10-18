import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Ellipsis, Plus, Users } from 'lucide-react';
import { EmptyState } from '@/components/ui';
import { PreviewRow } from './preview-row';
import { PreviewSection } from './preview-section';

const gridSx = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
  gap: 4,
  width: '100%',
} as const;

export function CardSamples() {
  return (
    <PreviewSection title="Cards and empty state">
      <PreviewRow label="Stat card and content card">
        <Box sx={gridSx}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Fee collected · Oct
              </Typography>
              <Typography variant="display" sx={{ my: 1 }}>
                ₹4,82,000
              </Typography>
              <Chip label="+8% vs Sep" color="success" size="small" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader
              title="Class 5-B"
              subheader="Class teacher: Mrs. Rao"
              action={
                <IconButton size="small" aria-label="More actions for Class 5-B">
                  <Ellipsis />
                </IconButton>
              }
            />
            <CardContent>
              <Typography variant="body1" color="text.secondary">
                32 students · Attendance today 94%
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">View</Button>
              <Button size="small" variant="contained">
                Take attendance
              </Button>
            </CardActions>
          </Card>
        </Box>
      </PreviewRow>
      <PreviewRow label="Empty state">
        <Card sx={{ width: '100%' }}>
          <EmptyState
            icon={<Users />}
            title="Add your first student"
            description="Students you add to Class 5-B appear here."
            headingComponent="h3"
            action={
              <Button variant="contained" startIcon={<Plus />}>
                Add student
              </Button>
            }
          />
        </Card>
      </PreviewRow>
    </PreviewSection>
  );
}
