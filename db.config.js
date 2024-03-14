import mongoose from "mongoose";

const connectDb = async (cb) => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/passportLocal")
    .then(() => {
      return cb();
    })
    .catch((err) => {
      console.log(err.message);
    });
};

export default connectDb;
