import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { AuthSlice } from "../../models/AuthSlice";

// Define initial state
const initialState: AuthSlice = {
  isLoggedIn:
    localStorage.getItem("authToken") !== null &&
    localStorage.getItem("authToken") !== undefined &&
    localStorage.getItem("authToken") !== "",
  modalOpen: false,
  username: localStorage.getItem("username") ?? "",
  authToken: localStorage.getItem("authToken") ?? "",
};

// Tạo async thunk để gọi API login
export const doLogin = createAsyncThunk(
  "auth/doLogin", 
  async ({ username, password }: { username: string; password: string }) => {
    try {
      const response = await axios.post("http://localhost:8080/identity/auth/log-in", {
        username,
        password,
      });

      if (response.data && response.data.data.token) {
        // Trả về thông tin username và token từ server
        return {
          token: response.data.data.token,
          username,
        };
      } else {
        // Nếu không có token, throw lỗi
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      throw new Error("Server error or invalid credentials");
    }
  }
);

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    updateModal: (state, action: PayloadAction<boolean>) => {
      return { ...state, modalOpen: action.payload };
    },

    // Action logout
    doLogout: (state) => {
      localStorage.removeItem("username");
      localStorage.removeItem("authToken");
      return { ...state, username: "", authToken: "", isLoggedIn: false };
    },

    // Action để khởi tạo lại trạng thái từ localStorage khi load lại trang
    initializeState: (state) => {
      const authToken = localStorage.getItem("authToken");
      const username = localStorage.getItem("username");
      if (authToken) {
        state.authToken = authToken;
        state.username = username ?? "";
        state.isLoggedIn = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Khi đăng nhập thành công
      .addCase(doLogin.fulfilled, (state, action) => {
        const { token, username } = action.payload;

        // Lưu thông tin vào localStorage
        localStorage.setItem("authToken", token);
        localStorage.setItem("username", username);

        // Cập nhật lại trạng thái Redux
        state.authToken = token;
        state.username = username;
        state.isLoggedIn = true;
        state.modalOpen = false;
      })
      // Nếu đăng nhập bị lỗi
      .addCase(doLogin.rejected, (state, action) => {
        alert(action.error.message || "Login failed");
        state.isLoggedIn = false;
      });
  },
});

// Action exports
export const { updateModal, doLogout, initializeState } = authSlice.actions;
export default authSlice.reducer;
