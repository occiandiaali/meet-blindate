const express = require("express");
const users = require("./data/fakes");

const app = express();
const PORT = process.env.PORT || 3000;

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://tvrlwzkwyvmtzunhfzid.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2cmx3emt3eXZtdHp1bmhmemlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NjM3ODEsImV4cCI6MjA2ODMzOTc4MX0.luqP6ea42YWzlQqBxgUIvyP4p3abaHodE0jLsOFoMVE";
const supabase = createClient(supabaseUrl, supabaseKey);

function generateRoomId() {
  return Math.random().toString(36).substring(2, 15);
}
const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function convertMilliseconds(ms) {
  let totalSeconds = Math.floor(ms / 1000);
  let hours = Math.floor((totalSeconds % 86400) / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let seconds = totalSeconds % 60;
  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")} ${ampm}`;
}

function isHTMX(req) {
  return req.get("HX-Request");
}

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  res.render("index", { users });
});

app.get("/user/:id", (req, res) => {
  const user = users.find((u) => u.id == req.params.id);
  if (!user) {
    return res
      .status(404)
      .send('<div class="p-4 bg-red-100 text-red-600">User not found</div>');
  }
  res.render("modal", { user });
});

app.get("/meetings", (req, res) => {
  if (isHTMX(req)) {
    res.render("partials/meetings");
  } else {
    res.render("index", { users }); // or another base template that includes the navbar + #main
  }
});
app.post("/schedule", async (req, res) => {
  const { crush, environment, duration, datetime } = req.body;

  const roomId = generateRoomId();
  const thisUser = "AfroBro";

  let now = datetime;
  let expires = Math.floor((Math.floor(+duration / 1000) % 3600) / 60);
  let formatStart = Date.parse(now);
  let start = convertMilliseconds(formatStart);

  let formatEnd = Date.parse(now) + +duration;
  let end = convertMilliseconds(formatEnd);

  try {
    const { data: insert_meeting, error: insert_meeting_err } = await supabase
      .from("meetings")
      .insert([
        {
          meeting_room_id: roomId,
          meeting_environment: environment,
          meeting_duration: duration,
          meeting_date: expires,
          start_time: start,
          end_time: end,
        },
      ]);

    if (insert_meeting_err) {
      console.log("Insert meeting err ", insert_meeting_err);
      window.alert(insert_meeting_err);
    } else {
      console.log("Inserted meeting ", insert_meeting);
      window.alert(insert_meeting);
    }

    const { data: insert_participants, error: insert_participants_err } =
      await supabase.from("meeting_participants").insert([
        { meeting_id: roomId, user_id: crush },
        { meeting_id: roomId, user_id: thisUser },
      ]);

    if (insert_participants_err) {
      console.log("Insert participants error ", insert_participants_err);
    } else {
      console.log("Participants inserted ", insert_participants);
    }
    // console.log(
    //   `Scheduled: RoomID: ${roomId} in ${environment} with ${crush} for ${duration} mins, on ${datetime}`
    // );

    // res.send(`
    //   <div class="p-4 bg-green-100 text-green-800 rounded">
    //     Meeting with ${crush} in room ${roomId} with ${environment} background scheduled for ${duration} minutes on ${new Date(
    //   datetime
    // ).toLocaleString()} ✅
    //   </div>
    // `);

    res.render("result", {
      crush,
      environment,
      expires,
      now,
      roomId,
      thisUser,
      start,
      end,
    });
  } catch (err) {
    res.status(500).send(`
      <div class="p-4 bg-red-100 text-red-600 rounded">
        Failed to create meeting. ${err.message}
      </div>
    `);
  }
});
// 🧪 Pro Tips
// You can pre-fill name from the selected user or allow the user to choose from all available names.
// <!-- <option value="<%= user.name %>"><%= user.name %></option> -->
// You could also improve UX by refreshing the meetings list after submission using hx-trigger.

// Would you like me to help build a meetings overview table, or set up delete/update functionality next? We could even add a toast notification with HTMX’s hx-trigger="afterRequest" magic if you're feeling fancy. 😎

app.get("/account", (req, res) => {
  if (isHTMX(req)) {
    res.render("partials/account");
  } else {
    res.render("index", { users }); // or another base template that includes the navbar + #main
  }
});

app.get("/settings", (req, res) => {
  if (isHTMX(req)) {
    res.render("partials/settings");
  } else {
    res.render("index", { users }); // or another base template that includes the navbar + #main
  }
});

app.get("/signin", (req, res) => {
  if (isHTMX(req)) {
    res.render("partials/signin");
  } else {
    res.render("index", { users }); // or another base template that includes the navbar + #main
  }
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { user, error: signinErr } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (signinErr) {
    return res.status(401).send("Login failed!");
  }
  res.render("partials/account");
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const { user, error: signUpErr } = await supabase.auth.signUp({
    email,
    password,
  });
  if (signUpErr) {
    return res.status(400).send(signUpErr.message);
  }
  console.log("Created: ", user);
  res.render("partials/account");
  res.send(`User created; ${user.email}`);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
