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
    // 컨트롤러에서의 작업을 user.model.js로 이전

    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    //검증을 마친 신규 유저 데이터 객체
    const newUser = new User({
      userName: userName,
      fullName: fullName,
      email: email,
      // password: hashedPassword,
      password: password, //model에서 pre메소드로 해시처리될 것. save호출되기 직전에
    });

    //신규 유저 발생시마다 DB저장, 토큰발급
    if (newUser) {
      //토큰발급
      generateTokenAndSetCookie(newUser._id, res);
      //DB저장
      await newUser.save();

      res.status(201).json({
        data: {
          message: "회원가입이 완료되었습니다! 환영해요.",
          _id: newUser._id,
          fullName: newUser.fullName,
          userName: newUser.userName,
          email: newUser.email,
          followers: newUser.followers,
          following: newUser.following,
          profileImg: newUser.profileImg,
          coverImg: newUser.coverImg,
        },
      });
    } else {
      res.status(400).json({ error: "올바르지 않은 형태의 데이터입니다" });
    }
  } catch (error) {
    console.error(`error while siging up.. ${error}`);
    res.status(500).json({ error: "internal server error" });
  }
};

//로그인
export const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    // const isPasswordCorrect = await bcrypt.compare(
    //   password,
    //   user?.password || ""
    // ); //일치하는 user가 없을 경우를 대비

    // 아래의 비밀번호 검증 로직을 user.model.js에서 정의한 comparePassword메소드로 대체
    const isPasswordCorrect = await user.comparePassword(password);

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
    console.error(`error while logging in.. error: ${error.messaage}`);
    res.status(500).json({ error: "internal server error" });
  }
};

//로그아웃
export const logOut = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 }); //maxAge를 0으로 함 -> 즉시 만료 == 로그아웃
    res.status(200).json({ message: "로그아웃 되었어요." });
  } catch (error) {
    console.error(`error while logging out.. ${error.messaage}`);
    res.status(500).json({ error: "internal server error" });
  }
};

//현재 로그인된 계정 정보 반환
//protectedRoute.js의 protectedRoute함수 먼저 수행 후 next()에 의해 getCurrentUser컨트롤러 수행
export const getCurrentUser = async (req, res) => {
  try {
    //protectedRoute에서 req에 user데이터 추가
    //user는 password를 제외한 User데이터
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.error(`error while getting current user data.. ${error.messaage}`);
    res.status(500).json({ error: "internal server error" });
  }
};

//클라이언트에서 입력한 비밀번호가 실제 사용자의 비밀번호가 맞는지 확인
// export const verifyPassword = async (req, res) => {};
