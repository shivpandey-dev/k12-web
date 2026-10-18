import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import type { ReactNode } from 'react';

export interface Crumb {
  label: string;
  /** Omit on the current page. */
  href?: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs?: readonly Crumb[];
  description?: string;
  /** Page-level buttons, primary last. */
  actions?: ReactNode;
  /** Keep the default h1 on real pages; previews nested in another page use h2. */
  titleComponent?: 'h1' | 'h2';
}

/** Breadcrumbs, the page's single h1, an optional description and page actions. */
export function PageHeader({
  title,
  breadcrumbs,
  description,
  actions,
  titleComponent = 'h1',
}: PageHeaderProps) {
  return (
    <Box sx={{ px: { xs: 4, md: 6 }, pt: 5, pb: 4 }}>
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <Breadcrumbs aria-label="Breadcrumb" sx={{ mb: 1 }}>
          {breadcrumbs.map((crumb, index) =>
            crumb.href && index < breadcrumbs.length - 1 ? (
              <Link key={crumb.label} href={crumb.href}>
                {crumb.label}
              </Link>
            ) : (
              <Typography
                key={crumb.label}
                variant="body2"
                color="text.primary"
                aria-current="page"
              >
                {crumb.label}
              </Typography>
            ),
          )}
        </Breadcrumbs>
      ) : null}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 3,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h1" component={titleComponent}>
            {title}
          </Typography>
          {description ? (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              {description}
            </Typography>
          ) : null}
        </Box>
        {actions ? <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>{actions}</Box> : null}
      </Box>
    </Box>
  );
}
