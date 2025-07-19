const express = require("express");
const users = require("./data/fakes");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static("public"));
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
app.post("/meetings", async (req, res) => {
  const { name, duration, datetime } = req.body;

  try {
    const { data, error } = await supabase
      .from("meetings")
      .insert([{ name, duration: parseInt(duration), datetime }]);

    if (error) throw error;

    res.send(`
      <div class="p-4 bg-green-100 text-green-800 rounded">
        Meeting with ${name} scheduled for ${duration} minutes on ${new Date(
      datetime
    ).toLocaleString()} ✅
      </div>
    `);
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
