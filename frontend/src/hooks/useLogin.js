import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginFn } from "../lib/api";

const useLogin = () => {
    const queryClient = useQueryClient();
    const { mutate, isPending, error } = useMutation({
        mutationFn: loginFn,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
    });

    return { error, isPending, loginMutation: mutate };
};

export default useLogin;