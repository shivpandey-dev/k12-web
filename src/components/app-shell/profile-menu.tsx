'use client';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { KeyRound, LogOut, UserRound } from 'lucide-react';
import { useId, useState } from 'react';

interface ProfileMenuProps {
  name: string;
  /** Email or login ID shown under the name. */
  detail?: string;
  onProfile: () => void;
  onChangePassword: () => void;
  onSignOut: () => void;
}

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

export function ProfileMenu({
  name,
  detail,
  onProfile,
  onChangePassword,
  onSignOut,
}: ProfileMenuProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const menuId = useId();

  const choose = (action: () => void) => () => {
    setAnchor(null);
    action();
  };

  return (
    <>
      <IconButton
        aria-label={`Account menu for ${name}`}
        aria-haspopup="menu"
        aria-controls={anchor ? menuId : undefined}
        aria-expanded={anchor ? true : undefined}
        onClick={(event) => setAnchor(event.currentTarget)}
        sx={{ p: 1 }}
      >
        <Avatar>{initialsOf(name)}</Avatar>
      </IconButton>
      <Menu
        id={menuId}
        anchorEl={anchor}
        open={anchor !== null}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { minWidth: 220 } } }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="title">{name}</Typography>
          {detail ? (
            <Typography variant="body2" color="text.secondary">
              {detail}
            </Typography>
          ) : null}
        </Box>
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={choose(onProfile)}>
          <ListItemIcon>
            <UserRound size={16} aria-hidden />
          </ListItemIcon>
          Your profile
        </MenuItem>
        <MenuItem onClick={choose(onChangePassword)}>
          <ListItemIcon>
            <KeyRound size={16} aria-hidden />
          </ListItemIcon>
          Change password
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={choose(onSignOut)}>
          <ListItemIcon>
            <LogOut size={16} aria-hidden />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </Menu>
    </>
  );
}
