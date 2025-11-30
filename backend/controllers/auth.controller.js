import redis from "../lib/db/redis.js";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";

import jwt from "jsonwebtoken";

//회원가입
export const signUp = async (req, res) => {
  try {
    const { userName, fullName, email, password, passwordConfirm } = req.body;

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

    //비밀번호랑 비밀번호 생성에 입력한 값이 다른 경우
    if (password !== passwordConfirm) {
      return res.status(400).json({
        error: "처음 입력하신 비밀번호와 다시 입력하신 비밀번호가 달라요.",
      });
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

    const userData = user.toObject();
    delete userData.password;

    res.status(201).json({
      message: `${user.userName}님, 환영해요!`,
      user: userData,
    });
  } catch (error) {
    console.error(`error while logging in.. error: ${error.messaage}`);
    res.status(500).json({ error: "internal server error" });
  }
};

//로그아웃
export const logOut = async (req, res) => {
  try {
    //레디스에서 refresh토큰 삭제
    await redis.del(`refresh_token_${req.user._id}`);

    //쿠키에서 refresh, access토큰 삭제
    res.cookie("access_token", "", { maxAge: 0 }); //maxAge를 0으로 함 -> 즉시 만료 == 로그아웃
    res.cookie("refresh_token", "", { maxAge: 0 });

    res.status(200).json({ message: "로그아웃 되었어요." });
  } catch (error) {
    console.error(`error while logging out.. ${error.message}`);
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
    res.status(200).json({ userData: user });
  } catch (error) {
    console.error(`error while getting current user data.. ${error.messaage}`);
    res.status(500).json({ error: "internal server error" });
  }
};

//액세스 토큰 갱신
export const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken)
    return res.status(401).json({ error: "유효한 리프레시 토큰이 없습니다." });

  try {
    const redisRefreshToken = await redis.get(`refresh_token_${req.user._id}`);

    //쿠키에 저장된 refresh token과 레디스에 저장된 걸 비교
    if (refreshToken !== redisRefreshToken)
      return res
        .status(401)
        .json({ error: "유효하지 않은 리프레시 토큰입니다." });

    //유효하다면 new 액세스 토큰 생성
    const access_token = jwt.sign(
      { userId: req.user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    //새로 만든 엑세스 토큰 쿠키에 저장
    res.cookie("access_token", access_token, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });

    res.status(200).json({ message: "엑세스 토큰 갱신 완료!" });
  } catch (error) {
    res.status(500).json({ error: `internal server error: ${error.message}` });
  }
};

//비밀번호 재설정을 위한 유저 검증 및 이메일 전송
export const forgotPassword = async (req, res) => {
  const TOKEN_EXPIRATION_SECONDS = 3600; //reset token 만료시간 1시간

  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email });

    if (!user)
      return res
        .status(400)
        .json({ error: "해당 이메일로 가입된 사용자가 없어요." });

    //해당 이메일로 가입된 사용자가 존재하는 경우
    //비밀번호 재설정 토큰 생성
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.RESET_PASSWORD_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    //redis에 refresh token저장
    await redis.set(resetToken, user._id, { EX: TOKEN_EXPIRATION_SECONDS });

    console.log(`Generated token for ${user.email}: ${token}`);

    //비밀번호 재설정 링크 생성
    const resetLink = `${process.env.CLIENT_URI}/reset-password?token=${resetToken}`;

    //nodemailer로 이메일 전송
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"마이트래블로그" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "[마이트래블로그]비밀번호 재설정 안내",
      html: `
                <h2>비밀번호 재설정 요청</h2>
                <p>안녕하세요. 귀하의 비밀번호 재설정을 위해 이 이메일을 보냅니다.</p>
                <p>아래 링크를 클릭하여 비밀번호를 재설정하십시오. 이 링크는 1시간 동안만 유효합니다.</p>
                <a href="${resetLink}" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    비밀번호 재설정
                </a>
                <p>만약 본인이 요청하지 않았다면 이 이메일을 무시하십시오.</p>
                <p>링크: ${resetLink}</p>
            `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "비밀번호 재설정 링크가 이메일로 전송되었어요.",
      resetLink: resetLink, //개발 편의를 위해 응답에 포함. 실제 서비스에서는 제외
    });
  } catch (error) {
    console.error(`error while processing forgot password.. ${error.message}`);
    res.status(500).json({ error: "internal server error" });
  }
};

//비밀번호 재설정
export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    //토큰 검증
    const decoded = jwt.verify(
      resetToken,
      process.env.RESET_PASSWORD_TOKEN_SECRET
    );
    
    const userId = decoded.userId;

    //레디스에서 토큰 존재 여부 확인
    const storedUserId = await redis.get(resetToken);

    if (!storedUserId || storedUserId !== userId) {
      return res
        .status(400)
        .json({ error: "유효하지 않거나 만료된 토큰입니다." });
    }

    //비밀번호 해싱 및 업데이트
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "사용자를 찾을 수 없습니다." });
    }

    user.password = newPassword; //model의 pre메소드에서 해시처리됨
    await user.save();

    //레디스에서 토큰 삭제
    await redis.del(resetToken);

    res.status(200).json({ message: "비밀번호가 성공적으로 변경되었어요." });
  } catch (error) {
    console.error(`error while resetting password.. ${error.message}`);
    res.status(500).json({ error: "internal server error" });
  }
};
