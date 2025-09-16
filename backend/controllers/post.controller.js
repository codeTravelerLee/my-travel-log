import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

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

export const likePost = async (req, res) => {};

export const commentPost = async (req, res) => {};

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

    //본인 글도 맞고, 해당 글도 존재한다면 지우자
    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "게시물 삭제 완료" });
  } catch (error) {
    console.log(`error happended while deleting post: ${error.message}`);
    res.status(500).json({ error: "intetnal server error" });
  }
};
