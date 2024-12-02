const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();
const PORT = 8000;
const bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
const bcrypt = require('bcrypt');

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());

// Set session
// app.use(session({
//   secret: 'acjsbjabdjkbc',
//   resave: false,
//   saveUninitialized: false,
//   cookie: { secure: true }
// }));
app.use(session({
  secret: 'acjsbjabdjkbc',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' } // Secure cookies only in production
}));

// Authenticate all routes
app.use(passport.authenticate('session'));

// MARK: - Database Content
const employeeModel = require('./models/employeeSchema');
const leaveRequestModel = require('./models/leaveRequestSchema');
const taskModel = require('./models/taskSchema');

const employeeController = require('./controllers/employeeController');
const leaveRequestController = require('./controllers/leaveRequestController');
const taskController = require('./controllers/taskController');

// const dBConnect = require('./middlewares/dB');
// dBConnect();
const createAdminUser = async () => {
  try {
      // Check if admin already exists
      const adminExists = await employeeModel.findOne({ email: 'admin@hrsuite.com' });
      if (adminExists) {
          console.log('Admin user already exists.');
          return;
      }

      // Create new admin user
      const admin = new employeeModel({
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@hrsuite.com',
          password: await bcrypt.hash('password@12', 10), // Hash the password
          designation: 'Admin',
          userId: 1, // Set a unique user ID for the admin
          address: 'Admin Address',
          age: 30,
          salary: 0,
          passportNumber: 'N/A',
          nominee: 'N/A'
      });
      await admin.save();
      console.log('Admin user created successfully.');
  } catch (error) {
      console.error('Error creating admin user:', error);
  }
};

// Call the function after connecting to the database
const dBConnect = require('./middlewares/dB');
dBConnect().then(() => {
  createAdminUser();
});

employeeModel();
leaveRequestModel();
taskModel();

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

// MARK: - Routes
app.get("/", (req, res) => {
  // res.send("Hello world");
  res.render("landing");
});
app.get('/dummy', (req, res)=>{
  res.render("dummy");
})

// MARK:- Admin Log In and Log Out

const ensureAdmin = (req, res, next) => {
  if (!req.session.adminId) {
    return res.redirect('/admin-login');
  }
  next();
};

// Apply middleware to all admin routes
app.use('/admin', ensureAdmin);

const checkAdminLoggedIn = (req, res, next) => {
  if (req.session.adminId) {
    return res.redirect('/admin/admin-dashboard'); // Redirect to the dashboard if logged in
  }
  next(); // Otherwise, allow access to the login page
};

app.get("/admin-login", checkAdminLoggedIn, (req, res) => {
  passport.authenticate('session'),
  res.render("admin-login");
});

app.post('/admin-login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find admin by email
    const admin = await employeeModel.findOne({ email: email, designation: 'Admin' });

    if (!admin) {
      return res.status(401).render('admin-login', { error: 'Invalid email or password' });
    }

    // Compare the password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).render('admin-login', { error: 'Invalid email or password' });
    }

    console.log("Admin Logged In");

    // Set session
    req.session.adminId = admin._id; // Save admin ID to the session
    res.redirect('/admin/admin-dashboard');
  } catch (err) {
    console.error('Error during admin login:', err);
    return res.status(500).render('admin-login', { error: 'Internal server error. Please try again.' });
  }
});

app.get('/admin/logout', (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).send("Error logging out. Please try again.");
    }
    console.log("Admin Logged Out");
    // Redirect to the admin login page
    res.redirect('/admin-login');
  });
});

// MARK:- Employee Log In and Log Out

const checkEmployeeLoggedIn = (req, res, next) => {
  if (!req.session.employeeId) {
    return res.redirect('/employee-login'); // Redirect to login if not signed in
  }
  next(); // Proceed to the next middleware or route handler
};

// Employee login page
app.get("/employee-login", (req, res) => {
  if (req.session.employeeId) {
    return res.redirect('/employee-dashboard'); // Redirect to dashboard if already logged in
  }
  res.render("employee-login"); // Render login page
});

// Employee login authentication
app.post('/employee-login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const employee = await employeeModel.findOne({ email: email });

    if (!employee) {
      return res.status(401).render('employee-login', { error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      return res.status(401).render('employee-login', { error: 'Invalid email or password' });
    }

    console.log("Employee Logged In");

    req.session.employeeId = employee.userId; // Save employee ID to the session
    res.redirect('/employee-dashboard');
  } catch (err) {
    console.error('Error during employee login:', err);
    res.status(500).render('employee-login', { error: 'Internal server error. Please try again.' });
  }
});

// Employee logout
app.get('/employee-logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).send('Error logging out. Please try again.');
    }
    console.log("Employee Logged Out");
    res.redirect('/employee-login'); // Redirect to login page after logout
  });
});

// MARK: - Admin APIs
app.get("/admin/admin-dashboard", async (req, res) => {
  try {
    const employeeCount = await employeeModel.countDocuments();
    const leaveCount = await leaveRequestModel.countDocuments();
    const acceptedLeaveCount = await leaveRequestModel.countDocuments({ status: 'Approved' });
    const tasksPendingCount = await taskModel.countDocuments({ status: false });
    const tasksCompletedCount = await taskModel.countDocuments({ status: true });

    res.render("admin-Dashboard", {
      employeeCount: employeeCount - 1,
      acceptedLeaveCount: acceptedLeaveCount,
      leaveCount: leaveCount - acceptedLeaveCount,
      tasksPendingCount: tasksPendingCount,
      tasksCompletedCount: tasksCompletedCount,
    });
  } catch (err) {
    console.error("Error fetching data: ", err);
    res.status(500).send("Error retrieving information. Please try again later.");
  }
});

app.get("/admin/admin-attendance", async (req, res) => {
  try {
    const leaveRequests = await leaveRequestModel.find({});
    const employees = await employeeModel.find({}, "userId firstName lastName");
    
    res.render("admin-dashboard/admin-attendance", {
      leaveRequests: leaveRequests,
      employees: employees
    });
  } catch(err) {
    console.error("Error fetching data: ", err);
    res.status(500).send("Error retrieving data. Please try again later.");
  }
});
app.post('/admin/update-leave-status', leaveRequestController.updateLeaveRequestStatus);

app.get("/admin/report", (req, res) => {
  res.render("admin-dashboard/report");
});
app.get("/admin/employee-add", (req, res) => {
  res.render("admin-dashboard/employee-add");
});
app.post('/employee-add', upload.single('photo-upload'), employeeController.addEmployee);
app.get("/admin/IDCard", async (req, res) => {
  try {
      const employeeRequests = await employeeModel.find({});
      res.render("admin-dashboard/IDCard", {
        employees: employeeRequests
      });
  } catch (err) {
      console.error("Error fetching employee data: ", err);
      res.status(500).send("Error retrieving employee information. Please try again later.");
  }
});
app.get("/admin/admin-task", async (req, res) => {
  try {
      const employeeRequests = await employeeModel.find({}, 'userId firstName lastName designation');
      const taskRequests = await taskModel.find({});
      res.render("admin-dashboard/admin-task", {
        employees: employeeRequests,
        tasks: taskRequests
      });
  } catch (err) {
      console.error("Error fetching task data:", err);
      res.status(500).send("Error retrieving task information. Please try again later.");
  }
});
app.get('/admin/tasks', async (req, res) => {
  try {
      const tasks = await taskModel.find({});
      res.json(tasks);
  } catch (err) {
      console.error("Error fetching tasks:", err);
      res.status(500).send("Internal Server Error");
  }
});
app.post('/admin/add-task', taskController.taskAssignment);
app.delete('/admin/delete-task', taskController.taskDelete);

// MARK: - Employee APIs
app.get("/employee-dashboard", checkEmployeeLoggedIn, async (req, res) => {
  try {
    const id = req.session.employeeId;
    const user = await employeeModel.findOne({ userId: id });
    const tasksPendingCount = (await taskModel.countDocuments({
      userId: id,
      status: false
    }));
    const tasksCompletedCount = (await taskModel.countDocuments({
      userId: id,
      status: true
    }));
    const leaveRequestsCount = await leaveRequestModel.countDocuments({
      userId: id,
      status: 'Pending'
    });
    
    res.render("employee-dashboard", {
      tasksPendingCount: tasksPendingCount,
      tasksCompletedCount: tasksCompletedCount,
      leaveRequestsCount,
      username: user.firstName + " " + user.lastName,
      userId: user.userId
    });
  } catch (err) {
    console.error("Error Retreiving Data: ", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/employee-dashboard/:id/:name", (req, res) => {
  res.send(`employee id: ${req.params.id} employee name: ${req.params.name}`);
});

app.get("/employee-dashboard/task", async (req, res) => {
  try {
    const id = req.session.employeeId;
    const user = await employeeModel.findOne({ userId: id });
    const taskRequests = await taskModel.find({ userId: id }).sort({ status: 1 });
    res.render("employee-dashboard/task", {
      tasks: taskRequests,
      username: user.firstName + " " + user.lastName,
      userId: user.userId
    });
  } catch (err) {
    console.error("Error fetching tasks: ", err);
    res.status(500).send("Internal Server Error");
  }
});
app.post('/admin/toggle-task-status', taskController.taskToggleStatus);

app.get("/employee-dashboard/attendance", async (req, res) => {
  try {
    const id = req.session.employeeId;
    const user = await employeeModel.findOne({ userId: id });
    res.render("employee-dashboard/attendance", {
      username: user.firstName + " " + user.lastName,
      userId: user.userId
    });
  } catch (err) {
    console.error("Error Retreiving Data: ", err);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/employee-dashboard/payroll", async (req, res) => {
  try {
    const id = req.session.employeeId;
    const user = await employeeModel.findOne({ userId: id });
    res.render("employee-dashboard/payroll", {
      username: user.firstName + " " + user.lastName,
      userId: user.userId
    });
  } catch (err) {
    console.error("Error Retreiving Data: ", err);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/employee-dashboard/performance", async (req, res) => {
  try {
    const id = req.session.employeeId;
    const user = await employeeModel.findOne({ userId: id });
    res.render("employee-dashboard/performance", {
      username: user.firstName + " " + user.lastName,
      userId: user.userId
    });
  } catch (err) {
    console.error("Error Retreiving Data: ", err);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/employee-dashboard/trainingSession", async (req, res) => {
  try {
    const id = req.session.employeeId;
    const user = await employeeModel.findOne({ userId: id });
    res.render("employee-dashboard/trainingSession", {
      username: user.firstName + " " + user.lastName,
      userId: user.userId
    });
  } catch (err) {
    console.error("Error Retreiving Data: ", err);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/employee-dashboard/leaveRequest", async (req, res) => {
  try {
      const id = req.session.employeeId;
      const user = await employeeModel.findOne({ userId: id });
      const leaveRequests = await leaveRequestModel.find({});
      res.render("employee-dashboard/leaveRequest", {
          leaves: leaveRequests,
          username: user.firstName + " " + user.lastName,
          userId: user.userId
      });
  } catch (err) {
      console.error("Error fetching leave requests: ", err);
      res.status(500).send("Internal Server Error");
  }
});
app.post('/leave-request', leaveRequestController.leaveRequest);
app.get("/employee-dashboard/settings", async (req, res) => {
  try {
    const id = req.session.employeeId;
    const user = await employeeModel.findOne({ userId: id });
    res.render("employee-dashboard/settings", {
      username: user.firstName + " " + user.lastName,
      userId: user.userId
    });
  } catch (err) {
    console.error("Error Retreiving Data: ", err);
    res.status(500).send("Internal Server Error");
  }
});

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, {
      id: user.id,
      username: user.username,
      picture: user.picture
    });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

// MARK: - Start server
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
