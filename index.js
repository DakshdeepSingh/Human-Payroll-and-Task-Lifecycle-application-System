const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();
const PORT = 8000;
const bodyParser = require('body-parser');

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Serve static files
app.use(express.static('uploads'));
app.use(express.json());

// Database content
const employeeModel = require('./models/employeeSchema');
const leaveRequestModel = require('./models/leaveRequestSchema');

const employeeController = require('./controllers/employeeController');
const leaveRequestController = require('./controllers/leaveRequestController');

const dBConnect = require('./middlewares/dB');
dBConnect();

employeeModel();
const storage = multer.diskStorage({
  destination: function(req, file, callback) {
      callback(null, path.join(__dirname, 'uploads')); // Uploads folder
  },
  filename: function(req, file, callback) {
      const userId = req.body.userId; // Get the user ID from the form data
      callback(null, userId + path.extname(file.originalname)); // Correct use of `callback`
  }
});
const upload = multer({ storage: storage });

// Routes
app.get("/", (req, res) => {
  // res.send("Hello world");
  res.render("landing");
});
app.get('/dummy', (req, res)=>{
  res.render("dummy");
})

app.get("/admin-login", (req, res) => {
  res.render("admin-login");
});


app.get("/admin/admin-dashboard", (req, res) => {
  res.render("admin-Dashboard");
});

app.get("/admin/admin-attendance", (req, res) => {
  res.render("admin-dashboard/admin-attendance");
});
app.get("/admin/report", (req, res) => {
  res.render("admin-dashboard/report");
});
app.get("/admin/employee-add", (req, res) => {
  res.render("admin-dashboard/employee-add");
});
app.post('/employee-add', upload.single('photo-upload'), employeeController.addEmployee);
app.get("/admin/IDCard", (req, res) => {
  res.render("admin-dashboard/IDCard");
});

app.get("/admin/admin-task", (req, res) => {
  res.render("admin-dashboard/admin-task");
});


app.get("/employee-dashboard", (req, res) => {
  res.render("employee-dashboard");
});
app.get("/employee-login", (req, res) => {
  res.render("employee-login");
});

app.get("/employee-dashboard/:id/:name", (req, res) => {
  res.send(`employee id: ${req.params.id} employee name: ${req.params.name}`);
});

app.get("/employee-dashboard/task", (req, res) => {
  res.render("employee-dashboard/task");
});
app.get("/employee-dashboard/attendance", (req, res) => {
  res.render("employee-dashboard/attendance");
});
app.get("/employee-dashboard/payroll", (req, res) => {
  res.render("employee-dashboard/payroll");
});
app.get("/employee-dashboard/performance", (req, res) => {
  res.render("employee-dashboard/performance");
});
app.get("/employee-dashboard/trainingSession", (req, res) => {
  res.render("employee-dashboard/trainingSession");
});
app.get("/employee-dashboard/leaveRequest", (req, res) => {
  res.render("employee-dashboard/leaveRequest");
});
app.post('/leave-request', leaveRequestController.leaveRequest);
app.get("/employee-dashboard/settings", (req, res) => {
  res.render("employee-dashboard/settings");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
