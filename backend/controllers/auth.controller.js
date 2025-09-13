import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

//회원가입
export const signUp = async (req, res) => {
  try {
    const { userName, fullName, password, email } = req.body;

    //이메일 형식 유효성 검증
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "올바르지 않은 이메일 형식이에요" });
    }

    //이미 사용중인 이메일인지 확인
    const emailExists = await User.findOne({ email: email });
    if (emailExists) {
      return res.status(400).json({ error: "이미 사용중인 이메일이에요" });
    }

    //이미 사용중인 유저네임인지 확인
    const userNameExists = await User.findOne({ userName: userName });
    if (userNameExists) {
      return res.status(400).json({
        error: "이미 사용중인 유저네임이에요. 다른 이름을 지어주세요",
      });
    }

    //fullName을 입력했는지 확인
    if (!fullName) {
      return res.status(400).json({ error: "fullName은 필수로 입력해야 해요" });
    }

    //비밀번호 8글자 이상인지 쳌
    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "비밀번호는 8글자 이상이어야 해요" });
    }

    //비밀번호 해싱
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //검증을 마친 신규 유저 데이터 객체
    const newUser = new User({
      userName: userName,
      fullName: fullName,
      email: email,
      password: hashedPassword,
    });

    //신규 유저 발생시마다 DB저장, 토큰발급
    if (newUser) {
      //토큰발급
      generateTokenAndSetCookie(newUser._id, res);
      //DB저장
      await newUser.save();

      res.status(201).json({
        message: "회원가입이 완료되었습니다! 환영해요.",
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      });
    } else {
      res.status(400).json({ error: "올바르지 않은 형태의 데이터입니다" });
    }
  } catch (error) {
    console.error(`error while siging up.. ${error.messaage}`);
    res.status(500).json({ error: "internal server error" });
  }
};

//로그인
export const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = User.findOne({ email: email });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    ); //일치하는 user가 없을 경우를 대비

    //해당 이메일을 사용하는 유저가 없거나 비밀번호가 틀린 경우
    if (!user) {
      return res.status(400).json({ error: "존재하지 않는 이메일입니다." });
    }

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "비밀번호가 일치하지 않습니다." });
    }

    //이메일과 비밀번호가 일치한다면
    //로그인 진행
    //토큰 발급
    generateTokenAndSetCookie(user._id, res);

    res.status(201).json({
      message: `${user.userName}님, 환영해요!`,
      _id: user._id,
      fullName: user.fullName,
      userName: user.userName,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
    });
  } catch (error) {
    console.error(`error while logging in.. ${error.messaage}`);
    res.status(500).json({ error: "internal server error" });
  }
};

//로그아웃
export const logOut = (req, res) => {
  res.send("logout page");
};
