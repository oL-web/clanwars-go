const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const { ObjectId } = mongoose.Schema.Types;

const itemsSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  itemId: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    default: 0
  },
  effects: new mongoose.Schema({
    hungerReduction: Number,
    thirstReduction: Number
  })
});

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },
    money: {
      type: Number,
      required: true,
      default: 100
    },
    strength: {
      type: Number,
      required: true,
      default: 100
    },
    items: [itemsSchema],
    markers: [{ type: ObjectId, ref: "mapLocation" }]
  },
  { timestamps: true }
);

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", userSchema);
