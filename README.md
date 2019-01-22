# clanwars-go

![Repository logo](https://github.com/oL-web/clanwars-go/blob/master/src/favicon.png?raw=true)

Take over the world, one Google Maps place marker at a time! ClanWars GO is a MERN stack game project using Google Maps and geolocation APIs to create an experience similiar to games such as Pokemon GO.

Please note that the game and the demo available [here](https://clanwars-go.herokuapp.com/) are not really meant to be used in a production environment in its current state as the game is using rather inefficient database solutions such as storing all the data, including http request rate limits and sessions in MongoDB instead of something like Redis. I don't have as much knowledge in this topic right now as opposed to regular front-end so it's something to work on in the future!

### Things that still need fixing:

- Find a way to implement items, shops and other building types into the game mechanics
- Experiment with redux-form, actions and states in login components are messed up right now
- Move Google's place discovery logic to the server
- Switch to socket.io - it should've been done right from the beginning
- Refactoring
- Adding tests... better late than never

---

### Installation and usage:

`npm install`  
`npm run dev` - development server and parcel  
`npm run dev-server` - development server  
`npm run dev-front` - development parcel  
`npm run build` - make production build  
`npm run server` - production server

---

### Is there something wrong?

Please tell me!
