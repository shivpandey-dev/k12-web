'use client';

import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import type { MouseEvent, ReactNode } from 'react';
import { isNavItemActive, type NavGroup } from './navigation';

export const NAV_WIDTH = 240;
export const NAV_RAIL_WIDTH = 56;

interface SideNavProps {
  groups: readonly NavGroup[];
  activeHref: string;
  isCollapsed?: boolean;
  /** Logo and product name at the top. */
  brand: ReactNode;
  /** Called when a link is clicked, e.g. to close the mobile drawer. */
  onNavigate?: (event: MouseEvent<HTMLElement>, href: string) => void;
}

/** The dark sidebar. Shows labels when expanded and icons with tooltips as a rail. */
export function SideNav({
  groups,
  activeHref,
  isCollapsed = false,
  brand,
  onNavigate,
}: SideNavProps) {
  return (
    <Box
      component="nav"
      aria-label="Main"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'sidebar.background',
        color: 'sidebar.text',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <Box
        sx={{
          height: 52,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          px: isCollapsed ? 0 : 4,
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          color: 'sidebar.textActive',
        }}
      >
        {brand}
      </Box>
      {groups.map((group) => (
        <Box key={group.id} component="ul" sx={{ listStyle: 'none', m: 0, px: 2, pb: 2 }}>
          {group.label && !isCollapsed ? (
            <Typography
              component="li"
              variant="label"
              sx={{
                display: 'block',
                px: 2,
                pt: 2,
                pb: 1,
                color: 'sidebar.groupLabel',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                fontSize: 11,
              }}
            >
              {group.label}
            </Typography>
          ) : null}
          {group.label && isCollapsed ? (
            <Box
              component="li"
              aria-hidden
              sx={{ height: '1px', bgcolor: 'sidebar.divider', mx: 2, my: 1 }}
            />
          ) : null}
          {group.items.map((item) => {
            const isActive = isNavItemActive(item.href, activeHref);
            const Icon = item.icon;
            const link = (
              <ListItemButton
                component={Link}
                href={item.href}
                onClick={(event: MouseEvent<HTMLElement>) => onNavigate?.(event, item.href)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={isCollapsed ? item.label : undefined}
                sx={{
                  minHeight: 36,
                  gap: 2.5,
                  px: 2.5,
                  borderRadius: 1.5,
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  color: isActive ? 'sidebar.textActive' : 'sidebar.text',
                  bgcolor: isActive ? 'sidebar.itemActive' : 'transparent',
                  typography: 'body1',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: isActive ? 'sidebar.itemActive' : 'sidebar.itemHover',
                    color: 'sidebar.textActive',
                  },
                  '&.Mui-focusVisible': {
                    bgcolor: 'sidebar.itemHover',
                    boxShadow: (theme) => theme.tokenShadows.focusRing,
                  },
                  '& svg': { flexShrink: 0 },
                }}
              >
                <Icon size={18} aria-hidden />
                {isCollapsed ? null : (
                  <Box
                    component="span"
                    sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {item.label}
                  </Box>
                )}
              </ListItemButton>
            );
            return (
              <Box component="li" key={item.href} sx={{ mb: 0.5 }}>
                {isCollapsed ? (
                  <Tooltip title={item.label} placement="right">
                    {link}
                  </Tooltip>
                ) : (
                  link
                )}
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
}
