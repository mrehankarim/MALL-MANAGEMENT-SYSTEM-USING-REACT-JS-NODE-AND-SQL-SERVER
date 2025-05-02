import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
} from '@mui/material';

import {
  Medication,
  Favorite,
  CalendarToday,
  BarChart,
  Receipt,
  Settings,
  ExpandLess,
  ExpandMore,
  ListAlt,
  Create,
} from '@mui/icons-material';

const AdminSidebar = ({open}) => {
  
  return (
    <Drawer
      variant="persistent"
      anchor='left'
      open={open}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          borderRight: 'none',
          backgroundColor: '#fff',
        },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <ListItemButton>
            <ListItemIcon><Favorite sx={{ color: '#9c27b0' }} /></ListItemIcon>
            <ListItemText primary="Tests" />
            <ExpandMore sx={{ color: '#aaa' }} />
          </ListItemButton>

          <ListItemButton>
            <ListItemIcon><CalendarToday sx={{ color: '#9c27b0' }} /></ListItemIcon>
            <ListItemText primary="Calendar" />
          </ListItemButton>

          <ListItemButton>
            <ListItemIcon><BarChart sx={{ color: '#9c27b0' }} /></ListItemIcon>
            <ListItemText primary="Reports" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
};

export default AdminSidebar;
