import express from 'express'

const app = express(); 

const PORT = process.env.PORT || 5047

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

app.get("/", (req, res) => {
    res.send("Hello world teri aisi taisi");
})