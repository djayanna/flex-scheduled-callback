const cron = require('node-cron');
const config = require( "./config");
const dayjs = require("dayjs");

const db = require("./utils/db");
const client = require('twilio')(config.twilio.accountSid, config.twilio.authToken);


// Schedule tasks to be run on the server.
cron.schedule('* * * * *', async function() {
    console.log('running a task every minute');
try {
    await getCallbacks();
} catch (error) {
    console.log(error);
}
  });


const getCallbacks = async () => {

//     const date = Date.now();
//     const res = await db.getConnection().request()
// .input("Date", date.toLocaleDateString())
// .input("StartTime", date.setMinutes(date.getMinutes() - 1).toLocaleTimeString())
// .input("EndTime", date.setMinutes(date.getMinutes() + 1).toLocaleTimeString())
// query("SELECT * FROM [dbo].[Callback] WHERE [DELETED] <> 1 AND [Date] = @Date AND [Time] BETWEEN @StartTime AND @EndTime AND [OutboundTaskSid] IS NULL");

// console.log(res);
// return res;

try {
    const res = await db.getConnection();
    const date = dayjs(); 
    
    const starttime = dayjs().add(-1, 'minute').toDate();
    console.log(starttime);
    const endtime = dayjs().add(1, 'minute').toDate();
    console.log(endtime);

    let data = await res.request()
    .input("StartTime", starttime)
    .input("EndTime", endtime)
    .query("SELECT * FROM [dbo].[Callback] WHERE [DELETED] <> 1 AND [Date] BETWEEN @StartTime AND @EndTime AND [OutboundTaskSid] IS NULL");
    
    console.log(data);

    await  createCallbacks(data.recordset)
    return data;
    } catch (error) {
        console.log(error);
    }
};

// (async function(){
// try {
//     const res = await db.getConnection();
//     const date = dayjs(); 

//     console.log(date);
    
//     const starttime = dayjs().add(-1, 'minute').toDate();
//     console.log(starttime);
//     const endtime = dayjs().add(1, 'minute').toDate();
//     console.log(endtime);

//     let data = await res.request()
//     .input("StartTime", starttime)
//     .input("EndTime", endtime)
//     .query("SELECT * FROM [dbo].[Callback] WHERE [DELETED] <> 1 AND [Date] BETWEEN @StartTime AND @EndTime AND [OutboundTaskSid] IS NULL");
    
//     console.log(data);

//     await  createCallbacks(data.recordset)
//     return data;
//     } catch (error) {
//         console.log(error);
//     }
// }());

const createTask = async (data) => {
  const task = await client.taskrouter.workspaces(config.twilio.workspaceSid)
                 .tasks
                 .create({attributes: JSON.stringify({
                    type: 'callback',
                    callback: {
                        id: data.Id,
                        firstName: data.FirstName,
                        lastName: data.LastName,
                        phoneNumber: data.PhoneNumber,
                        date: data.Date, 
                        notes: data.notes,
                        autoDial: data.AutoDial,
                        routeToQueue: data.RouteToQueue,
                        workerSid: data.WorkerSid
                    }
                  }),
                  taskChannel: 'voice', 
                  workflowSid:config.twilio.workflowSid,
                  priority: 1000
                   });
                console.log(task)
}


const createCallbacks = async (recordset) => {

    recordset.forEach( async( callback) =>  {

        await createTask(callback);

    });
}


