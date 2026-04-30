import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  clerkId:  { type: String, unique: true, sparse: true },
  name:     { type: String, required: true, trim: true },
  phone:    { type: String, unique: true, sparse: true, trim: true },
  email:    { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  language: { type: String, default: 'en', enum: ['en', 'hi', 'ta', 'te', 'kn', 'mr', 'bn', 'gu', 'pa'] },
  location: {
    lat:      { type: Number },
    lng:      { type: Number },
    district: { type: String },
    state:    { type: String },
  },
}, { timestamps: true });

// Remove clerkId from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.clerkId;
  return obj;
};

export default mongoose.model('User', userSchema);
