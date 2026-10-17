import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosPublic from "./useAxiosPublic";


const useWishlist = () => {
    const axiosPublic = useAxiosPublic();
    const { user } = useAuth();
    
    const { refetch, data: wishlist = [] } = useQuery({
        queryKey: ['wishlist', user?.email],
        queryFn: async() => {
            const res = await axiosPublic.get(`/wishlist?email=${user.email}`);
            return res.data;
        }
    })

    return [wishlist, refetch]
};

export default useWishlist;