const express = require('express');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

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