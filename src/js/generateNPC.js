import sample from "lodash/sample";
import randomColor from "random-color";

export default () => {
  const adjective = sample(["Angry", "Bewildered", "Clumsy", "Embarrassed", "Fierce", "Grumpy", "Helpless", "Itchy", "Jealous", "Lazy", "Mysterious", "Nervous", "Obnoxious", "Panicky", "Pitiful", "Repulsive", "Scary", "Thoughtless", "Uptight", "Worried"]);

  const name = sample(["Liam", "Noah", "William", "James", "Benjamin", "Oliver", "Jacob", "Lucas", "Michael", "Alexander", "Ethan", "Daniel", "Matthew", "Henry", "Joseph", "David", "Carter", "John", "Dylan", "Luke", "Gabriel", "Anthony", "Jack", "Christopher", "Joshua", "Andrew", "Miguel", "Steven", "Jesse"]);

  return {
    name: `${adjective} ${name}`,
    color: randomColor().rgbString()
  };
};
