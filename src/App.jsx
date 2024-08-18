import React, { lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectRoute from "./components/auth/ProtectRoute";
import { Suspense } from "react";
import { LayoutLoader } from "./components/Layout/Loaders";
import axios from "axios";
import { server } from "./constants/config";
import { useDispatch, useSelector } from "react-redux";
import { userExists, userNotExists } from "./redux/reducers/auth";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "../socket";
const DashBoard = lazy(() => {
  return import("./pages/admin/DashBoard");
});
const ChatManagment = lazy(() => {
  return import("./pages/admin/ChatManagment");
});
const MessageManagment = lazy(() => {
  return import("./pages/admin/MessageManagment");
});
const UserManagment = lazy(() => {
  return import("./pages/admin/UserManagment");
});
const Home = lazy(() => {
  return import("./pages/Home");
});
const Login = lazy(() => {
  return import("./pages/Login");
});
const Chat = lazy(() => {
  return import("./pages/Chat");
});
const Groups = lazy(() => {
  return import("./pages/Groups");
});
const NotFound = lazy(() => {
  return import("./pages/NotFound");
});
const AdminLogin = lazy(() => {
  return import("./pages/admin/AdminLogin");
});
let user = true;

const App = () => {
  const dispatch = useDispatch();
  const { user, loader } = useSelector((state) => state.auth);
  useEffect(() => {
    axios
      .get(`${server}/api/v1/user/me`, { withCredentials: true })
      .then(({ data }) => dispatch(userExists(data.user)))
      .catch((err) => dispatch(userNotExists()));
  }, [dispatch]);
  return loader ? (
    <LayoutLoader />
  ) : (
    <BrowserRouter>
      <div></div>
      <Suspense fallback={<LayoutLoader />}>
        <Routes>
          <Route
            element={
              <SocketProvider>
                <ProtectRoute user={user} />
              </SocketProvider>
            }
          >
            <Route path="/" element={<Home />}></Route>
            <Route path="/chat/:chatId" element={<Chat />}></Route>
            <Route path="/group" element={<Groups />}></Route>
          </Route>

          <Route
            path="/login"
            element={
              <ProtectRoute user={!user} redirect="/">
                <Login />
              </ProtectRoute>
            }
          ></Route>
          <Route path="/admin" element={<AdminLogin />}></Route>
          <Route path="/admin/dashboard" element={<DashBoard />}></Route>
          <Route path="/admin/chat" element={<ChatManagment />}></Route>
          <Route path="/admin/messages" element={<MessageManagment />}></Route>
          <Route path="/admin/user" element={<UserManagment />}></Route>

          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </Suspense>
      <Toaster position="bottom-center" />
    </BrowserRouter>
  );
};

export default App;
