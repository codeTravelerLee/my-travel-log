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

//특정 사용자에게 온 모든 알림을 지움
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

//특정 사용자에게 온 하나의 알림을 지움
export const deleteOneNotificaion = async (req, res) => {
  const userId = req.user._id; //현재 사용자의 _id
  const { id: notificationId } = req.params; //삭제할 알림의 _id

  const notification = await Notification.findById(notificationId);

  //해당 알림이 존재하지 않으면
  //prettier-ignore
  if(!notification) return res.status(404).json({error: "잘못된 요청 경로: 해당 id의 알림은 존재하지 않음"})

  //본인에게 온 알림이 아니면 못지움
  if (notification.to.toString() !== userId.toString()) {
    return res.status(403).json({ error: "본인에게 온 알림만 지울 수 있어요" });
  }

  try {
    await Notification.deleteOne({ _id: notificationId });

    res.status(200).json({ message: "알림 지우기 성공" });
  } catch (error) {
    console.error(
      `error happened while deleting the notification... error: ${error.message}`
    );
    res.status(500).json({ error: "internal server error" });
  }
};
