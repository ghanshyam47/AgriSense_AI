import mongoose from 'mongoose';

const farmProfileSchema = new mongoose.Schema({
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmSize:       { type: Number, comment: 'in acres' },
  soilType:       { type: String, enum: ['sandy', 'loamy', 'clay', 'silt', 'red', 'black', 'alluvial', 'other'], default: 'loamy' },
  currentCrops:   [{ type: String }],
  waterSource:    { type: String, enum: ['well', 'canal', 'borewell', 'river', 'rain', 'tank', 'other'], default: 'well' },
  irrigationType: { type: String, enum: ['drip', 'sprinkler', 'flood', 'furrow', 'rain-fed', 'other'], default: 'flood' },
  cropStage:      { type: String },
}, { timestamps: true });

farmProfileSchema.index({ userId: 1 });

export default mongoose.model('FarmProfile', farmProfileSchema);
