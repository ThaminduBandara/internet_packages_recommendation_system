const Package = require('../models/packageModel');


const createPackage = async (req, res) => {

  if (req.user.role !== 'admin' && req.user.role !== 'provider') {
    return res.status(403).json({ message: "Access denied, provider only" });
  }

  const { name, validationTime, price, anytimeData, nightTimeData, callMinutes, sms, serviceProvider, socialMedia } = req.body;

  if (!name || !validationTime || !price || !anytimeData || !nightTimeData || !callMinutes || !sms || !serviceProvider) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newPackage = new Package({
      name,
      validationTime,
      price,
      anytimeData,
      nightTimeData,
      callMinutes,
      sms,
      serviceProvider,
      socialMedia: socialMedia || false,
    });

    await newPackage.save();
    res.status(201).json({ message: "Package created successfully!", package: newPackage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find(); 
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getPackagesByServiceProvider = async (req, res) => {
  const { serviceProvider } = req.params; 

  try {
    const packages = await Package.find({ serviceProvider });  
    if (!packages || packages.length === 0) {
      return res.status(404).json({ message: "No packages found for this provider." });
    }
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updatePackage = async (req, res) => {
  const { packageId } = req.params;
  const { name, validationTime, price, anytimeData, nightTimeData, callMinutes, sms, socialMedia } = req.body;

  try {
    const updatedPackage = await Package.findByIdAndUpdate(
      packageId,
      { name, validationTime, price, anytimeData, nightTimeData, callMinutes, sms, socialMedia },
      { new: true }  
    );

    if (!updatedPackage) {
      return res.status(404).json({ message: "Package not found." });
    }

    res.status(200).json({ message: "Package updated successfully!", package: updatedPackage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deletePackage = async (req, res) => {
  const { packageId } = req.params;

  try {
    const deletedPackage = await Package.findByIdAndDelete(packageId);

    if (!deletedPackage) {
      return res.status(404).json({ message: "Package not found." });
    }

    res.status(200).json({ message: "Package deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPackage,
  getAllPackages,
  getPackagesByServiceProvider,
  updatePackage,
  deletePackage
};




// const Package = require('../models/packageModel');

// // Create a new package
// const createPackage = async (req, res) => {
//   const { name, validationTime, price, anytimeData, nightTimeData, callMinutes, sms, serviceProvider } = req.body;

//   if (!name || !validationTime || !price || !anytimeData || !nightTimeData || !callMinutes || !sms || !serviceProvider) {
//     return res.status(400).json({ message: "All fields are required." });
//   }

//   try {
//     const newPackage = new Package({
//       name,
//       validationTime,
//       price,
//       anytimeData,
//       nightTimeData,
//       callMinutes,
//       sms,
//       serviceProvider,
//     });

//     await newPackage.save();
//     res.status(201).json({ message: "Package created successfully!", package: newPackage });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get all packages (this can be filtered or paginated if needed)
// const getAllPackages = async (req, res) => {
//   try {
//     const packages = await Package.find();  // Get all packages
//     res.status(200).json(packages);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get packages by service provider
// const getPackagesByServiceProvider = async (req, res) => {
//   const { serviceProvider } = req.params;  // Get the service provider from the URL

//   try {
//     const packages = await Package.find({ serviceProvider });  // Filter packages by service provider
//     if (!packages || packages.length === 0) {
//       return res.status(404).json({ message: "No packages found for this provider." });
//     }
//     res.status(200).json(packages);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Update a package
// const updatePackage = async (req, res) => {
//   const { packageId } = req.params;
//   const { name, validationTime, price, anytimeData, nightTimeData, callMinutes, sms, serviceProvider } = req.body;

//   try {
//     const updatedPackage = await Package.findByIdAndUpdate(
//       packageId,
//       { name, validationTime, price, anytimeData, nightTimeData, callMinutes, sms, serviceProvider },
//       { new: true }  // Return the updated document
//     );

//     if (!updatedPackage) {
//       return res.status(404).json({ message: "Package not found." });
//     }

//     res.status(200).json({ message: "Package updated successfully!", package: updatedPackage });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Delete a package
// const deletePackage = async (req, res) => {
//   const { packageId } = req.params;

//   try {
//     const deletedPackage = await Package.findByIdAndDelete(packageId);

//     if (!deletedPackage) {
//       return res.status(404).json({ message: "Package not found." });
//     }

//     res.status(200).json({ message: "Package deleted successfully!" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = {
//   createPackage,
//   getAllPackages,
//   getPackagesByServiceProvider,
//   updatePackage,
//   deletePackage,
// };
