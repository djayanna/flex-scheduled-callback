"use strict";
var dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const register = async ({ sql, getConnection }) => {

const getCallbacks = async (workerSid) => {

  try {
    
    await getConnection();

    var request = new sql.Request();
    request.input("WorkerSid", sql.NVarChar(50), workerSid);

    const rs = await request.query( "SELECT [Id] \
        ,[FirstName] \
        ,[LastName] \
        ,[PhoneNumber] \
        ,[Date] \
        ,[Notes] \
        ,[AutoDial] \
        ,[RouteToQueue] \
        ,[WorkerSid] \
        ,[WorkerName] \
        ,[DELETED] \
        FROM [CallbackScheduler].[dbo].[Callback] \
        WHERE [WorkerSid]=@WorkerSid AND [DELETED] <> 1  "
    );

    return rs;
  } catch (err) {
    console.log(err);
  }
};

  const addCallback = async ({
    firstName,
    lastName,
    phoneNumber,
    date,
    time,
    notes,
    autoDial,
    routeToQueue,
    workerSid,
    workerName,
  }) => {
      try {
        await getConnection();
        var request = new sql.Request();
        request.input("firstName", sql.NVarChar(50), firstName);
        request.input("lastName", sql.NVarChar(50), lastName);
        request.input("phoneNumber", sql.NVarChar(15), phoneNumber);
        request.input(
          "date",
          sql.DateTime,
          dayjs(date + " " + time)
            .utc()
            .format()
        );
        request.input("notes", sql.NVarChar(1000), notes);
        request.input("autoDial", sql.Bit, autoDial === "false"? 0 : 1);
        request.input("routeToQueue", sql.Bit, routeToQueue === "false"? 0 : 1);
        request.input("workerSid", sql.NVarChar(50), workerSid);
        request.input("workerName", sql.NVarChar(50), workerName);
  
        const rs = await request.query(
          "INSERT INTO [dbo].[Callback] \
         ( \
             [FirstName] \
               ,[LastName] \
               ,[PhoneNumber] \
               ,[Date] \
               ,[Notes] \
               ,[AutoDial] \
               ,[RouteToQueue] \
               ,[WorkerSid] \
               ,[WorkerName] \
         ) \
         OUTPUT inserted.Id \
         VALUES \
         ( \
             @FirstName \
               ,@LastName \
               ,@PhoneNumber \
               ,@Date \
               ,@Notes \
               ,@AutoDial \
               ,@RouteToQueue \
               ,@WorkerSid \
               ,@WorkerName \
         );"
        );

        return rs;
          
      } catch (error) {
          console.log(error);
      }
      
  };

  const updateCallback = async ({
    id,
    firstName,
    lastName,
    phoneNumber,
    date,
    time,
    notes,
    autoDial,
    routeToQueue,
    workerSid
  }) => {
    await getConnection();
    var request = new sql.Request();
    request.input("id", sql.UniqueIdentifier, id);
    request.input("firstName", sql.NVarChar(50), firstName);
    request.input("lastName", sql.NVarChar(50), lastName);
    request.input("phoneNumber", sql.NVarChar(15), phoneNumber);
    request.input(
      "date",
      sql.DateTime,
      dayjs(date + " " + time)
        .utc()
        .format()
    );
    request.input("notes", sql.NVarChar(1000), notes);
    request.input("autoDial", sql.Bit, autoDial === "false"? 0 : 1);
    request.input("routeToQueue", sql.Bit, routeToQueue === "false"? 0 : 1);
    request.input("workerSid", sql.NVarChar(50), workerSid);

    const rs = await request.query(
      "UPDATE [dbo].[Callback] \
     SET \
           [FirstName] = @FirstName \
           ,[LastName] = @LastName \
           , [PhoneNumber] = @PhoneNumber \
           ,[Date] = @Date \
           ,[Notes] = @Notes \
           ,[AutoDial] = @AutoDial \
           ,[RouteToQueue] = @RouteToQueue \
       WHERE [WorkerSid] = @WorkerSid AND [Id] = @Id \
      \
     SELECT [Id] \
           ,[FirstName] \
           ,[LastName] \
           ,[PhoneNumber] \
           ,[Date] \
           ,[Notes] \
           ,[AutoDial] \
           ,[RouteToQueue] \
           ,[WorkerSid] \
           ,[WorkerName] \
       FROM [dbo].[Callback] \
       WHERE [WorkerSid] = @WorkerSid AND [Id] = @Id"
    );
   // console.log(rs);

    return rs;
  };

  const deleteCallback = async ({ id }) => {
    await getConnection();
    var request = new sql.Request();
    request.input("id", sql.UniqueIdentifier, id);

    // query to the database and get the records
    const rs = await request.query(
      "UPDATE  [dbo].[Callback] \
                                    SET [Deleted] = 1 \
                                    WHERE   [id] = @id;"
    );

   // console.log(rs);
  };

  const getCallbackList = (recordset) => {
    let result = [];
    recordset.forEach((callback) => {
      console.log(callback.Date);
      console.log(dayjs(callback.Date).format("YYYY-MM-DD"));

      let data = {
        id: callback.Id,
        firstName: callback.FirstName,
        lastName: callback.LastName,
        phoneNumber: callback.PhoneNumber,
        date: dayjs(callback.Date).format("YYYY-MM-DD"),
        time: dayjs(callback.Date).format("HH:mm"),
        notes: callback.Notes,
        autoDial: callback.AutoDial,
        routeToQueue: callback.RouteToQueue,
        workerSid: callback.WorkerSid,
        workerName: callback.WorkerName,
      };

      result.push(data);
    });

    return result;
  };

  return {
    addCallback,
    deleteCallback,
    getCallbacks,
    updateCallback,
  };
};

// const getCallbacks = async () => {

//   try {
//     await client.getConnection();

//     var request = new sql.Request();

//     const rs = await request.query(
//       "SELECT * FROM [dbo].[Callback] WHERE [DELETED] <> 1 "
//     );

//     return rs;
//   } catch (err) {
//     console.log(err);
//   }
// };

module.exports = {
    register
};
