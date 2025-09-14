import User from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
  const { userName } = req.params;
  try {
    const user = await User.findOne({ userName: userName }).select("-password");

    if (!user) {
      return res.status(500).json({ error: "존재하지 않는 사용자에요!" });
    }

    //프로필 정보를 찾는데 성공했다면
    res
      .status(200)
      .json({
        message: `${user.userName}님의 프로필 정보를 가져왔어요!`,
        user: user,
      });
  } catch (error) {
    console.log(`error happened while getting users profile: ${error.message}`);
    res.status(500).json({ error: "internal server error" });
  }
};
