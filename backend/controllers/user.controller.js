import Notification from "../models/notification.model.js";
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
      //팔로우 요청을 받은 애한테 요청 왔다고 알람을 쏴주자
      const newNotification = new Notification({
        from: req.user._id,
        to: targetUser._id, //id로 해도 되는데 그럼 문자열이라 objectId로 바꿔줘야 함. 번거로우니 그냥 targetUser._id로!
        type: "follow",
      });

      //알림을 DB에 저장 -> 나중에 특정 유저한테 온 알람들 쭉 리스트업 해서 보여주기 위함
      await newNotification.save();

      await res
        .status(200)
        .json({ message: `이제 ${targetUser.userName}님을 팔로우 합니다!` });
    }
  } catch (error) {
    console.log(`error happened while (un)following user: ${error.message}`);
    res.status(500).json({ error: "internal server error" });
  }
};

//유저 추천
export const getRecommendedUser = async (req, res) => {
  //로그인 되어있는 유저id
  const currentUserId = req.user._id;

  //현재 로그인중인 유저가 팔로우중인 id들이 담긴 배열 following을 가진 객체.
  //진짜 id배열 데이터에 접근하려면 usersFollwedByCurrentUser.following
  const usersFollowedbyCurrentUser = await User.findById({
    _id: currentUserId,
  }).select("following");

  //자기 자신을 제외하고 선별된 랜덤한 10명의 사용자
  //aggregate => find계열과 달리 바로 배열 반환. SO, 그냥 이 자체로 바로 id담긴 배열임
  const randomlySelectedUsers = await User.aggregate([
    { $match: { _id: { $ne: currentUserId } } },
    { $sample: { size: 10 } },
  ]);

  //뽑힌 랜덤한 사용자중, 이미 팔로우중인 애들은 제외
  //filter. 포함하지 않는 애들만 골라라!
  const alreadyFollowingExcludedRandomUsers = randomlySelectedUsers.filter(
    //randomUser각각은 이미 팔로우중인 id
    (randomUser) =>
      //포함되어 있지 않은 애만 남겨라!
      !usersFollowedbyCurrentUser.following //currentUser가 이미 팔로우중인 id가 담긴 배열
        .map((id) => id.toString()) //ObjectId타입을 문자열로 변환 for 정확한 비교
        .includes(randomUser._id.toString())
  );

  //선발된 애들 데이터 넘겨주기 전에 비밀번호 제거
  alreadyFollowingExcludedRandomUsers.forEach((user) => (user.password = null));

  //현재 로그인된 유저의 이름 (res응답메세지에 보내줄 용도)
  const currentUserName = await User.findById({ _id: currentUserId }).select(
    "userName"
  );

  //클라이언트로 보내주자
  res
    .status(200)
    .json({
      message: `${currentUserName}님, 이런 친구들은 어떠세요?`,
      recommended: alreadyFollowingExcludedRandomUsers,
    });

  try {
  } catch (error) {
    console.log(
      `error happened while recommending users profile: ${error.message}`
    );
    res.status(500).json({ error: "internal server error" });
  }
};
