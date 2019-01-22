const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const NPCSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  color: String
});

const MapLocationSchema = new mongoose.Schema({
  placeId: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  photo: String,
  types: [String],
  owner: { type: ObjectId, ref: "user" },
  npc: NPCSchema,
  strength: {
    type: Number,
    required: true,
    default: 20
  },
  lvl: {
    type: Number,
    required: true,
    default: 1,
    max: 10,
    min: 1
  },
  investLvl: {
    type: Number,
    required: true,
    default: 1
  },
  enforceLvl: {
    type: Number,
    required: true,
    default: 1
  },
  coords: {
    type: [Number], // [lng,lat]
    required: true
  }
});

MapLocationSchema.index({ coords: "2d" });

module.exports = mongoose.model("mapLocation", MapLocationSchema);
