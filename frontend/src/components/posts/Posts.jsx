//Post.jsx 는 말그대로 게시물 하나에 대한 구조를 잡아주는 컴포넌트'
//Posts.jsx는 여러개의 Post컴포넌트를 묶어서 보여주는 컴포넌트
//각 화면에서 탭 전환에 따른 feedType에 따라 다양한 API로 요청을 보냄.

import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({ feedType, userName, userId }) => {
  const fetchPostEndpoint = () => {
    switch (feedType) {
      case "모든 글 보기":
        return "/api/posts/all";
      case "팔로잉":
        return "/api/posts/following";
      case "작성한 글":
        return `/api/posts/profile/${userName}`;
      case "좋아하는 글":
        return `/api/posts/liked/${userId}`;
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
  }, [feedType, userName, refetch]);

  //각 API마다 리턴하는 데이터의 변수명이 달라서 아래와 같이 조작하여 postArray에 할당
  let postArray;

  switch (feedType) {
    case "모든 글 보기":
      postArray = data?.posts || [];
      break;
    case "팔로잉":
      postArray = data?.followingPosts || [];
      break;
    case "작성한 글":
      postArray = data?.posts || [];
      break;
    case "좋아하는 글":
      postArray = data?.posts || [];
      break;
    default:
      postArray = data?.posts || [];
  }

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}

      {/* 각 API별로 응답 데이터가 0개일 때 UI처리 */}
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
      {!isLoading &&
        !isRefetching &&
        postArray.length === 0 &&
        feedType === "작성한 글" && (
          <p className="text-center my-4">아직 작성한 글이 없어요!</p>
        )}
      {!isLoading &&
        !isRefetching &&
        postArray.length === 0 &&
        feedType === "좋아하는 글" && (
          <p className="text-center my-4">좋아하는 글이 없어요!</p>
        )}

      {/* API응답으로 1개 이상의 데이터를 받아왔으면 화면에 보여줌  */}
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
