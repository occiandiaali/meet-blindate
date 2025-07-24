const uuidv4 = require("../public/js/uuidv4");

exports.scheduleMeeting = async (req, res) => {
  const roomId = uuidv4();
  const { environment, meetingDay, duration, participants } = req.body;

  try {
    // Save the document
    const newMeet = new Meeting({
      roomId,
      environment,
      meetingDay,
      duration,
      participants,
    });

    await newMeet.save();
  } catch (err) {
    res.status(500).send(`
      <div class="p-4 bg-red-100 text-red-600 rounded">
        Failed to create meeting. ${err.message}
      </div>
    `);
  }
};

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
