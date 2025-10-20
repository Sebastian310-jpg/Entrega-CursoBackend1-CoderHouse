import mongoose from "mongoose";

const connectMongoDb = async () => {
  try {
    await mongoose.connect(process.env.URI_MONGODB);

    console.log("Conectado a MongoDB");
  } catch (error) {
    console.error("Error al conectar con MongoDB: " + error.message);
  }
}

export default connectMongoDb;