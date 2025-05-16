import mongoose from "mongoose";

export const feedSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    savedBy: String, 
});

const Feed = mongoose.model('Feed', feedSchema);

export default Feed;
