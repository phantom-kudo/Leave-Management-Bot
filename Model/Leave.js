const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  hrmid: String,
  leaveType: String,
  leaveDate: String,
  noOfDays: String,
  leaveStatus: {
    type: String,
    default: "Not Approved Yet",
  },
});

const Leave = mongoose.model("Leave", leaveSchema);
module.exports = Leave;
