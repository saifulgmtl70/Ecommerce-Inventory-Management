import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosPublic from "./useAxiosPublic";

const useCart = () => {
    const axiosPublic = useAxiosPublic();
    const { user } = useAuth();

    const {
        refetch,
        data: cart = [],
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["cart", user?.email],

        enabled: !!user?.email,

        queryFn: async () => {
            const res = await axiosPublic.get("/carts", {
                params: {
                    email: user.email,
                },
            });

            return res.data;
        },
    });

    return [cart, refetch, isLoading, isError, error];
};

export default useCart;