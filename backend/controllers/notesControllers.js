const {Notes} = require('../models/notes');
const {Users} = require('../models/users');

// @route - GET /api/notes
const getAllNotes = async(req, res) =>{
    try{
        const user = await Users.findById(req.id).populate({
            path: 'notesList',
            options: {sort: { categoryColor: 1 }}
        });
        
        if(!user){
            return res.status(404).json({ message : "User not found" });
        }
        const data = user.notesList;
        res.status(200).json(data);
    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}

// @route - POST /api/notes
const addNotes = async(req, res) =>{
    try{
        const user = await Users.findById(req.id);
        if(!user){
            return res.status(404).json({ message : "User not found" });
        }

        const {title, note, categoryColor} = req.body;
        const newNote = await Notes.create({
            title,
            note,
            categoryColor
        });

        user.notesList.push(newNote._id);
        await user.save();

        res.status(200).json({ message : "Note created" });
    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}

// @route - PUT /api/notes
const updateNotes = async(req, res) =>{
    try{
        const {noteId, title, note, categoryColor} = req.body;
        const updatedNote = await Notes.findByIdAndUpdate(noteId, {title, note, categoryColor});

        if(!updatedNote){
            return res.status(404).json({ message : "Note not found" });
        }
        res.status(200).json({ message : "Note updated" });
    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}

// @route - DELETE /api/notes/:id
const removeNotes = async(req, res) =>{
    try{
        const id = req.params.id;
        const user = await Users.findById(req.id);
        if(!user){
            return res.status(404).json({ message : "User not found" });
        }

        const removedNote = await Notes.findByIdAndDelete(id);
        if(!removedNote){
            return res.status(404).json({ message : "Note not found" });
        }

        user.notesList = user.notesList.filter(noteId => noteId != id);
        await user.save();

        res.status(200).json({ message : "Note removed" });
    }
    catch(error){
        res.status(500).json({ message : "Something went wrong!" });
        console.log('Server error', error);
    }
}

module.exports = {
    addNotes,
    getAllNotes,
    removeNotes,
    updateNotes
};