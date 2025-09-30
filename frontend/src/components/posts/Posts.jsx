//Post.jsx 는 말그대로 게시물 하나에 대한 구조를 잡아주는 컴포넌트'
//Posts.jsx는 여러개의 Post컴포넌트를 묶어서 보여주는 컴포넌트
//각 화면에서 탭 전환에 따른 feedType에 따라 다양한 API로 요청을 보냄.

import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({ feedType }) => {
  const fetchPostEndpoint = () => {
    switch (feedType) {
      case "모든 글 보기":
        return "/api/posts/all";
      case "팔로잉":
        return "/api/posts/following";

      default:
        return "/api/posts/all";
    }
  };

  //홈페이지의 상단 탭에서 [모든글 보기, 팔로잉 글 보기]의 값에 따라 각각의 api경로로 요청
  const POST_ENDPOINT = fetchPostEndpoint();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["posts", feedType],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URI}${POST_ENDPOINT}`,
          { method: "GET", credentials: "include" }
        );

        const response = await res.json();

        if (!res.ok || response.error)
          throw new Error(response.error || "알 수 없는 에러가 발생했습니다!");

        return response; //이게 data로 들어감
      } catch (error) {
        console.error(
          `error happended while fetching posts...: ${error.message}`
        );
        throw error;
      }
    },
  });

  useEffect(() => {
    refetch();
    // console.log(`data looks like: ${JSON.stringify(data)}`);
  }, [feedType, refetch]);

  //백엔드에서 all, following각각 게시글 배열의 이름이 달라서 클라이언트 렌더링시 통일된 이름으로 사용하기 위함
  //prettier-ignore
  const postArray = feedType === "모든 글 보기" ? data?.posts || [] : data?.followingPosts || [];

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading &&
        !isRefetching &&
        postArray.length === 0 &&
        feedType === "모든 글 보기" && (
          <p className="text-center my-4">
            아직 아무런 글이 없어요. 최초로 추억을 남겨보세요!
          </p>
        )}
      {!isLoading &&
        !isRefetching &&
        postArray.length === 0 &&
        feedType === "팔로잉" && (
          <p className="text-center my-4">
            더 많은 사람들을 팔로우하고 다양한 추억을 구경해보세요!
          </p>
        )}
      {!isLoading && !isRefetching && postArray && (
        <div>
          {postArray.map((post) => (
            <Post key={post._id} post={post} feedType={feedType} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
