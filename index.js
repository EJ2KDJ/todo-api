const app = require('./server');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
  console.log(`API docs available at http://localhost:${PORT}/api-docs`);
});
