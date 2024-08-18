import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  Stack,
  Avatar,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { CameraAlt, Visibility, VisibilityOff } from "@mui/icons-material";
import { VisuallyHiddenInput } from "../components/styles/StyledComponent";
import { useFileHandler, useInputValidation } from "6pp";
import { usernameValidator } from "../utils/validators";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../constants/config";
import { userExists } from "../redux/reducers/auth";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleLogin = () => setIsLogin((isLogin) => !isLogin);
  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useInputValidation("");
  const avatar = useFileHandler("single");
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Logging In...");
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username: username.value,
          password: password.value,
        },
        config
      );
      dispatch(userExists(data.user));
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Signing Up...");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/new`,
        formData,
        config
      );

      dispatch(userExists(data.user));
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <div
      style={{
        backgroundImage: "linear-gradient(rgba(220,200,200,0.5),rgba(120,110,220,0.5)",
      }}
    >
      <Container
        component={"main"}
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={24}
          sx={{
            padding: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {isLogin ? (
            <>
              <Typography variant="h5">Login</Typography>
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleLogin}
              >
                <TextField
                  required
                  fullWidth
                  label="username"
                  margin="normal"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                />
                <TextField
                  type={showPassword ? "text" : "password"}
                  required
                  fullWidth
                  label="password"
                  margin="normal"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  sx={{
                    marginTop: "1rem",
                  }}
                  fullWidth
                  variant="contained"
                  color="secondary"
                  type="submit"
                  disabled={isLoading}
                >
                  Login
                </Button>
                <Typography marginTop="1rem" textAlign={"center"}>
                  OR
                </Typography>
                <Button
                  fullWidth
                  variant="text"
                  color="secondary"
                  onClick={toggleLogin}
                  disabled={isLoading}
                >
                  Sign Up
                </Button>
              </form>
            </>
          ) : (
            <>
              <Typography variant="h5">Sign Up</Typography>

              <form
                style={{
                  width: "100%",
                }}
                onSubmit={handleSignUp}
              >
                <Stack position={"relative"} width={"7rem"} margin={"auto"}>
                  <Avatar
                    sx={{
                      width: "8rem",
                      height: "8rem",
                      objectFit: "contain",
                    }}
                    src={avatar.preview}
                  />

                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: -5,
                      right: -17,
                      color: "white",
                      bgcolor: "rgba(0,0,0,0.5)",
                      ":hover": {
                        bgcolor: "rgba(0,0,0,0.8)",
                      },
                    }}
                    component="label"
                  >
                    <CameraAlt />
                    <VisuallyHiddenInput
                      type="file"
                      onChange={avatar.changeHandler}
                    />
                  </IconButton>
                </Stack>
                {avatar.error && (
                  <Typography
                    m={"auto"}
                    color="error"
                    width={"fit-content"}
                    display={"block"}
                    variant="caption"
                  >
                    {avatar.error}
                  </Typography>
                )}

                <TextField
                  required
                  fullWidth
                  label="name"
                  margin="normal"
                  variant="outlined"
                  value={name.value}
                  onChange={name.changeHandler}
                />
                <TextField
                  required
                  fullWidth
                  label="username"
                  margin="normal"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                />
                {username.error && (
                  <Typography color="error" variant="caption">
                    {username.error}
                  </Typography>
                )}
                <TextField
                  fullWidth
                  label="Bio"
                  margin="normal"
                  variant="outlined"
                  value={bio.value}
                  onChange={bio.changeHandler}
                />
                <TextField
                  type={showPassword ? "text" : "password"}
                  required
                  fullWidth
                  label="password"
                  margin="normal"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {password.error && (
                  <Typography color="error" variant="caption">
                    {password.error}
                  </Typography>
                )}
                <Button
                  sx={{
                    marginTop: "1rem",
                  }}
                  fullWidth
                  variant="contained"
                  color="secondary"
                  type="submit"
                  disabled={isLoading}
                >
                  SIGN UP
                </Button>
                <Typography marginTop="0.7rem" textAlign={"center"}>
                  OR
                </Typography>
                <Button
                  fullWidth
                  variant="text"
                  color="secondary"
                  onClick={toggleLogin}
                  disabled={isLoading}
                >
                  Login
                </Button>
              </form>
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
