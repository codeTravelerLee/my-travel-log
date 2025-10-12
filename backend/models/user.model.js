import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    profileImg: {
      type: String,
      default: "",
    },
    coverImg: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      default: "",
    },
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: [],
      },
    ],
    //장바구니 담은 상품
    cartItems: [
      {
        quantity: {
          type: Number,
          default: 1,
          min: 0,
        },
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      },
    ],
    //해당 사용자가 가진 쿠폰
    coupons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon",
      },
    ],
    //유저의 권한
    //[1] user: 일반 사용자 - 게시글 작성, 조회, 개인상품 조회 및 판매, 구매 가능(중고거래)
    //[2] admin: 총관리자
    //[3] seller: 상품판매를 등록한 사장님들.
    role: {
      type: String,
      enum: ["user", "seller", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

//비밀번호 해싱과 로그인시 compare로직을 컨트롤러에서 모델로 이전
//this는 현재 저장할 user인스턴스 (mongoose의 pre메소드가 제공)
userSchema.pre("save", async function (next) {
  //비밀번호는 그대로 냅두고 다른 필드만 수정한 경우에는 불필요한 해싱을 막음.
  if (!this.isModified("password")) return next();

  //비밀번호가 새로 생성되었거나 수정된 경우 해싱.
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

//로그인시 compare작업은 아래서 생성한 comparePassword로 간단히 처리
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
