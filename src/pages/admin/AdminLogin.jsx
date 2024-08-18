import React, { useEffect, useState } from "react";
import { Container, Paper, TextField, Typography, Button, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useInputValidation } from "6pp";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin, getAdmin } from "../../redux/thunks/admin";

const AdminLogin = () => {
  const {isAdmin} = useSelector(state=>state.auth);
  const dispatch  = useDispatch();
  const secretKey = useInputValidation("");

  const [showPassword, setShowPassword] = useState(false);
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(adminLogin(secretKey.value))
  };
  useEffect(()=>{
    dispatch(getAdmin());
  },[
   dispatch 

  ])

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
 
  if(isAdmin)return <Navigate to="/admin/dashboard" />

  return (
    <div
      style={{
        backgroundImage:
          "linear-gradient(rgba(220,200,200,0.5),rgba(120,110,220,0.5))",
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
          <Typography variant="h5">Admin Login</Typography>
          <form
            style={{
              width: "100%",
              marginTop: "1rem",
            }}
            onSubmit={submitHandler}
          >
            <TextField
              type={showPassword ? "text" : "password"}
              required
              fullWidth
              label="Secret Key"
              margin="normal"
              variant="outlined"
              value={secretKey.value}
              onChange={secretKey.changeHandler}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
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
            >
              Login
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default AdminLogin;
