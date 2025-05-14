import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signupFn } from "../lib/api";

const useSignUp = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, error } = useMutation({
        mutationFn: signupFn,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
    });

    return { isPending, error, signupMutation: mutate };
};
export default useSignUp;
