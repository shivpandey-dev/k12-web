'use client';

import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import { Search } from 'lucide-react';
import { useEffect } from 'react';

interface SearchTriggerProps {
  onOpen: () => void;
  placeholder?: string;
}

/** Looks like a search field; opens global search on click or ⌘K / Ctrl+K. */
export function SearchTrigger({ onOpen, placeholder = 'Search' }: SearchTriggerProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        onOpen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpen]);

  return (
    <ButtonBase
      onClick={onOpen}
      aria-label="Search (Ctrl+K)"
      aria-keyshortcuts="Control+K Meta+K"
      sx={(theme) => ({
        height: 32,
        width: { xs: 32, sm: 240 },
        px: { xs: 0, sm: 2.5 },
        gap: 2,
        justifyContent: { xs: 'center', sm: 'flex-start' },
        borderRadius: theme.radius.md,
        border: `1px solid ${theme.vars.palette.border.default}`,
        bgcolor: 'background.default',
        color: 'text.disabled',
        typography: 'body2',
        '&:hover': { borderColor: theme.vars.palette.border.strong },
        '&.Mui-focusVisible': { boxShadow: theme.tokenShadows.focusRing },
      })}
    >
      <Search size={16} aria-hidden />
      <Box
        component="span"
        sx={{ display: { xs: 'none', sm: 'inline' }, flex: 1, textAlign: 'left' }}
      >
        {placeholder}
      </Box>
      <Box
        component="kbd"
        aria-hidden
        sx={(theme) => ({
          display: { xs: 'none', sm: 'inline' },
          px: 1.5,
          borderRadius: theme.radius.xs,
          border: `1px solid ${theme.vars.palette.border.default}`,
          bgcolor: 'background.paper',
          typography: 'caption',
          fontFamily: 'inherit',
        })}
      >
        ⌘K
      </Box>
    </ButtonBase>
  );
}
