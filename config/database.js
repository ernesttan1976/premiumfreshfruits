import mongoose from "mongoose";
// import getConfig from 'next/config';

// const { serverRuntimeConfig } = getConfig();
// const {
//   DATABASE_URL,
// } = serverRuntimeConfig;
// console.info(DATABASE_URL)
let connectionTimeout;

const DATABASE_URL = process.env.DATABASE_URL

const connect = () => {

  // mongoose.set('bufferTimeoutMS', 5000);

  mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // maxPoolSize: 20, // Maintain up to 20 socket connections
    // other mongoose options
  });

  mongoose.connection.on("error", (err) =>
    console.info(err.message + " is Mongod not running?")
  );

  mongoose.connection.once("open", () => {
    console.info("Connected to mongoose...");
    
    if (process.env.NODE_ENV === 'development') {
      connectionTimeout = setTimeout(() => {
        disconnect();
      }, 5 * 60 * 1000); // 5 minutes in milliseconds
    }

    // if (process.env.NODE_ENV !== 'development') {
    //   connectionTimeout = setTimeout(() => {
    //     disconnect();
    //   }, 5 * 60 * 1000); // 5 minutes in milliseconds
    // }

  });

  mongoose.connection.on("disconnected", () =>
    console.info("mongo disconnected")
  );
};

const disconnect = () => {
  if (connectionTimeout) {
    clearTimeout(connectionTimeout);
    connectionTimeout = undefined; // Reset the connectionTimeout variable
  }
  mongoose.connection.close()
    .then(() => {
      console.log("Mongoose connection closed.");
    })
    .catch((err) => {
      console.log("Error closing Mongoose connection:", err);
    });
};

export {
  connect, disconnect
}