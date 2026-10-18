'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Building2, Check, ChevronsUpDown } from 'lucide-react';
import { useId, useState, type MouseEvent } from 'react';

export interface SwitcherMembership {
  id: string;
  schoolName: string;
  /** Human-readable role, e.g. "Admin". */
  roleLabel: string;
}

interface MembershipSwitcherProps {
  memberships: readonly SwitcherMembership[];
  activeId: string;
  onSelect: (membershipId: string) => void;
}

/** Shows the active school and role; lets users with several memberships switch. */
export function MembershipSwitcher({ memberships, activeId, onSelect }: MembershipSwitcherProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const menuId = useId();
  const active = memberships.find((membership) => membership.id === activeId);
  const canSwitch = memberships.length > 1;

  if (!active) return null;

  const label = `${active.schoolName} · ${active.roleLabel}`;

  const handleSelect = (membershipId: string) => {
    setAnchor(null);
    if (membershipId !== activeId) onSelect(membershipId);
  };

  return (
    <>
      <Button
        size="small"
        startIcon={<Building2 />}
        endIcon={canSwitch ? <ChevronsUpDown /> : undefined}
        onClick={
          canSwitch ? (event: MouseEvent<HTMLElement>) => setAnchor(event.currentTarget) : undefined
        }
        aria-haspopup={canSwitch ? 'menu' : undefined}
        aria-controls={anchor ? menuId : undefined}
        aria-expanded={anchor ? true : undefined}
        aria-label={canSwitch ? `Switch school or role. Current: ${label}` : label}
        sx={{ maxWidth: { xs: 180, sm: 280 }, justifyContent: 'flex-start' }}
      >
        <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {label}
        </Box>
      </Button>
      <Menu id={menuId} anchorEl={anchor} open={anchor !== null} onClose={() => setAnchor(null)}>
        {memberships.map((membership) => {
          const isActive = membership.id === activeId;
          return (
            <MenuItem
              key={membership.id}
              selected={isActive}
              onClick={() => handleSelect(membership.id)}
            >
              <ListItemText primary={membership.schoolName} secondary={membership.roleLabel} />
              <ListItemIcon
                sx={{ minWidth: 0, ml: 4, visibility: isActive ? 'visible' : 'hidden' }}
              >
                <Check size={16} aria-hidden />
              </ListItemIcon>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
