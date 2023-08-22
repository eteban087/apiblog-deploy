require('dotenv').config();
const app = require('./app');
const { db } = require('./database/config');
const cron = require('node-cron');
const { initModel } = require('./models/initModel');
const { Server } = require('socket.io');
const Sockets = require('./sockets');

// cron.schedule('* * * * *', () => {
//   console.log('running a task every minute');
// });

db.authenticate()
  .then(() => console.log('Datbase connected...'))
  .catch((error) => console.log(error));

initModel();

db.sync({ force: false })
  .then(() => console.log('database sincronized 😃'))
  .catch((error) => console.log(error));

const PORT = +process.env.PORT || 3000;

const server = app.listen(PORT, () =>
  console.log(`server running on port ${PORT}`)
);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

new Sockets(io);
