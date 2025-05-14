import { axiosInstance } from "./axios";

export const signupFn = async (signupData) => {
    const res = await axiosInstance.post("/auth/signup", signupData);
    return res.data;
}

export const loginFn = async (loginData) => {
    const res = await axiosInstance.post("/auth/login", loginData);
    return res.data;
}

export const getAuthUser = async() => {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
}

export const completeOnboarding = async (userData) => {
    const response = await axiosInstance.post("/auth/onboarding", userData);
    return response.data;
}