import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  const userId = req.user._id;

  try {
    const notifications = await Notification.find({ to: userId })
      .populate({
        path: "from",
        select: "userName profileImg",
      })
      .sort({ createdAt: -1 });

    //유저가 알림을 받으면 읽었음으로 변경
    await Notification.updateMany({ to: userId }, { read: true });

    res.status(200).json({
      message: "모든 알림 가져오기 성공",
      notifications: notifications,
    });
  } catch (error) {
    console.error(
      `error happened while fetching all notifications... error: ${error.message}`
    );
    res.status(500).json({ error: "internal server error" });
  }
};

//특정 사용자에게 온 모든 알람을 지움
export const deleteAllNotifications = async (req, res) => {
  const userId = req.user._id;

  try {
    await Notification.deleteMany({ to: userId });

    res.status(200).json({ message: "알림 삭제 완료" });
  } catch (error) {
    console.error(
      `error happened while deleting all notifications... error: ${error.message}`
    );
    res.status(500).json({ error: "internal server error" });
  }
};
