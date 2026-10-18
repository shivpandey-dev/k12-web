'use client';

import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import { Bell } from 'lucide-react';
import { useId, useState, type ReactNode } from 'react';

interface NotificationsButtonProps {
  unreadCount: number;
  /** Menu content: notification items, or an empty state. */
  children: ReactNode;
}

export function NotificationsButton({ unreadCount, children }: NotificationsButtonProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const menuId = useId();
  const label = unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications';

  return (
    <>
      <IconButton
        aria-label={label}
        aria-haspopup="menu"
        aria-controls={anchor ? menuId : undefined}
        aria-expanded={anchor ? true : undefined}
        onClick={(event) => setAnchor(event.currentTarget)}
      >
        <Badge variant="dot" color="error" invisible={unreadCount === 0} overlap="circular">
          <Bell />
        </Badge>
      </IconButton>
      <Menu
        id={menuId}
        anchorEl={anchor}
        open={anchor !== null}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: 320 } } }}
      >
        {children}
      </Menu>
    </>
  );
}
