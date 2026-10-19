'use client';

import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

type PasswordFieldProps = Omit<TextFieldProps, 'type'>;

/** Password input with a show/hide toggle. */
export function PasswordField({ slotProps, ...props }: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <TextField
      {...props}
      type={isVisible ? 'text' : 'password'}
      slotProps={{
        ...slotProps,
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                size="small"
                edge="end"
                aria-label={isVisible ? 'Hide password' : 'Show password'}
                aria-pressed={isVisible}
                onClick={() => setIsVisible((value) => !value)}
                onMouseDown={(event) => event.preventDefault()}
              >
                {isVisible ? <EyeOff /> : <Eye />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
