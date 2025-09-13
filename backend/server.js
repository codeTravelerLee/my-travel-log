import express from "express";

const app = express();

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
  //DB연결 
});
