import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithTheme } from '@/test/render';

describe('base component overrides', () => {
  it('renders buttons as secondary (outlined) by default, without ripples', async () => {
    const { user, container } = renderWithTheme(<Button>Export</Button>);
    const button = screen.getByRole('button', { name: 'Export' });

    expect(button).toHaveClass('MuiButton-outlined');
    await user.click(button);
    expect(container.querySelector('.MuiTouchRipple-root')).toBeNull();
  });

  it('keeps text field labels above the field and wires helper text', () => {
    const { container } = renderWithTheme(
      <TextField label="Phone" error helperText="Enter a 10-digit number" defaultValue="98765" />,
    );
    const input = screen.getByLabelText('Phone');
    const label = container.querySelector('label');

    expect(label).toHaveAttribute('data-shrink', 'true');
    expect(input).toHaveAccessibleDescription('Enter a 10-digit number');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('uses the custom checkbox mark and still toggles', async () => {
    const { user } = renderWithTheme(
      <FormControlLabel control={<Checkbox />} label="Transport required" />,
    );
    const checkbox = screen.getByRole('checkbox', { name: 'Transport required' });

    expect(document.querySelector('.kd-checkbox-box')).not.toBeNull();
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('toggles the compact switch from its label', async () => {
    const { user } = renderWithTheme(
      <FormControlLabel control={<Switch />} label="Auto-reminders" />,
    );
    await user.click(screen.getByText('Auto-reminders'));
    expect(screen.getByRole('switch', { name: 'Auto-reminders' })).toBeChecked();
  });

  it('renders status chips with their colour role', () => {
    renderWithTheme(<Chip label="Paid" color="success" />);
    expect(screen.getByText('Paid').closest('.MuiChip-root')).toHaveClass('MuiChip-colorSuccess');
  });
});
