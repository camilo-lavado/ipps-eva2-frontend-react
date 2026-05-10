import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, Avatar, IconButton } from '@mui/material';
import { Dashboard, Work, People, Badge, CalendarMonth, Logout, Menu as MenuIcon } from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 260;

const menuItems = [
  { text: 'Inicio', icon: <Dashboard />, path: '/' },
  { text: 'Cargos', icon: <Work />, path: '/cargos' },
  { text: 'Candidatos', icon: <People />, path: '/candidatos' },
  { text: 'Entrevistadores', icon: <Badge />, path: '/entrevistadores' },
  { text: 'Agenda', icon: <CalendarMonth />, path: '/agenda' }
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  const drawerContent = (
    <>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          RecruitApi
        </Typography>
        <Typography variant="caption" color="gray">
          ADMIN CONSOLE
        </Typography>
      </Box>

      <List sx={{ px: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  backgroundColor: isActive ? '#1976d2' : 'transparent',
                  '&:hover': {
                    backgroundColor: isActive ? '#1565c0' : 'rgba(255,255,255,0.08)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? 'white' : '#94a3b8', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 'bold' : 'normal',
                    color: isActive ? 'white' : '#cbd5e1'
                  }} 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ mt: 'auto', p: 3 }}>
        <ListItem disablePadding>
          <ListItemButton 
            onClick={handleLogout} 
            sx={{ borderRadius: 2, color: '#ef4444', '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' } }}
          >
            <ListItemIcon sx={{ color: '#ef4444', minWidth: 40 }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Cerrar sesión" primaryTypographyProps={{ fontSize: '0.9rem' }} />
          </ListItemButton>
        </ListItem>
      </Box>
    </>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, 
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: '#1a2332', color: 'white' },
          }}
        >
          {drawerContent}
        </Drawer>
        
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: '#1a2332', color: 'white' },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <AppBar position="static" elevation={0} sx={{ backgroundColor: 'transparent', borderBottom: '1px solid #e2e8f0', color: 'text.primary' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" fontWeight="bold">
                {menuItems.find(m => m.path === location.pathname)?.text || 'Dashboard'}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ lineHeight: 1 }}>
                  Admin User
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Recruiter Lead
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: '#1976d2', width: 35, height: 35 }}>A</Avatar>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: { xs: 2, sm: 4 }, flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}