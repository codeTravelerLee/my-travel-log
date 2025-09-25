import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";

const Posts = ({ feedType }) => {
  const fetchPostEndpoint = () => {
    switch (feedType) {
      case "모든 글 보기":
        return "/api/posts/all";
      case "팔로잉":
        return "api/posts/following";
      default:
        return "/api/posts/all";
    }
  };

  //홈페이지의 상단 탭에서 [모든글 보기, 팔로잉 글 보기]의 값에 따라 각각의 api경로로 요청
  const POST_ENDPOINT = fetchPostEndpoint();

  const { data, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URI}${POST_ENDPOINT}`
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

  return (
    <>
      {isLoading && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading &&
        data.posts?.length === 0 &&
        feedType === "모든 글 보기" && (
          <p className="text-center my-4">
            아직 아무런 글이 없어요. 최초로 추억을 남겨보세요!
          </p>
        )}
      {!isLoading && data.posts?.length === 0 && feedType === "팔로잉" && (
        <p className="text-center my-4">
          더 많은 사람들을 팔로우하고 다양한 추억을 구경해보세요!
        </p>
      )}
      {!isLoading && data.posts && (
        <div>
          {data.posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
