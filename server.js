const express = require("express");

let parkingSlot = [];
const MAX_SLOTS = 10;

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  return res.end("Hello");
});

app.post("/park", (req, res) => {
  let carNum = req.body.carNum;

  const isAlreadyParked = parkingSlot.some((car) => car.carNum === carNum);

  if (isAlreadyParked === true) {
    return res
      .status(409)
      .json({ msg: `Car with car-number ${carNum} is already parked.` });
  }

  if (parkingSlot.length == MAX_SLOTS) {
    return res.json({ msg: "Sorry Parking is full...🙏" });
  }

  let newCar = {
    slotNum: parkingSlot.length + 1,
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

app.listen(PORT, () => {
  console.log(
    `Server is running on port: ${PORT} and click 👉 http://localhost:${PORT}`,
  );
});
