'use client';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Menu as MenuIcon, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useEffect, useState, type MouseEvent, type ReactNode } from 'react';
import { useStore } from 'zustand';
import type { NavGroup } from './navigation';
import { shellStore } from './shell-store';
import { NAV_RAIL_WIDTH, NAV_WIDTH, SideNav } from './side-nav';

const TOP_BAR_HEIGHT = 52;
const MAIN_ID = 'main-content';

interface AppShellProps {
  productName: string;
  navigation: readonly NavGroup[];
  /** The current path, usually from `usePathname()`. */
  activeHref: string;
  /** Right-hand top bar content: switcher, search, notifications, help, profile. */
  topBar: ReactNode;
  children: ReactNode;
  /** Defaults to the full viewport; the design-system preview passes a fixed height. */
  height?: number | string;
  /** Called when a nav link is clicked; call `event.preventDefault()` to handle it yourself. */
  onNavigate?: (event: MouseEvent<HTMLElement>, href: string) => void;
}

function Brand({ name, isCompact }: { name: string; isCompact: boolean }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
      <Box
        aria-hidden
        sx={{
          width: 28,
          height: 28,
          borderRadius: 1.5,
          display: 'grid',
          placeItems: 'center',
          bgcolor: 'primary.light',
          color: 'sidebar.background',
          typography: 'title',
        }}
      >
        {name.charAt(0)}
      </Box>
      {isCompact ? null : (
        <Box component="span" sx={{ typography: 'title', fontSize: 15 }}>
          {name}
        </Box>
      )}
    </Box>
  );
}

/**
 * Signed-in layout: dark sidebar (collapsible to an icon rail on desktop, a drawer on mobile),
 * top bar and scrolling main area.
 */
export function AppShell({
  productName,
  navigation,
  activeHref,
  topBar,
  children,
  height = '100dvh',
  onNavigate,
}: AppShellProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isCollapsed = useStore(shellStore, (state) => state.isNavCollapsed);
  const toggleCollapsed = useStore(shellStore, (state) => state.toggleNavCollapsed);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    void shellStore.persist.rehydrate();
  }, []);

  const navWidth = isCollapsed ? NAV_RAIL_WIDTH : NAV_WIDTH;

  const toggleButton = isMobile ? (
    <IconButton
      aria-label="Open navigation"
      aria-expanded={isDrawerOpen}
      aria-controls="app-navigation"
      onClick={() => setIsDrawerOpen(true)}
    >
      <MenuIcon />
    </IconButton>
  ) : (
    <IconButton
      aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
      aria-expanded={!isCollapsed}
      aria-controls="app-navigation"
      onClick={toggleCollapsed}
    >
      {isCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
    </IconButton>
  );

  return (
    <Box sx={{ display: 'flex', height, bgcolor: 'background.default', overflow: 'hidden' }}>
      <Box
        component="a"
        href={`#${MAIN_ID}`}
        sx={{
          position: 'absolute',
          left: 8,
          top: -48,
          zIndex: theme.zIndex.tooltip,
          px: 3,
          py: 2,
          borderRadius: 2,
          bgcolor: 'background.paper',
          color: 'primary.main',
          typography: 'button',
          '&:focus': { top: 8, boxShadow: theme.tokenShadows.focusRing },
        }}
      >
        Skip to content
      </Box>

      {isMobile ? (
        <Drawer
          anchor="left"
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          slotProps={{ paper: { id: 'app-navigation' } }}
          // Same specificity as the theme's temporary-drawer width, applied after it.
          sx={{ '& .MuiDrawer-paper': { width: NAV_WIDTH } }}
        >
          <SideNav
            groups={navigation}
            activeHref={activeHref}
            brand={<Brand name={productName} isCompact={false} />}
            onNavigate={(event, href) => {
              onNavigate?.(event, href);
              setIsDrawerOpen(false);
            }}
          />
        </Drawer>
      ) : (
        <Box
          id="app-navigation"
          sx={{
            width: navWidth,
            flexShrink: 0,
            transition: theme.transitions.create('width', {
              duration: theme.transitions.duration.shorter,
            }),
          }}
        >
          <SideNav
            groups={navigation}
            activeHref={activeHref}
            isCollapsed={isCollapsed}
            brand={<Brand name={productName} isCompact={isCollapsed} />}
            onNavigate={onNavigate}
          />
        </Box>
      )}

      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Box
          component="header"
          sx={{
            height: TOP_BAR_HEIGHT,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            px: { xs: 2, sm: 3 },
            bgcolor: 'background.paper',
            borderBottom: 1,
            borderColor: 'border.default',
          }}
        >
          {toggleButton}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 2 },
            }}
          >
            {topBar}
          </Box>
        </Box>
        <Box
          id={MAIN_ID}
          component="main"
          tabIndex={-1}
          sx={{ flex: 1, overflow: 'auto', outline: 'none' }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
