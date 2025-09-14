import User from "../models/user.model.js";

//특정 userName의 프로필 정보를 가져옴
export const getUserProfile = async (req, res) => {
  const { userName } = req.params;
  try {
    const user = await User.findOne({ userName: userName }).select("-password");

    if (!user) {
      return res.status(500).json({ error: "존재하지 않는 사용자에요!" });
    }

    //프로필 정보를 찾는데 성공했다면
    res.status(200).json({
      message: `${user.userName}님의 프로필 정보를 가져왔어요!`,
      user: user,
    });
  } catch (error) {
    console.log(`error happened while getting users profile: ${error.message}`);
    res.status(500).json({ error: "internal server error" });
  }
};

//특정 id유저 팔로우 및 언팔로우 기능
export const followOrUnfollowUser = async (req, res) => {
  //팔로우하고 싶은 프로필의 id임
  const { id } = req.params;

  //팔로우 요청을 보내는 주체
  const currentUser = await User.findById({ _id: req.user._id });
  //팔로우 요청을 받는 객체
  const targetUser = await User.findById({ _id: id });

  try {
    //로그인이 되어있는지 확인
    if (!currentUser) {
      return res.status(500).json({ error: "먼저 로그인을 해주세요!" });
    }

    //본인 스스로를 팔로우 or 언팔은 불가
    //id는 req.params에서 받아온 문자열 타입, req.user._id는 ObjectId타입.
    if (req.user._id.toString() === id) {
      return res
        .status(500)
        .json({ error: "본인 스스로를 팔로우 하거나 언팔로우 할 수 없어요!" });
    }

    //팔로우 대상 유저가 존재하지 않는다면
    if (!targetUser) {
      return res.status(500).json({ error: "존재하지 않는 사용자에요!" });
    }

    //해당 프로필을 이미 팔로우 하고 있는지 확인
    //user.model.js에서 User의 following은 mongoose.Schema.Types.ObjectId타입의 배열임. 즉, _id가 원소인 배열.
    const isAlreadyFollowing = currentUser.following.includes(id);

    if (isAlreadyFollowing) {
      //이미 팔로우중 => 언팔로우

      //언팔 당하는 사용자 팔로워 목록에서 언팔 누른애 빼주기
      await User.findByIdAndUpdate(
        { _id: id },
        { $pull: { followers: req.user._id } }
      );
      //언팔 누른애 팔로우 목록에서 target user지워주기
      await User.findByIdAndUpdate(
        { _id: req.user._id },
        { $pull: { following: id } }
      );

      //성공적으로 완료됐다면
      res.status(200).json({ message: "언팔로우 완료!" });
    } else {
      //아직 팔로우 안하니까 이제 팔로우 시키자~

      //target의 follower에 current 넣어주기
      await User.findByIdAndUpdate(
        { _id: id },
        { $push: { followers: req.user._id } }
      );
      //current의 following에 target넣어주기
      await User.findByIdAndUpdate(
        { _id: req.user._id },
        { $push: { following: id } }
      );

      //모두 성공이라면
      res
        .status(200)
        .json({ message: `이제 ${targetUser.userName}님을 팔로우 합니다!` });
    }
  } catch (error) {
    console.log(`error happened while (un)following user: ${error.message}`);
    res.status(500).json({ error: "internal server error" });
  }
};
