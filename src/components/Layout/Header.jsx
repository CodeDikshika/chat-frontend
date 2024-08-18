import React, { lazy, useState } from "react";
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  Tooltip,
  Backdrop,
  Badge,
} from "@mui/material";
import { purple } from "../../constants/color";
import {
  Add as AddIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Notifications as NotificationIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Suspense } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { userNotExists } from "../../redux/reducers/auth";
import { server } from "../../constants/config";
import {
  setIsMobile,
 
  setIsNewGroup,
 
  setIsNotification,
  setIsSearch,
} from "../../redux/reducers/misc";
import { resetNotificationCount } from "../../redux/reducers/chat";

const SearchDialog = lazy(() => import("../specific/Search"));
const NotificationDialog = lazy(() => import("../specific/Notifications"));
const NewGroupDialog = lazy(() => import("../specific/NewGroups"));
const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isSearch,isNotification,isNewGroup} = useSelector(
    (state) => state.misc
  );
  const {notificationCount} = useSelector((state)=>state.chat)


  




  const handleMobile = () => dispatch(setIsMobile(true));

  const openSearch = () => dispatch(setIsSearch(true));

  


  const openNewGroup = () => {
   dispatch(setIsNewGroup(true));
  };
  const notificationhandle = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };
  const manageGroup = () => navigate("/group");
  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });
      dispatch(userNotExists());
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <>
      <Box sx={{ flexGrow: 1 }} height={"4rem"}>
        <AppBar
          position="fixed"
          sx={{
            bgcolor: purple,
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              sx={{
                display: { xs: "none", sm: "block" },
              }}
            >
              ChatKro
            </Typography>

            <Box
              sx={{
                display: { xs: "block", sm: "none" },
              }}
            >
              {/* menu icon */}
              <IconBtn
                title={"explore krega chl kr le"}
                onClick={handleMobile}
                icon={<MenuIcon />}
              />
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box>
              {/* Search icon */}
              <IconBtn
                title={"dhundh le khushiyan"}
                onClick={openSearch}
                icon={<SearchIcon />}
              />
              <IconBtn
                title={"dkh le"}
                onClick={notificationhandle}
                icon={<NotificationIcon />}
                value={notificationCount}
              />

              {/* new group icon */}
              <IconBtn
                title={"nyaa bna le"}
                onClick={openNewGroup}
                icon={<AddIcon />}
              />
              <IconBtn
                title={"chl ab kisi or group mein chle"}
                onClick={manageGroup}
                icon={<GroupIcon />}
              />
              <IconBtn
                title={"Chl ab pdhai kr"}
                onClick={logoutHandler}
                icon={<LogoutIcon />}
              />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      {isSearch && (
        <Suspense fallback={<Backdrop open/>}>
          <SearchDialog />
        </Suspense>
      )}
       {isNotification && (
        <Suspense fallback={<Backdrop open/>}>
          <NotificationDialog />
        </Suspense>
      )}
       {isNewGroup && (
        <Suspense fallback={<Backdrop open/>}>
          <NewGroupDialog />
        </Suspense>
      )}
    </>
  );
};

const IconBtn = ({ title, icon, onClick,value}) => {
  return (
    <Tooltip title={title}>
      <IconButton color="inherit" size="large" onClick={onClick}>
        {
          value?<Badge badgeContent={value} color="error">
              {icon}
          </Badge>:icon
        }
      
      </IconButton>
    </Tooltip>
  );
};

export default Header;
