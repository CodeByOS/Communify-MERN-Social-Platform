import { axiosInstance } from "./axios";

export const signupFn = async (signupData) => {
    const res = await axiosInstance.post("/auth/signup", signupData);
    return res.data;
}