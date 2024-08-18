import {
  Box,
  Drawer,
  Grid,
  IconButton,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import {
  Close as CloseIcon,
  Groups as GroupsIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ManageAccounts as ManageAccountsIcon,
  Message as MessageIcon,
  ExitToApp as ExitToAppIcon,

} from "@mui/icons-material";
import { Link as LinkComponent, Navigate, useLocation } from "react-router-dom";
import { matblack } from "../../constants/color";
import { useDispatch, useSelector } from "react-redux";
import { adminLogout } from "../../redux/thunks/admin";
// import { adminTabs } from "../../constants/route";

const Link = styled(LinkComponent)`
  text-decoration: none;
  border-radius: 2rem;
  padding: 1rem 2rem;
  color: black;
  &:hover {
    color: #a464a4;
  }
`;

export const adminTabs = [
  {
    name: "DashBoard",
    path: "/admin/dashboard",
    icon: <DashboardIcon />,
  },
  {
    name: "User",
    path: "/admin/user",
    icon: <ManageAccountsIcon />,
  },
  // {
  //   name: "Chat",
  //   path: "/admin/chat",
  //   icon: <GroupsIcon />,
  // },
  {
    name: "Message",
    path: "/admin/messages",
    icon: <MessageIcon />,
  },
];
const SideBar = ({ w }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const logoutHandler = () => {
  dispatch(adminLogout())
  };
  return (
    <Stack width={w} direction={"column"} p={"3rem"} spacing={"3rem"}>
      <Typography variant="h5" textTransform={"uppercase"} textAlign={"center"}fontWeight={"bolder"}>
        Chat Kro
      </Typography>
      <Stack spacing={"1rem"}>
        {adminTabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            sx={
              location.pathname === tab.path && {
                bgcolor: matblack,
                color: "white",
                ":hover": { color: "white" },
              }
            }
          >
            <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
              {tab.icon}
              <Typography>{tab.name}</Typography>
            </Stack>
          </Link>
        ))}

        <Link onClick={logoutHandler}>
          <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
            <ExitToAppIcon/>
            <Typography>Logout</Typography>
          </Stack>
        </Link>
      </Stack>
    </Stack>
  );
};

const AdminLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const handleMobile = () => {
    setIsMobile(!isMobile);
  };
  const {isAdmin} = useSelector(state=>state.auth);

  const handleClose = () => {};
  if(!isAdmin) return <Navigate to="/admin"/>
  return (
    <Grid container minHeight={"100vh"}>
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          right: "1rem",
          top: "1rem",
        }}
      >
        <IconButton onClick={handleMobile}>
          {isMobile ? <CloseIcon /> : <MenuIcon />}
          {/* <MenuIcon /> */}
        </IconButton>
      </Box>
      <Grid
        item
        md={4}
        lg={3}
        sx={{
          display: { xs: "none", md: "block" },
          // bgcolor:"red"
        }}
      >
        <SideBar />
      </Grid>
      <Grid
        item
        xs={12}
        md={8}
        lg={9}
        sx={{
          bgcolor: "#f5f5f5",
        }}
      >
        {children}
      </Grid>
      <Drawer open={isMobile} onClose={handleClose}>
        <SideBar w={"50vh"} />
      </Drawer>
    </Grid>
  );
};

export default AdminLayout;
