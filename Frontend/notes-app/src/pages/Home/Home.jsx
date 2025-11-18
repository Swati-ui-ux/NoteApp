import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import addNotesImg from "../../assets/add-note.svg";
import { MdOutlineSearchOff } from 'react-icons/md';
import Modal from "react-modal";
import NoteCard from '../../components/Cards/NoteCard';
import { MdAdd } from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import { useNavigate } from 'react-router-dom';
import axiosIntance from '../../utils/axiosInstance';
import Toast from '../../components/ToastMessage/Toast';
import EmptyCard from '../../components/EmptyCard/EmptyCard';

// Set app element for accessibility
Modal.setAppElement('#root');

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null
  });
  
  const navigate = useNavigate();
  const [allNotes, setAllNotes] = useState([]);
  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "success"
  });
  const [userInfo, setUserInfo] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get user info
 const getUserInfo = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    
    const response = await axiosIntance.get("/get-user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (response.data && response.data.user) {
      console.log("User info:", response.data);
      setUserInfo(response.data.user);
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    if (error.response?.status === 401) {
      localStorage.clear();
      navigate("/login");
    } else {
      // Handle other errors
      console.error("Unexpected error:", error);
    }
  }
};

  // Get all notes
  const getAllNotes = async () => {
    try {
      setIsLoading(true);
      const response = await axiosIntance.get("/get-all-notes");
      
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      setShowToastMsg({
        isShown: true,
        message: "Failed to load notes. Please try again.",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  // Handle delete
  const deleteNote = async (data) => {
    const noteId = data._id;
    try {
      const response = await axiosIntance.delete("/delete-note/" + noteId);
      
      if (response.data && !response.data.error) {
        setShowToastMsg({
          isShown: true,
          message: "Note Deleted Successfully.",
          type: "delete"
        });
        getAllNotes(); // Refresh list
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      setShowToastMsg({
        isShown: true,
        message: "Failed to delete note. Please try again.",
        type: "error"
      });
    }
  };

  // Handle close toast
  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
      type: "success"
    });
  };

  // Search note
  const searchNote = async (query) => {
    try {
      if (!query.trim()) {
        setIsSearch(false);
        getAllNotes();
        return;
      }
      
      const response = await axiosIntance.get("/search-notes", {
        params: { query },
      });

      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.error("Search Error:", error);
      setShowToastMsg({
        isShown: true,
        message: "Search failed. Please try again.",
        type: "error"
      });
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  // Update isPinned
  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;
    try {
      const response = await axiosIntance.put("/update-note-pinned/" + noteId, {
        isPinned: !noteData.isPinned,
      });
      
      if (response.data && response.data.note) {
        setShowToastMsg({
          isShown: true,
          message: noteData.isPinned ? "Note Unpinned" : "Note Pinned Successfully",
          type: "success"
        });
        getAllNotes();
      }
    } catch (error) {
      console.error("Error pinning note:", error);
      setShowToastMsg({
        isShown: true,
        message: "Failed to update note. Please try again.",
        type: "error"
      });
    }
  };

  useEffect(() => {
    getUserInfo();
    getAllNotes();
  }, []);

  return (
    <>
      <Navbar 
        userInfo={userInfo} 
        onSearchNote={searchNote} 
        handleClearSearch={handleClearSearch} 
      />
      
      <div className='container mx-auto'>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 m-8'>
            {allNotes.length > 0 ? (
              allNotes.map((item) => (
                <NoteCard 
                  key={item._id}
                  title={item.title}
                  date={item.createOn}
                  content={item.content}
                  tags={item.tags}
                  isPinned={item.isPinned}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => deleteNote(item)}
                  onPinNote={() => updateIsPinned(item)}
                />
              ))
            ) : (
              <EmptyCard 
                addNoteImg={isSearch ? <MdOutlineSearchOff size={64} /> : addNotesImg}
                message={
                  isSearch 
                    ? "Oops! No notes found matching your search!" 
                    : "Start creating your first note! Click the Add button to add a note."
                }
              />
            )}
          </div>
        )}
      </div>
     
      <button 
        className='w-14 h-14 flex items-center justify-center rounded-2xl bg-blue-500 hover:bg-blue-600 absolute right-10 bottom-10 transition-colors shadow-lg' 
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }} 
        aria-label="Add new note"
      >
        <MdAdd className='text-[32px] text-white'/>
      </button>

      <Modal 
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
        style={{
          overlay: {
            background: "rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          },
          content: {
            position: 'relative',
            inset: 'auto',
            maxWidth: '90%',
            margin: '0 auto'
          }
        }}
        contentLabel="Add/Edit Note"
        className="w-full md:w-[40%] max-h-[75%] bg-white rounded-md p-5 overflow-y-auto outline-none"
      >
        <AddEditNotes 
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }} 
          getAllNotes={getAllNotes}
          showToastMsg={(message, type = "success") => setShowToastMsg({
            isShown: true,
            message,
            type
          })}
        />
      </Modal>
      
      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;
