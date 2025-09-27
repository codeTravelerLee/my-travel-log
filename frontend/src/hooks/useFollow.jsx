import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { getCurrentUser } from "../utils/tanstack/getCurrentUser";
import toast from "react-hot-toast";

const useFollow = () => {
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUser,
  });

  const {
    mutate: follow,
    isPending: isFollowing,
    error,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URI}/api/user/follow/${
            currentUser._id
          }`,
          { method: "POST", credentials: "include" }
        );
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("팔로우 성공!");
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
      ]);
    },
    onError: () => {
      toast.error(error.message);
    },
  });
  return { follow, isFollowing };
};

export default useFollow;
