import React from "react";
import { Stack } from "@mui/material";
import ChatItem from "../shared/ChatItem";
import { backcolor } from "../../constants/color";

const ChatList = ({
  w = "100%",
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [
    {
      chatId: "",
      count: 0,
    },
  ],
  handleDeleteChat,
}) => {
  return (
    <Stack
      width={w}
      direction={"column"}
      overflow={"auto"}
      height={"100%"}
      sx={{
        backgroundImage:
          "linear-gradient(rgba(220,200,200,0.5),rgba(120,110,220,0.5))",
      }}
    >
      {chats?.map((data, index) => {
        const { avatar, name, _id, groupChat, members } = data;
        const newMessageAlert = newMessagesAlert.find(
          ({ chatId }) => chatId === _id
        );
        const isOnline = members?.some((member) =>
          onlineUsers.includes(member)
        );
        return (
          <ChatItem
            index={index}
            newMessageAlert={newMessageAlert}
            isOnline={isOnline}
            avatar={avatar}
            _id={_id}
            name={name}
            key={_id}
            groupChat={groupChat}
            sameSender={chatId === _id}
            handleDeleteChat={handleDeleteChat}
          />
        );
      })}
    </Stack>
  );
};

export default ChatList;
