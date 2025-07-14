const crypto = require("crypto");

const {
  fetchTable,
  queryGet,
  fetchOptions,
  dateTimeGeneration,
  exeQuery,
} = require("../../config");

// In your backend file, replace the old function with this one.

async function assignProductsToClient(params) {
  const results = [];

  if (!params.products || params.products.length === 0) {
    return [{ success: false, error: "No products were provided to assign." }];
  }

  for (const product of params.products) {
    const serviceId = product.price_id;
    const price = product.price;

    try {
      let date = dateTimeGeneration(new Date());

      const query = `
   INSERT INTO portal_serviceOrder (link_clientid, link_serviceid, price, addeduser,addedtime)
 VALUES ('${params.clientId}', '${serviceId}', '${price}', '${params.addedBy}','${date}');
 `;

      let res = await exeQuery(query);

      return res;
    } catch (error) {
      results.push({
        success: false,
        serviceId: serviceId,
        error: error.message,
      });
    }
  }

  return results;
}

async function getExsistingUserList(params) {
  try {
    console.log(params.companyid);
    let res = await exeQuery(`select name,email,lid from SYF_USERMASTER`);
    console.log(res);
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}
// const emailVerificationToken = crypto.randomBytes(32).toString('hex')
// console.log(emailVerificationToken)
////////////////////////////////////COMMENTED BY SANJAY 3/7/2025 ---- 1:24PM
async function services_userAdd_addNewUser(params) {
  const results = [];
  console.log("me from params");
  console.log(params);
  console.log("emailverification.............................");
  for (const user of params) {
    try {
      const resetToken = crypto.randomBytes(32).toString("hex");

      console.log("emailverification.............................");
      
      let encryptedPassword = Buffer.from(`${user.name}@123`).toString(
        "base64"
      );

      const query = `
        INSERT INTO SYF_USERMASTER (email, name, zbStatus, status, resetToken, password)
        OUTPUT Inserted.lid
        VALUES ('${user.email}', '${user.name}', 'guest', 'login', '${resetToken}', '${encryptedPassword}')
      `;

      let res = await exeQuery(query);
      let serviceId = res.responseData.table[0].lid;
      console.log("Inserted ID:", serviceId);
      
      user["serviceId"] = serviceId;

      user["resetToken"] = resetToken;

      console.log(resetToken)
      results.push({ success: true, user });

    } catch (error) {
      console.log("Error inserting user:", user.email, error);
      results.push({ success: false, user, error: error.message });
    }
  }

  return results;
}
// ///
// async function services_userAdd_addNewUser(params) {
//   const results = [];
//   console.log("me from params");
//   console.log(params);

//   for (const user of params) {
//     try {
//       const resetToken = crypto.randomBytes(32).toString("hex");
//       let encryptedPassword= Buffer.from(`${user.name}@123`).toString("base64");

//       // **** IMPORTANT CHANGE IS HERE ****
//       const query = `
//         INSERT INTO SYF_USERMASTER (email, name, zbStatus, status, resetToken, password)
//         OUTPUT Inserted.lid, Inserted.resetToken
//         VALUES ('${user.email}', '${user.name}', 'guest', 'login', '${resetToken}', '${encryptedPassword}')
//       `;

//       let res = await exeQuery(query);
//       let createdUser = res.responseData.table[0]; // This will now contain { lid: ..., resetToken: ... }

//       user["serviceId"] = createdUser.lid;
//       user["resetToken"] = createdUser.resetToken; // **** AND HERE ****

//       results.push({ success: true, user });
//     } catch (error) {
//       console.log("Error inserting user:", user.email, error);
//       results.push({ success: false, user, error: error.message });
//     }
//   }

//   return results;
// }
/////////////////////////////////////
async function services_userAdd_addToPivot(params) {
  const results = [];

  for (const user of params.selected_users) {
    const query = `
      INSERT INTO portal_usersPivot (user_id, client_id)
      VALUES ('${user}', '${params.zlid}')
    `;

    // This call does NOT throw an error, it returns an object
    let res = await exeQuery(query);

    // IMPORTANT: Now we check the content of the 'res' object
    if (res && res.responseType === "SUCCESS") {
      // This is a REAL success
      results.push({
        success: true,
        user_id: user,
        client_id: params.zlid,
        res: res,
      });
    } else {
      // This is a FAILURE. Now we create the user-friendly message.

      let userFriendlyError = "Error"; // Default message for any failure

      // Check the inner responseMessage for the specific error text
      if (
        res.responseMessage &&
        res.responseMessage.includes("Violation of UNIQUE KEY constraint")
      ) {
        userFriendlyError = "User already exists";
      }

      // Now, we correctly push a "success: false" object to the results
      results.push({ success: false, user_id: user, error: userFriendlyError });
    }
  }

  return results;
}
/////////code by sanjay 3/7/2025
// async function getProjectUsers_ua(params) {
//   try {
//     const query = `
//       SELECT
//         u.lid AS userid,
//         u.name,
//         u.email,
//         u.resetToken, 
//         CASE
//           WHEN i.inviteduserid IS NULL THEN 1
//           ELSE 0
//         END AS isNew
//       FROM portal_usersPivot p
//       LEFT JOIN SYF_USERMASTER u ON u.lid = p.user_id
//       LEFT JOIN INVITEDUSERS i ON p.user_id = i.inviteduserid AND i.companyid = '${params.companyid}' and i.role='Client'
//       WHERE p.client_id = '${params.clientId}'
//     `;
//     let res = await exeQuery(query);
//     console.log(res);
//     if (res.responseType === "SUCCESS") {
//       return res.responseData.table || [];
//     }
//     return res.responseData.table || [];
//   } catch (error) {
//     console.error("Error fetching assigned users for client:", error);
//     return [];
//   }
// }
async function getProjectUsers_ua(params) {
  try {
    const query = `
      SELECT
        u.lid AS userid,
        u.name,
        u.email,
        u.resetToken, 
        CASE
          WHEN i.inviteduserid IS NULL THEN 1
          ELSE 0
        END AS isNew,
      
        CASE 
          WHEN u.resetToken IS NULL OR u.resetToken = '' THEN 1
          ELSE 0
        END AS isVerified
        -- END OF NEW LOGIC --
      FROM portal_usersPivot p
      LEFT JOIN SYF_USERMASTER u ON u.lid = p.user_id
      LEFT JOIN INVITEDUSERS i ON p.user_id = i.inviteduserid AND i.companyid = '${params.companyid}' and i.role='Client'
      WHERE p.client_id = '${params.clientId}'
    `;
    let res = await exeQuery(query);
    if (res.responseType === "SUCCESS") {
      return res.responseData.table || [];
    }
    return res.responseData.table || [];
  } catch (error) {
    console.error("Error fetching assigned users for client:", error);
    return [];
  }
}
///////////
///////////////commented by sanjay 07/07/2025 july 7 11:35am
// async function recordUserInvitation(params) {
//   const query123 = `SELECT modules
//        FROM roles
//        WHERE role='Client' AND companyId='${params.companyid}';`;
//   let ress = await exeQuery(query123);
//   console.log("resssssssss",ress)
//   let ab = ress.responseData.table[0].modules;
  
//   const a = [ab];
//   const modulesJson = JSON.stringify(a);

//   try {
//     // This query first checks if the invitation already exists.
//     // If not, it inserts a new record. This prevents duplicates.
//     const query = `
//             IF NOT EXISTS (SELECT 1 FROM INVITEDUSERS WHERE inviteduserid = '${params.userid}' AND companyid = '${params.companyid}')
//             BEGIN
//                 INSERT INTO INVITEDUSERS 
//                     (inviteduserid, companyid, companyname, inviteduseremail, role, modules, addeduser, addedtime, status)
//                 VALUES 
//                     ('${params.userid}', '${params.companyid}', '${params.companyname}', '${params.email}', 'Client', '${modulesJson}', '${params.addeduser}', GETDATE(), 'accepted');
                
//                 SELECT 'SUCCESS' AS result;
//             END
//             ELSE
//             BEGIN
//                 SELECT 'EXISTS' AS result;
//             END
//         `;
//     let res = await exeQuery(query);
//     if (res.responseType === "SUCCESS") {
//       return {
//         modules:a,
//         success: true,
//         message: "Invitation recorded or already exists.",
//       };
//     } else {
//       return {
//         success: false,
//         message: "Database error during invitation recording.",
//       };
//     }
//   } catch (error) {
//     console.error("Error in recordUserInvitation:", error);
//     return { success: false, message: error.message };
//   }
// }

async function recordUserInvitation(params) {
  try {
    // Step 1: Get modules from 'roles' table for 'Client'
    const roleModulesQuery = `
      SELECT modules
      FROM roles
      WHERE role = 'Client' AND companyId = '${params.companyid}';
    `;
    const roleRes = await exeQuery(roleModulesQuery);
    let ab = roleRes.responseData.table[0].modules;

    // Convert modules string to array
    const newModules = ab.includes(",") ? ab.split(",") : [ab];

    // Step 2: Check if user is already in INVITEDUSERS
    const checkUserQuery = `
      SELECT modules
      FROM INVITEDUSERS
      WHERE inviteduserid = '${params.userid}' AND companyid = '${params.companyid}';
    `;
    const userRes = await exeQuery(checkUserQuery);

    // User not found — insert new
    if (userRes.responseData.table.length === 0) {
      const modulesJson = JSON.stringify(newModules);
      const insertQuery = `
        INSERT INTO INVITEDUSERS 
          (inviteduserid, companyid, companyname, inviteduseremail, role, modules, addeduser, addedtime, status)
        VALUES 
          ('${params.userid}', '${params.companyid}', '${params.companyname}', '${params.email}', 'Client', '${modulesJson}', '${params.addeduser}', GETDATE(), 'accepted');
      `;
      await exeQuery(insertQuery);
      return {
        success: true,
        modules: newModules,
        message: "User invited successfully.",
      };
    }

    // User exists — check if modules need to be updated
    let existingModulesRaw = userRes.responseData.table[0].modules;
    let existingModules;

    try {
      existingModules = Array.isArray(existingModulesRaw)
        ? existingModulesRaw
        : JSON.parse(existingModulesRaw);
    } catch (e) {
      existingModules = existingModulesRaw.includes(",")
        ? existingModulesRaw.split(",")
        : [existingModulesRaw];
    }

    // Merge and remove duplicates
    const mergedModules = Array.from(new Set([...existingModules, ...newModules]));

    const isUpdateNeeded = mergedModules.length !== existingModules.length;

    if (isUpdateNeeded) {
      const updatedModulesJson = JSON.stringify(mergedModules);
      const updateQuery = `
        UPDATE INVITEDUSERS
        SET modules = '${updatedModulesJson}'
        WHERE inviteduserid = '${params.userid}' AND companyid = '${params.companyid}';
      `;
      await exeQuery(updateQuery);
      return {
        success: true,
        modules: mergedModules,
        message: "Modules updated for existing user.",
      };
    } else {
      return {
        success: true,
        modules: existingModules,
        message: "User already has access to all modules.",
      };
    }
  } catch (error) {
    console.error("Error in recordUserInvitation:", error);
    return {
      success: false,
      message: error.message || "Unknown error occurred.",
    };
  }
}

////////////////////////////////////////////////////////////////////////////
async function productvs(params) {
  try {
    console.log(params.companyid);
    let res = await fetchOptions(
      `SELECT assignmentNature, lid
       FROM AssignmentNature
       WHERE isListing = 1
       AND companyId = '${params.companyid}';
 `,
      "assignmentNature",
      "lid"
    );
    console.log("ram ram ram 4:46");
    console.log(res);
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

// async function productdata(params) {
//   try {
//     console.log(params.companyid);
//     let res = await exeQuery(
//       `SELECT serviceName,	price ,id
//        FROM portal_serviceCriteria
//        WHERE link_assignmentId = '${params.lid}';`
//     );
//     console.log("ram ram ram 4:46");
//     console.log(res);
//     return res;
//   } catch (error) {
//     return { error: true, message: error.message, details: error };
//   }
// }
// Replace the old productdata function with this one
async function productdata(params) {
  try {
    // This is the key change. The frontend sends an array of IDs.
    // We must format it correctly for an SQL 'IN' clause.
    // Example: ['15'] becomes "'15'"
    // Example: ['15', '22'] becomes "'15','22'"
    const formattedLids = params.lid.map((id) => `'${id}'`).join(",");

    // This query now joins with portal_serviceOrder to check assignment status
    // for the specific client.
    const query = `
      SELECT 
          psc.serviceName,	
          psc.price, 
          psc.id,
          CASE 
              WHEN pso.link_clientid IS NOT NULL THEN 1 
              ELSE 0 
          END as isAssigned
      FROM 
          portal_serviceCriteria psc
      LEFT JOIN 
          portal_serviceOrder pso ON psc.id = pso.link_serviceid AND pso.link_clientid = '${params.clientId}'
      WHERE 
          psc.link_assignmentId IN (${formattedLids});
    `;

    // Now execute the corrected query
    let res = await exeQuery(query);
    console.log("Product data with assignment status:", res);
    return res;
  } catch (error) {
    console.error("Error in productdata function:", error);
    // Return a structured error object
    return { responseType: "ERROR", message: error.message, details: error };
  }
}

async function saveServiceOrder(params) {
  // params: { clientId, addedBy, products: [{ serviceId, price }, ...] }
  const results = [];

  for (const product of params.products) {
    try {
      const query = `
        IF NOT EXISTS (SELECT 1 FROM portal_serviceOrder WHERE link_clientid = '${params.clientId}' AND link_serviceid = '${product.serviceId}')
        BEGIN
            INSERT INTO portal_serviceOrder (link_clientid, link_serviceid, price, addeduser)
            VALUES ('${params.clientId}', '${product.serviceId}', '${product.price}', '${params.addedBy}');
            SELECT 'Product added successfully.' AS message;
        END
        ELSE
        BEGIN
            SELECT 'This product is already assigned.' AS message;
        END
      `;
      let res = await exeQuery(query);
      if (res.responseType === "SUCCESS") {
        results.push({
          success: true,
          serviceId: product.serviceId,
          message: res.responseData.table[0].message,
        });
      } else {
        throw new Error(res.responseMessage);
      }
    } catch (error) {
      results.push({
        success: false,
        serviceId: product.serviceId,
        error: error.message,
      });
    }
  }
  return results;
}
///
// In your backend file, add this ENTIRE new function.

async function getProductsForClientAssignment(params) {
  // This function needs both the companyId to get all possible products,
  // and the clientId to check their assignment status.
  try {
    const query = `
      SELECT
        an.assignmentNature AS label,  -- Use 'label' for VirtualSelect compatibility
        an.lid AS value,               -- Use 'value' for VirtualSelect compatibility
        CASE
          WHEN pso.link_serviceid IS NOT NULL THEN 1
          ELSE 0
        END AS isAssigned
      FROM
        AssignmentNature an
      LEFT JOIN
        portal_serviceOrder pso ON an.lid = pso.link_serviceid AND pso.link_clientid = '${params.clientId}'
      WHERE
        an.isListing = 1
        AND an.companyId = '${params.companyid}';
    `;
    let res = await exeQuery(query);

    if (res.responseType === "SUCCESS") {
      // Return the full list of products, each marked as assigned or not.
      return res.responseData.table || [];
    }
    return []; // Return empty array on failure
  } catch (error) {
    console.error("Error in getProductsForClientAssignment:", error);
    return { error: true, message: error.message };
  }
}

// ADD THIS FUNCTION TO INSERT A SINGLE PRODUCT
async function addProductToClient(params) {
  try {
    const query = `
      IF NOT EXISTS (SELECT 1 FROM portal_serviceOrder WHERE link_clientid = '${params.clientId}' AND link_serviceid = '${params.productId}')
      BEGIN
        INSERT INTO portal_serviceOrder (link_clientid, link_serviceid, price, addeduser, addedtime)
        VALUES ('${params.clientId}', '${params.productId}', '${params.price}', '${params.addedBy}', GETDATE());
      END
    `;
    return await exeQuery(query);
  } catch (error) {
    console.error("Error in addProductToClient:", error);
    return { responseType: error, message: error.message };
  }
}

// ADD THIS FUNCTION TO DELETE A SINGLE PRODUCT
async function removeProductFromClient(params) {
  try {
    const query = `DELETE FROM portal_serviceOrder WHERE link_clientid = '${params.clientId}' AND link_serviceid = '${params.productId}'`;
    return await exeQuery(query);
  } catch (error) {
    console.error("Error in removeProductFromClient:", error);
    return { responseType: "ERROR", message: error.message };
  }
}

// In your backend file

async function getExsistingUserList(params) {
  try {
    console.log(params.companyid);
    // --- CHANGE IS HERE ---
    // Ask for the resetToken along with the other user details
    let res = await exeQuery(`select name, email, lid, resetToken from SYF_USERMASTER`);
    console.log(res);
    return res;
  } catch (error) {
    return { error: true, message: error.message, details: error };
  }
}

/////
module.exports = {
  getExsistingUserList,
  services_userAdd_addNewUser,
  services_userAdd_addToPivot,
  getProjectUsers_ua,
  recordUserInvitation,
  productvs,
  productdata,
  saveServiceOrder,
  assignProductsToClient,
  getProductsForClientAssignment,
  addProductToClient,
  removeProductFromClient
};
