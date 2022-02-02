//в терминале вводить node timer.js 20-15-25-03-2022 03-23-01-12-2023 (любые даты в формате HH-mm-DD-MM-YYYY)

const EventEmitter = require("events");
const emitter = new EventEmitter();
const moment = require("moment");

const timers = process.argv.slice(2);

class Handler {
  static timerEnd(timerNumber) {
    console.log("Timer № " + timerNumber + " is over!");
  }
}

class Timer {
  constructor(number, date) {
    this.number = number;
    this.date = date;
    this.year = 0;
    this.month = 0;
    this.day = 0;
    this.hour = 0;
    this.minute = 0;
    this.second = 0;
  }

  run() {
    let interval = setInterval(() => {
      const timeNow = moment();
      const timeReceived = moment(this.date, "HH-mm-DD-MM-YYYY");
      const timerSeconds = timeReceived.diff(timeNow, "seconds");
      if (timerSeconds >= 31536000) {
        this.year = Math.floor(timerSeconds / 31536000);
      }
      if (timerSeconds - this.year * 31536000 < 31536000) {
        this.month = Math.floor(
          (timerSeconds - this.year * 31536000) / 2628000
        );
      }
      if (
        timerSeconds - this.year * 31536000 - this.month * 2628000 <
        2628000
      ) {
        this.day = Math.floor(
          (timerSeconds - this.year * 31536000 - this.month * 2628000) / 86400
        );
      }
      if (
        timerSeconds -
          this.year * 31536000 -
          this.month * 2628000 -
          this.day * 86400 <
        86400
      ) {
        this.hour = Math.floor(
          (timerSeconds -
            this.year * 31536000 -
            this.month * 2628000 -
            this.day * 86400) /
            3600
        );
      }
      if (
        timerSeconds -
          this.year * 31536000 -
          this.month * 2628000 -
          this.day * 86400 -
          this.hour * 3600 <
        3600
      ) {
        this.minute = Math.floor(
          (timerSeconds -
            this.year * 31536000 -
            this.month * 2628000 -
            this.day * 86400 -
            this.hour * 3600) /
            60
        );
      }
      this.second =
        timerSeconds -
        this.year * 31536000 -
        this.month * 2628000 -
        this.day * 86400 -
        this.hour * 3600 -
        this.minute * 60;

      console.log(
        "Timer № " +
          this.number +
          " is over in:" +
          " years: " +
          this.year +
          " months: " +
          this.month +
          " days: " +
          this.day +
          " hours: " +
          this.hour +
          " minutes: " +
          this.minute +
          " seconds: " +
          this.second
      );

      if (timerSeconds == 0) {
        emitter.emit("timeout", this.number);
        clearInterval(interval);
      }
    }, 1000);
  }
}

function start(array) {
  for (let i = 0; i < array.length; i++) {
    let timer = new Timer(i + 1, array[i]);
    timer.run();
  }
}
start(timers);
emitter.on("timeout", Handler.timerEnd);