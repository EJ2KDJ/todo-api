const express = require('express');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

console.log("ENV CHECK →");
console.log("DB_USER:", process.env.DB_USER, "| type:", typeof process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASS, "| type:", typeof process.env.DB_PASS);
console.log("ADMIN_USER:", process.env.ADMIN_USER, "| type:", typeof process.env.ADMIN_USER);
console.log("ADMIN_PASS:", process.env.ADMIN_PASS, "| type:", typeof process.env.ADMIN_PASS);
console.log("JWT_SECRET:", process.env.JWT_SECRET, "| type:", typeof process.env.JWT_SECRET);
console.log("JWT_EXPIRES_IN:", process.env.JWT_EXPIRES_IN, "| type:", typeof process.env.JWT_EXPIRES_IN);
console.log("PORT:", process.env.PORT, "| type:", typeof process.env.PORT);

app.use(express.json());

const PORT = process.env.PORT || 3000;

//Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Todo API');
});


app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});