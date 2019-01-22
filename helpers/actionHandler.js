const actionHandler = (req, res, actions) => {
  const { action } = req.body;
  const matchedAction = actions[action];

  return matchedAction ? matchedAction() : res.status(400).json({ msg: "Specified action type is not supported!" });
};

module.exports = actionHandler;
