import React, { useState } from 'react'
import TagInput from '../../components/Input/TagInput'
import { MdClose } from 'react-icons/md'
import axiosIntance from '../../utils/axiosInstance'

const AddEditNotes = ({ showToastMsg,noteData,getAllNotes,type,onClose }) => {
    const [title, setTitle] = useState(noteData?.title||"");
    const [content, setContent] = useState(noteData?.content||"");
    const [tags, setTags] = useState(noteData?.tags||[]);
    const [error, setError] = useState(null);
    // addnote
    const addNewNote = async() => {
    try {
      const response = await axiosIntance.post("/add-note", {
        title,
        content,
        tags,
      })
      if (response.data && response.data.note) {
        showToastMsg("Note Added Successfully.")
        getAllNotes()
        onClose()
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
      setError(error.response.data.message)
      }
    }
    }
    // editNote
  const editNote = async () => {
    const noteId = noteData._id;
     try {
      const response = await axiosIntance.put("/edit-note/"+noteId, {
        title,
        content,
        tags,
      })
       if (response.data && response.data.note) {
         showToastMsg("Note Updated Successfully.")
        getAllNotes()
        onClose()
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
      setError(error.response.data.message)
      }
    }
    }
    const handleAddNote = () => {
        if (!title) {
            setError("Please Enter title.");
            return;
        }
        if (!content) {
            setError("Please enter content.");
            return;
        }
        setError("")
        if (type === "edit") {
        editNote()
        } else {
        addNewNote()
        }
    }
  return (
    <div className="relative"> 
      <button 
        className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-200' 
        onClick={onClose}
      >
        <MdClose className='text-xl text-slate-500'/>
      </button>
        
      <div className='flex flex-col gap-2'>
        <label className='text-sm font-medium text-slate-700'>TITLE</label>
        <input 
          type="text"
          className='text-2xl text-slate-900 outline-none'
          placeholder='Go To Gym At 5'
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
        />
      </div>

      <div className='flex flex-col gap-2 mt-4'>
        <label className="text-sm font-medium text-slate-700">CONTENT</label>
        <textarea 
          className='text-sm outline-none text-slate-950 bg-slate-50 p-2 rounded' 
          placeholder='Content' 
          rows={10}  
          value={content}
          onChange={(e)=>setContent(e.target.value)}
        />
      </div>
          
      <div className='mt-3'>
        <label className="text-sm font-medium text-slate-700">TAGS</label>
        <TagInput tags={tags} setTags={setTags}/>
      </div>
          {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}
          
      <button 
        className='bg-blue-600 hover:bg-blue-700 text-white font-medium mt-5 px-4 py-2 rounded-md' 
        onClick={handleAddNote}
      >
       {type==="edit"?"UPDATE":"ADD"}
      </button>
    </div>
  )
}

export default AddEditNotes


