const cron = require('node-cron');
const config = require( "./config");
const dayjs = require("dayjs");

const db = require("./utils/db");
const client = require('twilio')(config.twilio.accountSid, config.twilio.authToken);

// ...

// Schedule tasks to be run on the server.
// cron.schedule('* * * * *', async function() {
//     console.log('running a task every minute');
// try {
//     await getCallbacks();
// } catch (error) {
//     console.log(error);
// }
//   });


const getCallbacks = async () => {

    const date = Date.now();
    const res = await db.getConnection().request()
.input("Date", date.toLocaleDateString())
.input("StartTime", date.setMinutes(date.getMinutes() - 1).toLocaleTimeString())
.input("EndTime", date.setMinutes(date.getMinutes() + 1).toLocaleTimeString())
query("SELECT * FROM [dbo].[Callback] WHERE [DELETED] <> 1 AND [Date] = @Date AND [Time] BETWEEN @StartTime AND @EndTime AND [OutboundTaskSid] IS NULL");

console.log(res);
return res;



};

(async function(){
try {
    const res = await db.getConnection();
    const date = dayjs(); // new Date( Date.now());

    console.log(date);
    
    const starttime = dayjs().add(-1, 'minute').toDate();
    console.log(starttime);
    const endtime = dayjs().add(1, 'minute').toDate();
    console.log(endtime);

    let data = await res.request()
    .input("StartTime", starttime)
    .input("EndTime", endtime)
    .query("SELECT * FROM [dbo].[Callback] WHERE [DELETED] <> 1 AND [Date] BETWEEN @StartTime AND @EndTime AND [OutboundTaskSid] IS NULL");
    
    console.log(data);

    await  getCallBackList(data.recordset)
    return data;
    } catch (error) {
        console.log(error);
    }
}());

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
                        date: data.Date, // to local date time?
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
                // .then(task => console.log(task.sid));
                console.log(task)


}


const getCallBackList = async (recordset) => {

    let result = [];
    recordset.forEach( async( callback) =>  {

        console.log(callback.Date);
        console.log( dayjs(callback.Date).format("YYYY-MM-DD"));

        // let data = {

        //     id: callback.Id,
        //     first_name : callback.FirstName,
        //     last_name : callback.LastName,
        //     phone_number : callback.PhoneNumber,
        //     date : dayjs(callback.Date).format("YYYY-MM-DD"),
        //     time : dayjs(callback.Date).format("HH:mm"),
        //     notes : callback.Notes,
        //     auto_dial : callback.AutoDial,
        //     route_to_queue : callback.RouteToQueue,
        //     worker_sid : callback.WorkerSid,
        //     worker_name : callback.WorkerName
        // };

        // result.push(data);

        await createTask(callback);

    });

   // return result;

}


