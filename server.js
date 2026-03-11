const express = require("express");
const connectDB = require("./db.js");
const Parking = require("./models/Parking.js");

let parkingSlot = [];
const MAX_SLOTS = 10;

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  return res.end("Hello");
});

// app.post("/park", (req, res) => {
//   let carNum = req.body.carNum;

//   if (!carNum) {
//     return res.status(400).json({ msg: "Car Number is required..." });
//   }

//   const isAlreadyParked = parkingSlot.some((car) => car.carNum === carNum);

//   if (isAlreadyParked === true) {
//     return res
//       .status(409)
//       .json({ msg: `Car with car-number ${carNum} is already parked.` });
//   }


//   if (parkingSlot.length == MAX_SLOTS) {
//     return res.json({ msg: "Sorry Parking is full...🙏" });
//   }

//   let availableSlot = 1;

//   while
//     (parkingSlot.some((car) => car.slotNum === availableSlot)) {
//     availableSlot++;
//   }

//   let newCar = {
//     slotNum: availableSlot,
//     carNum: carNum,
//     entryTime: Date.now(),
//   };

//   parkingSlot.push(newCar);

//   return res.status(200).json({ msg: "Parking Alloted Successfully..." });
// });

// app.get("/cars", (req, res) => {
//   parkingSlot.forEach((car) => {
//     console.log(
//       `Car with ${car.carNum} is parked at slot number ${car.slotNum}`,
//     );
//   });

//   return res.json(parkingSlot);
// });

// app.delete("/unPark", (req, res) => {
//   let carNum = req.body.carNum;

//   const carIdx = parkingSlot.findIndex((car) => car.carNum === carNum)

//   if (carIdx === -1) {
//     return res.status(404).json({ msg: "Car not found..." });
//   }

//   const car = parkingSlot[carIdx];
//   const pricePerMin = 10;
//   const entryTime = car.entryTime;
//   const exitTime = Date.now();

//   const timeDiff = Math.abs(entryTime - exitTime);
//   const totalDuration = Math.round(timeDiff / 60000);

//   const totalPrice = pricePerMin * totalDuration;

//   parkingSlot.splice(carIdx, 1);

//   return res
//     .status(200)
//     .json({
//       msg: `Car with car-num ${carNum} is un-parked`,
//       entryTime,
//       exitTime,
//       totalDuration,
//       totalPrice,
//     });
// });

app.post("/park", async (req, res) => {
  try {
    let carNum = req.body.carNum;

    if (!carNum) {
      return res.status(400).json({ msg: "Car number is required..." });
    }

    const isAlreadyParked = await Parking.findOne({ carNum })

    if (isAlreadyParked) {
      return res.status(409).json({ msg: `Car with car-number ${carNum} is already parked.` })
    }

    let newCar = await Parking.create({
      carNum,
      slotNum: 1,
    });

    return res.status(201).json({ msg: `Parking slot alloted to ${carNum} successfully.`, newCar });

  } catch (err) {
    console.error("Error while alloting slot...🔴", err.message);
    return res.status(500).json({ msg: `Error: ${err.message}` });
  }
})

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT} and click 👉 http://localhost:${PORT}`);
    })
  })
  .catch((error) => {
    console.log(error);
  })

