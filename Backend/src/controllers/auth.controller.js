import User from '../models/User.js';
import FarmProfile from '../models/FarmProfile.js';

export const getProfile = async (req, res, next) => {
  try {
    const farms = await FarmProfile.find({ userId: req.user._id });
    res.json({ success: true, user: req.user, farms });
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

export const createFarm = async (req, res, next) => {
  try {
    const { name, farmSize, soilType, currentCrops, waterSource, irrigationType, cropStage } = req.body;
    const farm = await FarmProfile.create({
      userId: req.user._id,
      name: name || 'New Farm',
      farmSize, soilType, currentCrops, waterSource, irrigationType, cropStage
    });
    res.json({ success: true, farm });
  } catch (err) { next(err); }
};

export const updateFarmProfile = async (req, res, next) => {
  try {
    const { farmId, name, farmSize, soilType, currentCrops, waterSource, irrigationType, cropStage } = req.body;
    const farm = await FarmProfile.findOneAndUpdate(
      { _id: farmId, userId: req.user._id },
      { name, farmSize, soilType, currentCrops, waterSource, irrigationType, cropStage },
      { new: true }
    );
    res.json({ success: true, farm });
  } catch (err) { next(err); }
};

export const deleteFarm = async (req, res, next) => {
  try {
    const { farmId } = req.params;
    await FarmProfile.findOneAndDelete({ _id: farmId, userId: req.user._id });
    res.json({ success: true, message: 'Farm deleted successfully' });
  } catch (err) { next(err); }
};
