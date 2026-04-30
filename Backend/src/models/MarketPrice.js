import mongoose from 'mongoose';

const marketPriceSchema = new mongoose.Schema({
  commodity: { type: String, required: true, lowercase: true },
  market:    { type: String },
  state:     { type: String },
  price:     { type: Number, required: true },
  unit:      { type: String, default: 'quintal' },
  msp:       { type: Number },
  date:      { type: Date, default: Date.now },
}, { timestamps: true });

marketPriceSchema.index({ commodity: 1, state: 1, date: -1 });

export default mongoose.model('MarketPrice', marketPriceSchema);
