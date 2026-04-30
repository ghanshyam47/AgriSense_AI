import User from '../models/User.js';
import FarmProfile from '../models/FarmProfile.js';

export const getProfile = async (req, res, next) => {
  try {
    const farm = await FarmProfile.findOne({ userId: req.user._id });
    res.json({ success: true, user: req.user, farm });
  } catch (err) { next(err); }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, language, location } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (language) updates.language = language;
    if (location) updates.location = location;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({ success: true, user });
  } catch (err) { next(err); }
};

export const updateFarmProfile = async (req, res, next) => {
  try {
    const { farmSize, soilType, currentCrops, waterSource, irrigationType, cropStage } = req.body;
    const farm = await FarmProfile.findOneAndUpdate(
      { userId: req.user._id },
      { farmSize, soilType, currentCrops, waterSource, irrigationType, cropStage },
      { new: true, upsert: true }
    );
    res.json({ success: true, farm });
  } catch (err) { next(err); }
};
