const getValue = a => (typeof a === "object" && a !== null ? a._id : a);

export default (owner1, owner2) => getValue(owner1) === getValue(owner2);
