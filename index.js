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

// Multer storage configuration
const multerstorage = multer.diskStorage({
  destination: function(req, file, callback){
      callback(null, path.join(__dirname, 'uploads'));
  },
  filename : function(req, file, callback){
      callback(null, Date.now() + "_" + file.originalname);
  }
});
const multerSingleUpload = multer({storage: multerstorage});

// Route to handle file upload
app.post("/photo-upload", multerSingleUpload.single('photo-upload'), function(req, res) {
  const file = req.file;
  if (!file) {
      return res.send("Please choose a file to upload!");
  }
  console.log("File uploaded successfully:", file);
  // res.redirect('/employee-add'); // Redirect to form page after upload
  res.json("EMPLOYEE CREATED SUCESSFULLY");
});

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

app.get("/employee-add", (req, res) => {
  res.render("employee-add"); 
});

app.get("/admin-dashboard", (req, res) => {
  res.render("admin-dashboard");
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
app.get("/employee-dashboard/settings", (req, res) => {
  res.render("employee-dashboard/settings");
});
app.get("/employee-dashboard/support", (req, res) => {
  res.render("employee-dashboard/support");
});

app.get("/admin-dashboard/admin-attendance", (req, res) => {
  res.render("admin-dashboard/admin-attendance");
});
app.get("/admin-dashboard/employee-add", (req, res) => {
  res.render("admin-dashboard/employee-add");
});
app.get("/admin-dashboard/IDCard", (req, res) => {
  res.render("admin-dashboard/IDCard");
});
app.get("/admin-dashboard/report", (req, res) => {
  res.render("admin-dashboard/report");
});
app.get("/admin-dashboard/task", (req, res) => {
  res.render("admin-dashboard/task");
});
// Start server
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
