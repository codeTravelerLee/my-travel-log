import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

import { v2 as cloudinary } from "cloudinary";

//모든 게시글 가져오기
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 }) //최신글 먼저
      .populate({ path: "writer", select: "-password" }) //게시글 writer의 _id와 일치하는 mongoose다큐먼트 연결(User의 프로필 사진, 유저네임 등 정보)
      .populate({ path: "comments.writer", select: "-password" }); //댓글도

    //게시글이 암것도 없다면 빈 배열 전달
    //빈 배열도 truthy하기에 length사용
    //findById등등은 객체를 반환하고, 찾는게 없으면 null반환. BUT find()는 항상 배열을 반환하고, 찾는게 없으면 null이 아닌 빈 배열을 전달. SO (!posts)는 안됨
    if (posts.length === 0) return res.status(200).json({ posts: [] });

    //게시글 있다면
    res.status(200).json({ posts: posts });
  } catch (error) {
    console.log(`error happended while fetching all posts: ${error.message}`);
    res.status(500).json({ error: "intetnal server error" });
  }
};

//게시글 업로드
export const uploadPost = async (req, res) => {
  try {
    //사용자가 입력한 본문, 이미지
    const { text } = req.body;
    let { img } = req.body; //이따 재할당 할거임

    const currentUserId = req.user._id;
    const currentUser = await User.findById(currentUserId);

    //prettier-ignore
    if(!currentUser) return res.status(404).json({error: "일치하는 사용자를 찾을 수 없어요"});

    //글이랑 이미지중에 하나는 올려야함
    //prettier-ignore
    if(!text && !img) return res.status(400).json({error: "글이나 이미지중에 하나는 올려야 해요"});

    //이미지 올리면 cloudinary에 사진 업로드(url만 몽고디비에 저장)
    if (img) {
      const response = await cloudinary.uploader.upload(img);
      img = response.secure_url; //cloudinary에 접근 가능한 url로 재할당. 이걸 위해 let을 쓴겨
    }

    const newPost = new Post({
      writer: currentUserId,
      text: text,
      img: img,
    });

    //DB저장
    const createdPost = await newPost.save();

    res.status(201).json({ message: "게시물 업로드 성공!", post: createdPost });
  } catch (error) {
    console.log(`error happended while uploading post: ${error.message}`);
    res.status(500).json({ error: "intetnal server error" });
  }
};

//게시물 좋아요 기능
export const likePost = async (req, res) => {
  const { id: postId } = req.params;
  const currentUserId = req.user._id;

  try {
    const post = await Post.findById(postId);

    //해당 게시글이 없다면
    //prettier-ignore
    if(!post) return res.status(404).json({error: "존재하지 않는 게시물입니다. "})

    //로그인 되어있지 않다면(protectedRoute에서 잡아주지만 한번더)
    //prettier-ignore
    if(!currentUserId) return res.status(404).json({error: "먼저 로그인 해주세요! "})

    const isLikedAlready = post.likes.includes(currentUserId);

    //해당 게시글을 이미 좋아요 누른 적이 있다면 취소
    if (isLikedAlready) {
      await Post.findByIdAndUpdate(postId, { $pull: { likes: currentUserId } });
      await User.findByIdAndUpdate(currentUserId, {
        $pull: { likedPosts: postId },
      });

      //프론트에 보내줄 업데이트된 좋아요 배열 전달(프론트에서 setQueryData로 refetching없이 캐시만 수정)
      const updatedLikes = post.likes.filter(
        (id) => id.toString() !== currentUserId.toString()
      );

      res
        .status(200)
        .json({ message: "좋아요 취소 완료", updatedLikes: updatedLikes });
    } else {
      //기존에 좋아요 안눌렀으면 이번에 추가
      await Post.findByIdAndUpdate(postId, { $push: { likes: currentUserId } });
      await User.findByIdAndUpdate(currentUserId, {
        $push: { likedPosts: postId },
      });

      //게시글 작성자한테 좋아요 알람도 보내주기
      const newNotification = new Notification({
        from: currentUserId,
        to: post.writer,
        type: "like",
      });

      //notification에 보내줄 좋아요를 누른 사용자의 이름
      //prettier-ignore
      const currentUser = await User.findById(currentUserId).select("-password");

      const currentUserName = currentUser.userName;

      //새로운 알람 객체 생성
      const createdNotification = await newNotification.save();

      //프론트에 보내줄 업데이트된 좋아요 배열 전달(프론트에서 setQueryData로 refetching없이 캐시만 수정)
      const newPost = await Post.findById(postId);
      const updatedLikes = newPost.likes;

      //좋아요 누르기, 취소 및 알람 생성 모두 성공시
      res.status(200).json({
        message: "좋아요 누르기 성공",
        notiMessage: `회원님의 게시글을 ${currentUserName}님이 좋아합니다.`,
        notification: createdNotification,
        updatedLikes: updatedLikes,
      });
    }
  } catch (error) {
    console.error(
      `error happened while (un)liking the post...: ${error.message}`
    );
    res.status(500).json({ error: "internal server error" });
  }
};

//댓글달기
export const commentPost = async (req, res) => {
  try {
    const { id: toBeCommentedPostId } = req.params; //삭제할 게시물의 id
    const currentUserId = req.user._id; //댓글 남길 사용자의 id

    const { comment: text } = req.body; //사용자가 작성한 댓글 본문

    const toBeCommentedPost = await Post.findById(toBeCommentedPostId);
    //prettier-ignore
    //존재하지 않는 게시물이면
    if(!toBeCommentedPost) return res.status(404).json({error: "존재하지 않는 게시물입니다"});

    //prettier-ignore
    //댓글을 아무것도 안쓰면
    if(!text) return res.status(400).json({error: "한 글자 이상 작성해주세요"});

    //DB에 댓글 저장
    const newComment = { writer: currentUserId, text: text };
    toBeCommentedPost.comments.push(newComment);
    const savedComment = await toBeCommentedPost.save();

    res
      .status(200)
      .json({ message: "댓글이 작성되었습니다!", comment: savedComment });
  } catch (error) {
    console.log(`error happended while uploading comment: ${error.message}`);
    res.status(500).json({ error: "intetnal server error" });
  }
};

export const updatePost = async (req, res) => {};

//게시물 삭제
export const deletePost = async (req, res) => {
  try {
    //삭제하고자 하는 게시물의 id
    const { id } = req.params;

    //삭제하고자 하는 게시물
    const postToBeDeleted = await Post.findById(id);

    //그런 게시물 없다면~
    //prettier-ignore
    if(!postToBeDeleted) return res.status(404).json({error: "존재하지 않는 게시물입니다."})

    //게시글의 작성자가 맞는지 췤
    //prettier-ignore
    if(postToBeDeleted.writer.toString() !== req.user._id.toString()) return res.status(401).json({error: "삭제할 권한이 없습니다."})

    //해당 게시글에 img가 있다면 cloudinary에서도 지워주자
    if (postToBeDeleted.img) {
      await cloudinary.uploader.destroy(
        postToBeDeleted.img.split("/").pop().split(".")[0]
      );
    }

    //본인 글도 맞고, 해당 글도 존재한다면 지우자
    await Post.findByIdAndDelete(id);

    res.status(200).json({ message: "게시물 삭제 완료" });
  } catch (error) {
    console.log(`error happended while deleting post: ${error.message}`);
    res.status(500).json({ error: "intetnal server error" });
  }
};

//특정 사용자가 좋아요 누른 게시글만 가져오기
export const getLikedPosts = async (req, res) => {
  const currentUserId = req.user._id;

  try {
    const currentUser = await User.findById(currentUserId);

    if (!currentUser)
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });

    const likedPosts = await Post.find({
      _id: { $in: currentUser.likedPosts },
    })
      .populate({ path: "writer", select: "-password" })
      .populate({ path: "comments.writer", select: "-password" });

    res.status(200).json({
      message: "좋아요 누른 게시글 불러오기 성공",
      likedPosts: likedPosts,
    });
  } catch (error) {
    console.log(
      `error happended while fetching liked posts...: ${error.message}`
    );
    res.status(500).json({ error: "intetnal server error" });
  }
};

//특정 사용자가 팔로우하는 사람들의 게시글만 가져오기
export const getFollowingPosts = async (req, res) => {
  const currentUserId = req.user._id;

  try {
    const currentUser = await User.findById(currentUserId);

    //존재하지 않으면
    if (!currentUser)
      return res
        .status(404)
        .json({ error: "일치하는 사용자를 찾을 수 없습니다." });

    //currentUser가 존재하면
    const followingPosts = await Post.find({
      writer: { $in: currentUser.following },
    })
      .sort({ createdAt: -1 })
      .populate({ path: "writer", select: "-password" })
      .populate({ path: "comments.writer", select: "-password" });

    res.status(200).json({
      message: "팔로우하는 사람들 게시글 가져오기 완료",
      followingPosts: followingPosts,
    });
  } catch (error) {
    console.log(
      `error happended while fetching following posts...: ${error.message}`
    );
    res.status(500).json({ error: "intetnal server error" });
  }
};

//유저 자신이 작성한 게시글만 모아오기 (프로필에 리스트업할 용도)
export const getProfilePosts = async (req, res) => {
  const currentUserId = req.user._id;

  try {
    const user = await User.findById(currentUserId);

    if (!user)
      return res.status(404).json({ error: "일치하는 사용자를 찾을 수 없음 " });

    const profilePosts = await Post.find({ writer: currentUserId })
      .sort({ createdAt: -1 })
      .populate({ path: "writer", select: "-password" })
      .populate({ path: "comments.writer", select: "-password" });

    res.status(200).json({
      message: "자신이 작성한 글 가져오기 성공",
      profilePosts: profilePosts,
    });
  } catch (error) {
    console.log(`error happended while profile posts...: ${error.message}`);
    res.status(500).json({ error: "intetnal server error" });
  }
};

//userName에 맞는 사용자가 작성한 글을 모아줌
export const getSpecificUserProfilePosts = async (req, res) => {
  const { userName } = req.params;

  try {
    const user = await User.findOne({ userName: userName });
    if (!user)
      return res.status(404).json({ error: "존재하지 않는 사용자입니다." });

    const posts = await Post.find({ writer: user._id })
      .sort({ createdAt: -1 })
      .populate({ path: "writer", select: "-password" })
      .populate({ path: "comments.writer", select: "-password" });

    res.status(200).json({
      message: `${user.userName}님의 작성한 글을 불러왔습니다.`,
      posts: posts,
    });
  } catch (error) {
    console.error(
      `error happened while fetching specific user's profile posts...: ${error.message}`
    );
    res.status(500).json({ error: "internal server error" });
  }
};

//userName에 맞는 사용자가 좋아요 누른 글을 모아줌
export const getSpecificUserLikedPosts = async (req, res) => {
  const { userName } = req.params;

  try {
    const user = await User.findOne({ userName: userName });

    if (!user)
      return res.status(404).json({ error: "존재하지 않는 사용자입니다. " });

    const posts = await Post.find({ $in: { likes: user._id } });

    res.status(200).json({
      message: `${user.userName}님의 좋아요 누른 글을 불러왔습니다.`,
      posts: posts,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "internal server error" });
  }
};
