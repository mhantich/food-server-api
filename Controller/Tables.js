const Reservation = require("../models/Reservation");
const Table = require("../models/Table");

exports.getAllTables = async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.checkTableAvailability = async (req, res) => {
  const { tableId, reservationDate, startTime, endTime } = req.query;
  console.log(req.query);

  try {
    // Check for overlapping reservations for the chosen table
    const overlappingReservations = await Reservation.find({
      reservationDate,
      tableId,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (overlappingReservations.length > 0) {
      // Table is unavailable, find alternatives
      const availableTimesForTable = await findAvailableTimeSlots(tableId, reservationDate);
      const alternativeTables = await findAvailableTables(reservationDate, startTime, endTime);

      res.status(400).json({
        message: "Table is unavailable",
        available:false,
        chosenTable: {
          tableId,
          unavailableTime: { startTime, endTime }
        },
        suggestions: {
          availableTimesForTable,
          alternativeTables
        }
      });
    } else {
      // Table is available
      res.json({ message: "Table is available" , available:true});
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
async function findAvailableTimeSlots(tableId, reservationDate) {
  const operatingHours = { start: "08:00", end: "22:00" }; // Define operating hours
  const reservations = await Reservation.find({ tableId, reservationDate }).sort("startTime");

  const availableSlots = [];
  let previousEndTime = operatingHours.start;

  for (const reservation of reservations) {
    if (previousEndTime < reservation.startTime) {
      // Add the gap as an available slot
      availableSlots.push({ startTime: previousEndTime, endTime: reservation.startTime });
    }
    previousEndTime = reservation.endTime; // Update previous end time
  }

  // Check for availability after the last reservation
  if (previousEndTime < operatingHours.end) {
    availableSlots.push({ startTime: previousEndTime, endTime: operatingHours.end });
  }

  return availableSlots;
}

async function findAvailableTables(reservationDate, startTime, endTime) {
  const allTables = await Table.find(); // Fetch all tables
  const overlappingReservations = await Reservation.find({
    reservationDate,
    $or: [
      { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
    ]
  });

  // Get IDs of tables with overlapping reservations
  const unavailableTableIds = overlappingReservations.map(res => res.tableId.toString());

  // Filter out unavailable tables
  const availableTables = allTables.filter(table => !unavailableTableIds.includes(table._id.toString()));

  return availableTables.map(table => ({
    tableId: table._id,
    capacity: table.capacity
  }));
}




