import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { getCurrentUser } from "../utils/tanstack/getCurrentUser";
import toast from "react-hot-toast";

const useFollow = () => {
  const queryClient = useQueryClient();

  // const { data: currentUser } = useQuery({
  //   queryKey: ["authUser"],
  //   queryFn: getCurrentUser,
  // });

  const {
    mutate: follow,
    isPending: isFollowing,
    error,
  } = useMutation({
    //팔로우 하고싶은 유저의 id
    mutationFn: async (id) => {
      try {
        const res = await fetch(
          //팔로우 할 사람
          `${import.meta.env.VITE_SERVER_URI}/api/user/follow/${id}`,
          { method: "POST", credentials: "include" }
        );

        const response = await res.json();

        if (!res.ok || response.error)
          throw new Error(error.message || "error!");

        return response;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("팔로우 성공!");

      //하나라도 실패하면 전체 실패시켜버리기
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
