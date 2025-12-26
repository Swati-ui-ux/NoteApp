require("dotenv").config();
const config = require("./config.json");
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => console.log("❌ MongoDB error:", err.message));

const User = require("./models/user")
const Note = require("./models/note.model")

const express = require("express")
const cors = require("cors")
const app = express()
const jwt = require("jsonwebtoken");
const {authenticateToken} =require("./utilities")
const userRouter = require('./routes/userRouter')

app.use(express.json())
app.use(
    cors({ origin: "*", })
)


app.use(userRouter)




// get user 
app.get("/get-user", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    res.json({
      error: false,
      user,
      message: "User data retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});



// add notes
app.post("/add-note", authenticateToken, async (req, res) => {
  try {
  
  const { title, content, tags } = req.body
  const  user  = req.user
  
  if (!title) {
    return res.status(400).json({ error: true, message: "Title is require" });
  }
  if (!content) {
    return res.status(400).json({ error: true, message: "Content is required" });
  }
  
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId:user._id,
    })
    
    await note.save()
    return res.json({
      error: false,
      note,
      message:"Note added successfully"
    })
  } catch (error) {
    console.log("Message", error.message)
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",      
    })
  }
})
// Edit note

app.put("/edit-note/:noteId", authenticateToken, async (req,res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
    const user = req.user;
    if (!title && !content && !tags) {
      return res.status(400).json({ error: true, message: "No change provided" });
    }
    
  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id })
    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags
    if (isPinned) note.isPinned = isPinned;
    await note.save();
    return res.json({
      error: false,
      note,
      message: "Note updates successfully",
    });
  } catch (error) {
    console.log("Error Message",error.message)
    return res.status(500).json({
      error: true,
      message:"Internal Server Error"
    })
  }
})
// get all notes
app.get("/get-all-notes", authenticateToken, async (req, res) => {
  const user = req.user; // direct assign

  try {
    const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
    return res.json({
      error: false,
      notes,
      message: "All notes retrieved successfully."
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error."
    });
  }
});



// deleteNote
app.delete("/delete-note/:noteId", authenticateToken, async (req,res) => {
  const noteId = req.params.noteId
  const user = req.user
  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found." });
      
    }
    await Note.deleteOne({ _id: noteId, userId: user._id });
    return res.json({
      error: false,
      message: "Note deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message:"Internal Server Error",
    })
  }
})

// update isPinned
app.put("/update-note-pinned/:noteId", authenticateToken, async (req,res) => {
  try {
  const noteId = req.params.noteId;
  // console.log()
  const user = req.user;
  console.log(user)
    const {isPinned } = req.body;
    const note = await Note.findOne({ _id: noteId, userId: user._id })
    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }
    
   note.isPinned = isPinned;
    await note.save();
    return res.json({
      error: false,
      note,
      message: "Note updates successfully",
    });
  } catch (error) {
    console.log("Error Message",error.message)
    return res.status(500).json({
      error: true,
      message:"Internal Server Error"
    })
  }
})

// search note
app.get("/search-notes", authenticateToken, async(req,res)=>{
  const  user  = req.user
  console.log(user)
  const { query } = req.query
  console.log(query)
  if (!query) {
    return res.status(400).json({error:true,message:"Search query is required"})
  }
  try {
    const matchingNotes = await Note.find({
      userId: user._id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });

    return res.json({
      error: false,
      notes: matchingNotes,
      message: "Notes matching the search query retrieved successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message:"Internal Server Error"
    }) 
  }
})

// Add this to your server.js file
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  if (req.headers.authorization) {
    console.log("Authorization header present");
  } else {
    console.log("No authorization header");
  }
  next();
});

app.listen(8000, () => {
console.log("🚀 Server running on http://localhost:8000");
})

module.exports = app