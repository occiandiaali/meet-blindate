const express = require("express");
const users = require("./data/fakes");

const app = express();
const PORT = process.env.PORT || 3000;

// const { createClient } = require("@supabase/supabase-js");

// const supabaseUrl = "https://tvrlwzkwyvmtzunhfzid.supabase.co";
// const supabaseKey =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2cmx3emt3eXZtdHp1bmhmemlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NjM3ODEsImV4cCI6MjA2ODMzOTc4MX0.luqP6ea42YWzlQqBxgUIvyP4p3abaHodE0jLsOFoMVE";
// const supabase = createClient(supabaseUrl, supabaseKey);

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

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");

// // Sample data
// const users = [
//   { id: 1, name: "Alice", image: "https://picsum.photos/100/100?random=2" },
//   { id: 2, name: "Bob", image: "https://i.pravatar.cc/100?img=3" },
//   // Add more users here
// ];

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

function isHTMX(req) {
  return req.get("HX-Request");
}

app.get("/meetings", (req, res) => {
  if (isHTMX(req)) {
    res.render("partials/meetings");
  } else {
    res.render("index", { users }); // or another base template that includes the navbar + #main
  }
});
app.post("/schedule", (req, res) => {
  const { crush, environment, duration, datetime } = req.body;
  // const env = req.body.environment;
  // const duration = req.body.duration;
  // const crush = req.body.crush;
  const roomId = generateRoomId();
  const thisUser = "AfroBro";
  // const theDate = formatter.format(datetime).replace(",", "");

  try {
    // const { data, error } = await supabase
    //   .from("meetings")
    //   .insert([{ name, duration: parseInt(duration), datetime }]);

    // if (error) throw error;
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
    // if (isHTMX(req)) {
    //   res.send(`
    //   <div class="p-4 bg-green-100 text-green-800 rounded">
    //     Meeting between ${thisUser} & ${crush} in ${environment} background (Room ${roomId}), scheduled for ${duration} minutes on ${datetime} ✅
    //   </div>
    // `);
    // } else {
    //   res.render("index", { users }); // or another base template that includes the navbar + #main
    // }

    res.render("result", {
      crush,
      environment,
      duration,
      datetime,
      roomId,
      thisUser,
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
