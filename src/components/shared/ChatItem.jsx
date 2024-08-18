import React, { memo } from "react";
import { Link } from "../styles/StyledComponent";
import { Box, Stack, Typography } from "@mui/material";
import AvatarCard from "./AvatarCard";
import {motion} from "framer-motion"
const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
}) => {
  return (
    <Link
      sx={{ padding: "0" }}
      to={`/chat/${_id}`}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
    >
      <motion.div
      initial={{opacity:0,y:"-100%"}}
      whileInView={{opacity:1,y:0}}
      transition={{delay:index*0.1}}
        style={{
        
          display: "flex",
       height:"4.5rem",
          gap: "1rem",
          position: "relative",
          alignItems: "center",
          padding: "1rem",
          // alignContent:"center",
          backgroundColor: sameSender ? "black" : "unset",
          color: sameSender ? "white" : "unset",
          
        }}
      >
        <Stack direction={"row"} flexDirection={"row-reverse"} spacing={"1rem"} marginLeft={"-2rem"}>
          <Stack justifyContent={"center"}>
          <Typography >{name}</Typography>
          {newMessageAlert && (
            <Typography >{newMessageAlert.count} new Message</Typography>
          )}
          </Stack>
         

          <AvatarCard avatar={avatar} sx={{top:"50%"}} />
        </Stack>
        {isOnline && (
          <Box
            sx={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "green",
              position: "absolute",
              top: "50%",
              right: "1rem",
              transform: "translateY(-50%)",
            }}
          />
        )}
      </motion.div>
    </Link>
  );
};

export default memo(ChatItem);
