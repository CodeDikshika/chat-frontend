import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
  Edit as EditIcon,
  KeyboardBackspace as KeyboardBackspaceIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  colors,
  Drawer,
  Grid,
  Icon,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { lazy } from "react";
import { LayoutLoader } from "../components/Layout/Loaders";
import { purple } from "@mui/material/colors";

import React, { memo, Suspense, useEffect, useState } from "react";
import { backcolor, matblack } from "../constants/color";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "../components/styles/StyledComponent";
import AvatarCard from "../components/shared/AvatarCard";
import UserItem from "../components/shared/UserItem";
import {
  useAddGroupMembersMutation,
  useChatDetailsQuery,
  useDeleteChatMutation,
  useMyGroupsQuery,
  useRemoveGroupMemberMutation,
  useRenameGroupMutation,
} from "../redux/api/api";
import { useAsyncMutation, useErrors } from "../hooks/hook";
import { useDispatch, useSelector } from "react-redux";
import { setIsAddMember } from "../redux/reducers/misc";

const ConfirmDeleteDialog = lazy(() =>
  import("../components/dialog/ConfirmDeleteDialog")
);
const AddMemberDialog = lazy(() =>
  import("../components/dialog/AddMemberDialog")
);



const Groups = () => {
  const dispatch = useDispatch();
  const chatId = useSearchParams()[0].get("group");
  const navigate = useNavigate();
   const {isAddMember} = useSelector(state=>state.misc);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");

  const myGroups = useMyGroupsQuery("");
  const groupDetails = useChatDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId }
  );
  const [updateGroup, isLoadingGroupName] = useAsyncMutation(
    useRenameGroupMutation
  );
  const [removeMember,isLoadingRemoveMember] = useAsyncMutation(
    useRemoveGroupMemberMutation
  );const [deleteGroup,isLoadingDeleteGroup] = useAsyncMutation(
    useDeleteChatMutation
  );

  const [addMembers,isLoadingAddMembers] = useAsyncMutation(
    useAddGroupMembersMutation
  );
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const groupData = groupDetails.data;
    if (groupData) {
      setGroupName(groupData.chat.name);
      setGroupNameUpdatedValue(groupData.chat.name);
      setMembers(groupData.chat.members);
    }

    // return ()=>{
    //   setGroupName("");
    //   setGroupNameUpdatedValue("");
    //   setMembers([]);
    //   setIsEdit(false)
    // }
  }, [groupDetails.data]);
  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };
  const handleMobileClose = () => {
    setIsMobileMenuOpen(false);
  };
  const navigateBack = () => {
    navigate("/");
  };
  const updateGroupName = () => {
    setIsEdit(false);
    updateGroup("updating name", {
      chatId,
      name: groupNameUpdatedValue,
    });
  };
  const removeMemberHandler = (userId) => {
    removeMember("removing member", {chatId,userId})
  };
  const openAddHandler = () => {
   dispatch(setIsAddMember(true))
  };
  const deleteHandler = () => {
   deleteGroup("deleting group", chatId)
    closeConfirmDeleteHandler();
    navigate("/groups");
  };

  useEffect(() => {
    if (chatId) {
      setGroupName(`Group Name ${chatId}`);
    }
    setGroupNameUpdatedValue(`Group Name ${chatId}`);
    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setIsEdit(false);
    };
  }, [chatId]);

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
  };
  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
    
  };

  const IconBtns = (
    <>
      <Box
        sx={{
          display: {
            xs: "block",
            sm: "none",
            position: "fixed",
            right: "1rem",
            top: "2.5rem",
          },
        }}
      >
        <Tooltip title="menu">
          <IconButton onClick={handleMobile}>
            <MenuIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Tooltip title="back">
        <IconButton
          sx={{
            position: "absolute",
            top: "2rem",
            left: "2rem",
            bgcolor: matblack,
            color: "white",
            ":hover": {
              bgcolor: "rgba(0,0,0,0.4)",
            },
          }}
          onClick={navigateBack}
        >
          <KeyboardBackspaceIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  const GroupName = (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"center"}
      spacing={"1rem"}
      padding={"1.4rem"}
    >
      {isEdit ? (
        <>
          <TextField
            value={groupNameUpdatedValue}
            onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
          />
          <IconButton onClick={updateGroupName} disabled={isLoadingGroupName}>
            <DoneIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Typography variant="h5">{groupName}</Typography>
          <IconButton
            disabled={isLoadingGroupName}
            onClick={() => setIsEdit(true)}
          >
            <EditIcon />
          </IconButton>
        </>
      )}
    </Stack>
  );
  const ButtonGroup = (
    <Stack
      direction={{
        sm: "row",
        xs: "column-reverse",
      }}
      spacing={"1rem"}
      p={{
        sm: "1rem",
        xs: "0",
        md: "1rem 4rem",
      }}
    >
      <Button
        size="large"
        variant="outlined"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={openConfirmDeleteHandler}
      >
        Delete Group
      </Button>
      <Button
        size="large"
        variant="contained"
        startIcon={<AddIcon />}
        onClick={openAddHandler}
      >
        Add Member
      </Button>
    </Stack>
  );
  return myGroups.isLoading ? (
    <LayoutLoader />
  ) : (
    <Grid container height={"100vh"}>
      <Grid
        item
        sx={{
          display: {
            xs: "none",
            sm: "block",
          },
        }}
        sm={4}
      >
        <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId} />
      </Grid>
      <Grid
        item
        xs={12}
        sm={8}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          padding: "1rem 3rem",
        }}
      >
        {IconBtns}
        {groupName && (
          <>
            {GroupName}
            <Typography
              margin={"3rem"}
              alignSelf={"flex-start"}
              variant="body1"
            >
              Members
            </Typography>
            <Stack
              maxWidth={"45rem"}
              width={"100%"}
              boxSizing={"border-box"}
              padding={{
                sm: "1rem",
                xs: "0",
                md: "1rem 3rem",
              }}
              spacing={"2rem"}
              bgcolor={purple[50]}
              height={"50vh"}
              overflow={"auto"}
            >
              {isLoadingRemoveMember?(
                <CircularProgress/>)
              : (members.map((i) => (
                <UserItem
                  user={i}
                  key={i._id}
                  isAdded
                  styling={{
                    boxShadow: "0 0 0.8rem 0.3rem rgba(0,0,0,0.2)",
                    padding: "0.1rem 1rem",
                    borderRadius: "10rem",
                  }}
                  handler={removeMemberHandler}
                />
              )
            ))}

              {/* {message} */}
            </Stack>
            {ButtonGroup}
          </>
        )}
      </Grid>
      {isAddMember && (
        <Suspense fallback={<Backdrop open />}>
          <AddMemberDialog chatId={chatId}/>
        </Suspense>
      )}

      {confirmDeleteDialog && (
        <Suspense fallback={<Backdrop open />}>
          <ConfirmDeleteDialog
            open={confirmDeleteDialog}
            handleClose={closeConfirmDeleteHandler}
            deleteHandler={deleteHandler}
          />
        </Suspense>
      )}

      <Drawer
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },
        }}
        style={{
          backgroundImage:
            "linear-gradient(rgba(220,200,200,0.5),rgba(120,110,220,0.5))",
        }}
        open={isMobileMenuOpen}
        onClose={handleMobileClose}
      >
        <GroupsList
          w={"50vw"}
          myGroups={myGroups?.data?.groups}
          chatId={chatId}
        />
      </Drawer>
    </Grid>
  );
};

const GroupsList = ({ w = "100%", myGroups = [], chatId }) => (
  <Stack
    width={w}
    style={{
      backgroundImage:
        "linear-gradient(rgba(220,200,200,0.5),rgba(120,110,220,0.5)",
      height: "100vh",
      overflow: "auto",
    }}
  >
    {myGroups.length > 0 ? (
      myGroups.map((group) => (
        <GroupsListItem group={group} chatId={chatId} key={group._id} />
      ))
    ) : (
      <Typography textAlign={"center"} padding={"1rem"}>
        No groups
      </Typography>
    )}
  </Stack>
);
const GroupsListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;
  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) e.preventDefault();
      }}
    >
      <Stack direction={"row"} alignItems={"center"}>
        <AvatarCard avatar={avatar} />
        <Typography>{name}</Typography>
      </Stack>
    </Link>
  );
});
export default Groups;
