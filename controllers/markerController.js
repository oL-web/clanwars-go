const MapLocation = require("../models/MapLocation");
const randRange = require("random-number-in-range");
const User = require("../models/User");
const getMarkerType = require("../helpers/getMarkerType");
const actionHandler = require("../helpers/actionHandler");

module.exports = {
  async getMarkers(req, res) {
    const { lat, lng } = req.query;
    const distance = 0.001;

    const markers = await MapLocation.find({}, "coords owner npc types placeId lvl").near("coords", {
      center: [lng, lat],
      maxDistance: distance
    });

    return res.status(200).json(markers);
  },
  async setMarkers(req, res) {
    await MapLocation.insertMany(req.body);
    return res.status(200).json(req.body);
  },
  async getMarkerByPlaceId(req, res) {
    const { placeId } = req.params;
    const marker = await MapLocation.findOne({ placeId }).populate("owner");
    if (!marker.owner) return res.status(200).json(marker);

    const { username, _id } = marker.owner;
    return res.status(200).json({
      ...marker._doc,
      owner: { username, _id }
    });
  },
  handleMarkerActions(req, res) {
    actionHandler(req, res, {
      INVEST: async () => {
        const { placeId } = req.params;
        const marker = await MapLocation.findOne({ placeId });
        const cost = marker.lvl * 5;

        if (!req.user._id.equals(marker.owner)) return res.status(400).json({ msg: "Marker doesn't belong to you!" });
        else if (req.user.money - cost >= 0) {
          marker.investLvl++;
          req.user.money -= cost;

          await Promise.all([req.user.save(), marker.save()]);

          return res.status(200).json({
            playerData: {
              money: req.user.money
            },
            marker: {
              placeId: marker.placeId,
              investLvl: marker.investLvl
            }
          });
        } else {
          return res.status(400).json({ msg: "You don't have enough money!" });
        }
      },
      ENFORCE: async () => {
        const { placeId } = req.params;
        const marker = await MapLocation.findOne({ placeId });
        const cost = marker.lvl * 5;

        if (!req.user._id.equals(marker.owner)) return res.status(400).json({ msg: "Marker doesn't belong to you!" });
        else if (req.user.money - cost >= 0) {
          marker.enforceLvl++;
          marker.strength += cost + randRange(0, 10);
          req.user.money -= cost;

          await Promise.all([req.user.save(), marker.save()]);

          return res.status(200).json({
            playerData: {
              money: req.user.money
            },
            marker: {
              enforceLvl: marker.enforceLvl,
              strength: marker.strength,
              placeId: marker.placeId
            }
          });
        } else {
          return res.status(400).json({ msg: "You don't have enough money!" });
        }
      },
      ATTACK: async () => {
        const { placeId } = req.params;
        const marker = await MapLocation.findOne({ placeId });
        const markerType = getMarkerType(marker).type;

        if (req.user._id.equals(marker.owner)) return res.status(400).json({ msg: "You can't attack markers that you own!" });
        else if (markerType !== "POI") return res.status(400).json({ msg: "You can't attack this type of marker!" });

        if (req.user.strength - marker.strength >= 0) {
          if (marker.owner) {
            const owner = await User.findById(marker.owner);
            owner.markers.remove(marker.owner);
            await owner.save();
          }

          req.user.strength -= marker.strength;
          req.user.markers.addToSet(marker.id);
          marker.strength = 0;
          marker.owner = req.user.id;
          marker.npc = undefined;
        } else {
          req.user.strength = 0;
          marker.strength = req.user.strength - marker.strength;
        }

        await Promise.all([req.user.save(), marker.save()]);

        return res.status(200).json({
          playerData: {
            strength: req.user.strength
          },
          marker: {
            owner: req.user._id.equals(marker.owner) ? req.user : marker.owner,
            strength: marker.strength,
            placeId: marker.placeId,
            npc: marker.npc || null
          }
        });
      },
      ENEMY_MOVE: async () => {
        const { attackingMarkerId, attackedMarkerId } = req.body;
        const [attackingMarker, attackedMarker] = await Promise.all([MapLocation.findById(attackingMarkerId), MapLocation.findById(attackedMarkerId)]);
        if (!attackingMarker || !attackedMarker) return res.status(400).json({ msg: "Cannot find at least one of the markers!" });

        const markerType = getMarkerType(attackedMarker).type;

        if (markerType !== "POI" || attackedMarker.npc || (attackedMarker.owner && !req.user._id.equals(attackedMarker.owner))) {
          return res.status(400).json({ msg: "NPCs can only attack free or your locations!" });
        }

        if (attackingMarker.lvl >= attackedMarker.lvl) {
          if (attackedMarker.owner) {
            req.user.markers.remove(attackedMarker.owner);
            attackedMarker.owner = undefined;
            await req.user.save();
          }

          attackedMarker.npc = attackingMarker.npc;

          await Promise.all([attackedMarker.save(), attackingMarker.save()]);
        } else {
          attackingMarker.strength = Math.round(attackingMarker.strength * 1.5);
          await attackingMarker.save();
        }

        return res.status(200).json({
          attackingMarker: {
            strength: attackingMarker.strength,
            placeId: attackingMarker.placeId
          },
          attackedMarker: {
            placeId: attackedMarker.placeId,
            npc: attackedMarker.npc || null,
            owner: attackedMarker.owner || null
          }
        });
      }
    });
  }
};

/*   await MapLocation.create({
      coords: [lng, lat]
    });
*/
