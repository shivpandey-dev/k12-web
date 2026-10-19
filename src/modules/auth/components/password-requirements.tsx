import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Check, Circle } from 'lucide-react';

export interface PasswordRequirement {
  label: string;
  isMet: boolean;
}

/** Live checklist under a new-password field. */
export function PasswordRequirements({
  requirements,
}: {
  requirements: readonly PasswordRequirement[];
}) {
  return (
    <Box
      component="ul"
      aria-label="Password requirements"
      sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: 1 }}
    >
      {requirements.map(({ label, isMet }) => (
        <Box
          component="li"
          key={label}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            color: isMet ? 'success.main' : 'text.secondary',
          }}
        >
          {isMet ? <Check size={14} aria-hidden /> : <Circle size={14} aria-hidden />}
          <Typography variant="body2" sx={{ color: 'inherit' }}>
            {label}
            <Box component="span" sx={visuallyHidden}>
              {isMet ? ' (done)' : ' (not yet)'}
            </Box>
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

const visuallyHidden = {
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
} as const;
