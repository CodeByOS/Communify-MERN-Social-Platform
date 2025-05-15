import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutFn } from "../lib/api";

const useLogout = () => {
    const queryClient = useQueryClient();

    const { mutate: logoutMutation, isPending, error } = useMutation({
        mutationFn: logoutFn,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
    });

    return { logoutMutation, isPending, error };
};
export default useLogout;
