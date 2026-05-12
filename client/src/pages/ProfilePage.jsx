import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';
import './ProfilePage.css'

const ProfilePage = () => {

  const {authUser, updateProfile} = useContext(AuthContext);

  const [selectedImg, setSelectedImg] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if(!selectedImg){
      await updateProfile({fullName: name, bio});
      setLoading(false);
      navigate('/');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async ()=>{
      const base64Image = reader.result;
      await updateProfile({profilePic: base64Image, fullName: name, bio});
      setLoading(false);
      navigate('/');
    }
  }

  return (
    <div className='profile-page'>
      <div className='profile-container'>
        <form onSubmit={handleSubmit} className='profile-form'>
          <h3 className='profile-title'>Profile details</h3>
          <label htmlFor="avatar" className='profile-upload'>
            <input onChange={(e)=>setSelectedImg(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden />
            <img src={selectedImg ? URL.createObjectURL(selectedImg) : (authUser?.profilePic || assets.avatar_icon)} alt="" />
            upload profile image
          </label>
          <input onChange={(e)=>setName(e.target.value)} value={name} type="text" required placeholder='Your Name' 
          className='profile-input'/>
          <textarea onChange={(e)=>setBio(e.target.value)} value={bio} placeholder='Write profile bio' required rows={4}
          className='profile-textarea' ></textarea>

          <button type='submit' className='profile-button' disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </form>
        <img className={`profile-avatar ${selectedImg ? 'selected' : ''}`} src={authUser?.profilePic || assets.logo_icon} alt="" />
      </div>

    </div>
  )
}

export default ProfilePage