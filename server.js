const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Fixed base URL and headers for the API
const BASE_URL = "https://gordiehowesportscomplex.perfectmind.com/api/2.0/B2C/";
const DEFAULT_HEADERS = {
  "X-Access-Key": "VF7qyggCjBShOBrTP4O7nkzyXHVbeY37",
  "X-Client-Number": "39548",
};

// Middleware
app.use(cors());
app.use(express.json());

// Dynamic API call endpoint
// app.post("/api/call", async (req, res) => {
//   try {
//     const { path = "Query", method = "POST" } = req.body;

//     const url = BASE_URL + path;
//     const requestHeaders = { ...DEFAULT_HEADERS };

//     const QueryString = `
//     SELECT TOP 10 E.Subject AS Subject, E.StartTime AS StartTime, E.EndTime AS EndTime, E.TakeDownInstruction AS TakeDownInstruction, E.SetupInstruction AS SetupInstruction,E.MaximumCapacity AS MaximumCapacity,  FC.Name as FaName, Con.PrimaryNumber AS PrimaryNumber, Ad.Street, Ad.city, Ad.PostalCode, Coun.Name AS Country, Stp.Name AS StateProv FROM Custom.CalendarEvent AS E LEFT JOIN Custom.Facility AS F ON E.FacilityId = F.ID LEFT JOIN Custom.FacilityContract AS FC ON E.FacilityContract = FC.ID LEFT JOIN Custom.Contact AS Con ON Con.ID = FC.Contact LEFT JOIN Custom.Location AS Lo ON Lo.ID = E.LocationId LEFT JOIN Custom.Address AS Ad ON Lo.Address = Ad.ID LEFT JOIN Custom.Country AS Coun ON Ad.CountryID = Coun.ID LEFT JOIN Custom.StateProv AS Stp ON Ad.StateProvID = Stp.ID WHERE E.StartTime = '2026-01-22T00:00:00' ORDER BY E.StartTime DESC

//     `

//     const config = {
//       method: method.toUpperCase(),
//       url,
//       headers: requestHeaders,
//       data: {
//         QueryString,
//       },
//     };

//     console.log(config);
//     const response = await axios(config);

//     res.json({
//       status: response.status,
//       statusText: response.statusText,
//     //   headers: response.headers,
//       data: response.data,
//     });
//   } catch (error) {
//     console.error("API call error:", error.message);
//     res.status(error.response?.status || 500).json({
//       error: error.message,
//       details: error.response?.data,
//     });
//   }
// });

// app.post("/api/call", async (req, res) => {
//   try {
//     const {
//       path = "Query",
//       method = "POST",
//       page = 1,
//       pageSize = 10,
//       startDate, // Expected format: 'YYYY-MM-DD'
//       endDate, // Expected format: 'YYYY-MM-DD'
//       locationId, // Expected as a number/string ID
//     } = req.body;

//     const url = BASE_URL + path;
//     const requestHeaders = { ...DEFAULT_HEADERS };
//     const validatedPage = Math.max(1, parseInt(page));
//     const offset = (validatedPage - 1) * pageSize;

//     // Start building the WHERE clause dynamically
//     let filterConditions = "WHERE 1=1";

//     if (startDate) {
//       filterConditions += ` AND E.StartTime >= '${startDate}T00:00:00'`;
//     }
//     if (endDate) {
//       filterConditions += ` AND E.StartTime <= '${endDate}T23:59:59'`;
//     }
//     if (locationId) {
//       filterConditions += ` AND E.LocationId = '${locationId}'`;
//     }

//     const QueryString = `
//       SELECT
//        E.ID, -- CRITICAL: Use this for your React keyExtractor
//         E.Subject,
//         E.StartTime,
//         E.EndTime,
//         E.TakeDownInstruction,
//         E.SetupInstruction,
//         E.MaximumCapacity,
//         E.ShowTo,
//         FC.Name as FaName,
//         Con.PrimaryNumber,
//         Ad.Street,
//         Ad.city,
//         Ad.PostalCode,
//         Coun.Name AS Country,
//         pro.Name AS Program,
//         CS.Name AS CalendarSetup,
//         CS.Category AS CalendarSetupCategory,
//         Stp.Name AS StateProv
//       FROM Custom.CalendarEvent AS E
//       LEFT JOIN Custom.Facility AS F ON E.FacilityId = F.ID
//       LEFT JOIN Custom.FacilityContract AS FC ON E.FacilityContract = FC.ID
//       LEFT JOIN Custom.Contact AS Con ON Con.ID = FC.Contact
//       LEFT JOIN Custom.Location AS Lo ON Lo.ID = E.LocationId
//       LEFT JOIN Custom.Address AS Ad ON Lo.Address = Ad.ID
//       LEFT JOIN Custom.Country AS Coun ON Ad.CountryID = Coun.ID
//       LEFT JOIN Custom.StateProv AS Stp ON Ad.StateProvID = Stp.ID
//       LEFT JOIN Custom.Program AS Pro ON E.ProgramId = Pro.ID
//       LEFT JOIN Custom.CalendarSetup AS CS ON E.CalendarSetupId = CS.ID
//       ${filterConditions}
//       ORDER BY E.StartTime DESC
//       OFFSET ${offset} ROWS
//       FETCH NEXT ${pageSize} ROWS ONLY
//     `;

//     console.log("QueryString:", QueryString);

//     const config = {
//       method: method.toUpperCase(),
//       url,
//       headers: requestHeaders,
//       data: { QueryString },
//     };

//     const response = await axios(config);

//     res.json({
//       status: response.status,
//       page: parseInt(page),
//       data: response.data,
//     });
//   } catch (error) {
//     console.error("API call error:", error.message);
//     res.status(500).json({ error: error.message });
//   }
// });

app.post("/api/call", async (req, res) => {
  try {
    const {
      path = "Query",
      method = "POST",
      page = 1,
      pageSize = 10,
      startDate,
      endDate,
      locationId,
    } = req.body;

    const url = BASE_URL + path;
    const requestHeaders = { ...DEFAULT_HEADERS };

    const validatedPage = Math.max(1, parseInt(page));
    // const validatedPage = parseInt(page);
    const validatedPageSize = parseInt(pageSize);
    const offset = (validatedPage - 1) * validatedPageSize;

    let filterConditions = "WHERE 1=1";
    if (startDate)
      filterConditions += ` AND E.StartTime >= '${startDate}T00:00:00'`;
    if (endDate)
      filterConditions += ` AND E.StartTime <= '${endDate}T23:59:59'`;
    if (locationId) filterConditions += ` AND E.LocationId = '${locationId}'`;

    // Added COUNT(*) OVER() to get total records matching filters across all pages
    // const QueryString = `
    //   SELECT 
    //     COUNT(*) OVER() AS TotalCount,
    //     E.ID, 
    //     E.Subject, 
    //     E.StartTime, 
    //     E.EndTime, 
    //     E.TakeDownInstruction, 
    //     E.SetupInstruction,
    //     E.MaximumCapacity, 
    //     E.ShowTo, 
    //     FC.Name as FCName, 
    //     F.RecordName as FRecordName, 
    //     FLo.Name as FName, 
    //     Con.PrimaryNumber, 
    //     Ad.Street, 
    //     Ad.city, 
    //     Ad.PostalCode, 
    //     Coun.Name AS Country,
    //     pro.Name AS Program,
    //     CS.Name AS CalendarSetup,
    //     CS.Category AS CalendarSetupCategory,
    //     Stp.Name AS StateProv 
    //   FROM Custom.CalendarEvent AS E 
    //   LEFT JOIN Custom.Facility AS F ON E.FacilityId = F.ID 
    //   LEFT JOIN Custom.Location AS FLo ON FLo.ID = F.LocationId
    //   LEFT JOIN Custom.FacilityContract AS FC ON E.FacilityContract = FC.ID 
    //   LEFT JOIN Custom.Contact AS Con ON Con.ID = FC.Contact 
    //   LEFT JOIN Custom.Location AS Lo ON Lo.ID = E.LocationId 
    //   LEFT JOIN Custom.Address AS Ad ON Lo.Address = Ad.ID 
    //   LEFT JOIN Custom.Country AS Coun ON Ad.CountryID = Coun.ID 
    //   LEFT JOIN Custom.StateProv AS Stp ON Ad.StateProvID = Stp.ID
    //   LEFT JOIN Custom.Program AS Pro ON E.ProgramId = Pro.ID
    //   LEFT JOIN Custom.CalendarSetup AS CS ON E.CalendarSetupId = CS.ID
    //   ${filterConditions} 
    //   ORDER BY E.StartTime DESC
    //   OFFSET ${offset} ROWS
    //   FETCH NEXT ${validatedPageSize} ROWS ONLY
    // `;
    const QueryString = `
      SELECT 
        COUNT(*) OVER() AS TotalCount,
        E.ID, 
        E.Subject, 
        E.EventStatus, 
        E.StartTime, 
        E.EndTime, 
        FC.Name as FCName, 
        F.RecordName as FRecordName, 
        FLo.Name as FName
      FROM Custom.CalendarEvent AS E 
      LEFT JOIN Custom.Facility AS F ON E.FacilityId = F.ID 
      LEFT JOIN Custom.Location AS FLo ON FLo.ID = F.LocationId
      LEFT JOIN Custom.FacilityContract AS FC ON E.FacilityContract = FC.ID 
      LEFT JOIN Custom.Contact AS Con ON Con.ID = FC.Contact 
      LEFT JOIN Custom.Location AS Lo ON Lo.ID = E.LocationId 
      LEFT JOIN Custom.Address AS Ad ON Lo.Address = Ad.ID 
      LEFT JOIN Custom.Country AS Coun ON Ad.CountryID = Coun.ID 
      LEFT JOIN Custom.StateProv AS Stp ON Ad.StateProvID = Stp.ID
      LEFT JOIN Custom.Program AS Pro ON E.ProgramId = Pro.ID
      LEFT JOIN Custom.CalendarSetup AS CS ON E.CalendarSetupId = CS.ID
      ${filterConditions} 
      ORDER BY E.StartTime DESC
      OFFSET ${offset} ROWS
      FETCH NEXT ${validatedPageSize} ROWS ONLY
    `;

    console.log("QueryString:", QueryString);
    const config = {
      method: method.toUpperCase(),
      url,
      headers: requestHeaders,
      data: { QueryString },
    };

    const response = await axios(config);

    // Extract totalCount from the first row of data (if data exists)
    const totalCount =
      response.data.length > 0 ? response.data[0].TotalCount : 0;

    res.json({
      status: response.status,
      page: validatedPage,
      pageSize: validatedPageSize,
      totalCount: totalCount,
      data: response.data,
    });
  } catch (error) {
    console.error("API call error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Location endpoint
app.get("/api/location", async (req, res) => {
  try {
    const url = `https://gordiehowesportscomplex.perfectmind.com/api/2.0/Organizations/39548/Locations`;
    const requestHeaders = { ...DEFAULT_HEADERS };

    const config = {
      method: "GET",
      url,
      headers: requestHeaders,
    };

    const response = await axios(config);

    res.json({
      status: response.status,
      data: response.data,
    });
  } catch (error) {
    console.error("API call error:", error.message);
    res.status(500).json({ error: error.message });
  }
});


// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
