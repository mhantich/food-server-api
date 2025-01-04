const Meal = require("../models/Meal");

const getMeals = async (req, res) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      isPopular,
      sortBy,
    } = req.query;

    // Build query object
    const query = {};
    console.log(req.query );

    // Category search (using ObjectId)
    if (category) {
      query.category = category;
    }

    // Name search (case-insensitive partial match)
    if (search) {
      query.name = { $regex: search};
    }

  

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Popular items
    if (isPopular) {
      query.isPopular = isPopular === 'true';
    }

    // Define sort logic
    let sortField = '-createdAt'; // Default sort by newest items
    if (sortBy) {
      const sortMapping = {
        pricelow: 'price',
        pricehigh: '-price',
        nameasc: 'name',
        namedesc: '-name',
        default: '-createdAt',
      };
      sortField = sortMapping[sortBy] || sortMapping.pricelow;
    }


    // Execute query with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    console.log(query)

    const meals = await Meal.find(query)
      .populate('category', 'name') // Populate category with its name
      .skip(skip)
      .limit(limit)
      .sort(sortField); // Apply the sort field here

    // Get total count for pagination
    const total = await Meal.countDocuments(query);

    res.status(200).json({
      meals,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error in getMeals:', error);
    res.status(500).json({
      message: 'Error fetching meals',
      error: error.message,
    });
  }
};

module.exports = {
  getMeals,
};
