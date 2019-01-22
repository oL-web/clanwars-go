const User = require("../models/User");
const armies = require("../resources/armies");
const actionHandler = require("../helpers/actionHandler");

module.exports = {
  async createUser(req, res) {
    const { password, username } = req.body;
    const user = new User({ username });
    await User.register(user, password);
    return res.status(201).json({ msg: "User created!" });
  },
  async loginUser(req, res) {
    return res.status(200).json(req.user);
  },
  async logoutUser(req, res) {
    req.logout();
    res.redirect("/");
  },
  async handleItemActions(req, res) {},
  async handleArmyActions(req, res) {
    actionHandler(req, res, {
      BUY: async () => {
        const armyToBuy = armies[req.params.armyId];
        if (req.user.money - armyToBuy.price < 0) return res.status(400).json({ msg: "You don't have enough money to make this purchase!" });

        req.user.money -= armyToBuy.price;
        req.user.strength += armyToBuy.power;
        await req.user.save();

        const { money, strength } = req.user;
        return res.status(200).json({ money, strength });
      }
    });
  },
  async handleUserActions(req, res) {
    actionHandler(req, res, {
      UPDATE_STATS: async () => {
        const user = await User.findById(req.user.id).populate("markers");
        const moneyToEarn = user.markers.reduce((acc, val) => acc + val.lvl * val.investLvl, 0);
        user.money += moneyToEarn;
        await user.save();
        return res.status(200).json({ money: user.money });
      }
    });
  }
};
