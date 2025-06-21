import mongoose from 'mongoose';
const ArchetypeSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date:{
    type:String,
  }

});
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    picture:{
        type: String,
        
    },
    favCharacters: {
        type: [String],
        default: [],
    },
    media_sources:{
        type: [String],
        default: [],
    },
    genres:{
        type: [String],
        default: [],
    },
    archetypes:{
        type:[ArchetypeSchema], 
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('User', userSchema);
export default User;
