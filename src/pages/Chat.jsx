import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import AppLayout from "../components/Layout/AppLayout";
import { IconButton, Skeleton, Stack } from "@mui/material";
import { grayColor, purple } from "../constants/color";
import { InputBox } from "../components/styles/StyledComponent";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import FileMenu from "../components/dialog/FileMenu";
import MessageComponent from "../components/shared/MessageComponent";
import { getSocket } from "../../socket";
import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
} from "../constants/events";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { useSocketEvents } from "../hooks/hook";
import { useInfiniteScrollTop } from "6pp";
import { useDispatch } from "react-redux";
import { setIsFileMenu } from "../redux/reducers/misc";
import { removeNewMessagesAlert } from "../redux/reducers/chat.js";
import { TypingLoader } from "../components/Layout/Loaders.jsx";
import { useNavigate } from "react-router-dom";

const Chat = ({ chatId, user }) => {
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [type, setType] = useState(false);
  const [userType, setUserType] = useState(false);
  const typingTimeout = useRef(null);
  const socket = getSocket();
  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });
  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );
  // console.log(oldMessages);
  const members = chatDetails?.data?.chat?.members;
  const messageOnChange = (e) => {
    setMessage(e.target.value);
    if (!type) {
      socket.emit(START_TYPING, { members, chatId });
      setType(true);
    }
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setType(false);
    }, [200]);
  };
  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };
  useEffect(() => {
    socket.emit(CHAT_JOINED,{userId:user._id,members})
    dispatch(removeNewMessagesAlert(chatId));
    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_LEAVED,{userId:user._id,members})
    };
  }, [chatId]);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);
  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );
  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      console.log("strt-typing", data);
      setUserType(true);
    },
    [chatId]
  );
  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      console.log("stop -typing", data);
      setUserType(false);
    },
    [chatId]
  );
  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "djasdhajksdhasdsadasdas",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );

  const eventHandlers = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };
  useSocketEvents(socket, eventHandlers);
  const allMessages = [...oldMessages, ...messages];

  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <Fragment>
      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={grayColor}
        height={"80% "}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {allMessages.map((i) => (
          <MessageComponent key={i._id} message={i} user={user} />
        ))}
        {userType && <TypingLoader />}
        <div ref={bottomRef} />
      </Stack>
      <form
        style={{
          height: "10%",
        }}
        onSubmit={submitHandler}
      >
        <Stack
          direction={"row"}
          height={"100%"}
          padding={"1rem"}
          alignItems={"center"}
          position={"relative"}
        >
          <IconButton
            sx={{
              position: "absolute",
              left: "-0.7rem",
              rotate: "30deg",
            }}
            // ref={fileMenuRef}
            onClick={handleFileOpen}
          >
            <AttachFileIcon />
          </IconButton>
          <InputBox
            placeholder="Message"
            value={message}
            onChange={messageOnChange}
          />
          <IconButton
            type="submit"
            sx={{
              // rotate:"-30deg",
              // bgcolor: purple,
              // color: "white",
              marginLeft: "1rem",
              padding: "0.5rem",
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>
      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
    </Fragment>
  );
};

export default AppLayout()(Chat);
