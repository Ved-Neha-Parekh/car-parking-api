const express = require("express");
const connectDB = require("./db.js");
const Parking = require("./models/Parking.js");

const app = express();
const PORT = 3000;
const MAX_SLOTS = 10;

app.use(express.json());

app.get("/", (req, res) => {
  return res.end("Hello");
});

// =========================================================================
// 🚀 NEW WAY: MONGODB DATABASE ROUTES
// =========================================================================

/**
 * @route POST /park
 * @description Parks a new car and assigns an available slot.
 */
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

    const totlalParkedCars = await Parking.countDocuments();
    if (totlalParkedCars >= MAX_SLOTS) {
      return res.status(400).json({ msg: "Sorry parking is full..." });
    }

    const allParkedCars = await Parking.find();
    const occuipiedSlots = allParkedCars.map(car => car.slotNum);

    let allocatedSlot = null;

    for (let i = 1; i <= MAX_SLOTS; i++) {
      if (!occuipiedSlots.includes(i)) {
        allocatedSlot = i;
        break;
      }
    }

    let newCar = await Parking.create({
      carNum,
      slotNum: allocatedSlot,
    });

    return res.status(201).json({ msg: `Parking slot alloted to ${carNum} successfully.`, newCar });

  } catch (err) {
    console.error("Error while alloting slot...🔴", err.message);
    return res.status(500).json({ msg: `Error: ${err.message}` });
  }
})

/**
 * @route POST /unPark
 * @description Un-Parks a decicated car and deallocate the slot.
 */
app.post("/unPark", async (req, res) => {
  try {
    let carNum = req.body.carNum;
    const car = await Parking.findOneAndDelete({ carNum });

    if (!car) {
      return res.status(404).json({ msg: "Car not found or invalid car-num...🔴" });
    };

    const pricePerMin = 10;
    const entryTime = car.entryTime;
    const exitTime = Date.now();

    const timeDiff = Math.abs(entryTime - exitTime);

    const totalDuration = Math.round((timeDiff / 60000)); // Covert into minutes;

    const totalBill = (totalDuration * pricePerMin);

    return res.status(200).json({ msg: `Car with ${carNum} is un-parked`, car, entryTime, exitTime, totalDuration, totalBill });
  } catch (error) {
    return res.status(500).json({ msg: `Error during un-park: ${error.message}` });
  }
})

/**
 * @route GET /cars
 * @description Retrieve all cars which are allotted.
 */
app.get("/cars", async (req, res) => {
  try {
    let allCars = await Parking.find();

    if (!allCars) {
      return res.status(404).json({ msg: "Cars not found" });
    }

    return res.status(200).json({ msg: "Cars found successfully...", totalParkedCars: allCars.length, cars: allCars })
  } catch (error) {
    return res.status(500).json({ msg: `Error during get cars: ${error.message}` });
  }
})

// =========================================================================
// 🛑 OLD WAY: STATIC MEMORY (ARRAY) ROUTES - Kept for Reference!
// =========================================================================

/*
let parkingSlot = [];
const MAX_SLOTS = 10;

app.post("/park", (req, res) => {
  let carNum = req.body.carNum;

  if (!carNum) {
    return res.status(400).json({ msg: "Car Number is required..." });
  }

  const isAlreadyParked = parkingSlot.some((car) => car.carNum === carNum);

  if (isAlreadyParked === true) {
    return res
      .status(409)
      .json({ msg: `Car with car-number ${carNum} is already parked.` });
  }


  if (parkingSlot.length == MAX_SLOTS) {
    return res.json({ msg: "Sorry Parking is full...🙏" });
  }

  let availableSlot = 1;

  while
    (parkingSlot.some((car) => car.slotNum === availableSlot)) {
    availableSlot++;
  }

  let newCar = {
    slotNum: availableSlot,
    carNum: carNum,
    entryTime: Date.now(),
  };

  parkingSlot.push(newCar);

  return res.status(200).json({ msg: "Parking Alloted Successfully..." });
});

app.get("/cars", (req, res) => {
  parkingSlot.forEach((car) => {
    console.log(
      `Car with ${car.carNum} is parked at slot number ${car.slotNum}`,
    );
  });

  return res.json(parkingSlot);
});

app.delete("/unPark", (req, res) => {
  let carNum = req.body.carNum;

  const carIdx = parkingSlot.findIndex((car) => car.carNum === carNum)

  if (carIdx === -1) {
    return res.status(404).json({ msg: "Car not found..." });
  }

  const car = parkingSlot[carIdx];
  const pricePerMin = 10;
  const entryTime = car.entryTime;
  const exitTime = Date.now();

  const timeDiff = Math.abs(entryTime - exitTime);
  const totalDuration = Math.round(timeDiff / 60000);

  const totalPrice = pricePerMin * totalDuration;

  parkingSlot.splice(carIdx, 1);

  return res
    .status(200)
    .json({
      msg: `Car with car-num ${carNum} is un-parked`,
      entryTime,
      exitTime,
      totalDuration,
      totalPrice,
    });
});
*/

// =========================================================================
// SERVER START
// =========================================================================

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT} and click 👉 http://localhost:${PORT}`);
    })
  })
  .catch((error) => {
    console.log(error);
  })

