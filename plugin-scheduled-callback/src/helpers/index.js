import * as Flex from '@twilio/flex-ui';

export function startOutboundCall(number, taskAttributes)
{
  Flex.Actions.invokeAction("StartOutboundCall", { destination: number , taskAttributes: taskAttributes});
}

export async function  acceptCallbackTask(taskAttributes) {
    const manager = Flex.Manager.getInstance();
    console.log("accept callback task", taskAttributes);
    await post(manager, `task/accept-wrapup-task`, taskAttributes, "");
};


export async function getScheduledCallback(workerSid) {
  const manager = Flex.Manager.getInstance();
 const url = `callback?workerSid=${workerSid}`;
 const res = await get(manager,url);
 console.log(res);
 return res;  
}

export async function updateScheduledCallback(callback) {
  const manager = Flex.Manager.getInstance();
  const id = callback.id;
  const url = `callback/${id}`;
  const res =  await post(manager,url, callback);
  return res.length > 0 ? res[0] : null ;
 }


export async function addScheduledCallback(callback) {
  const manager = Flex.Manager.getInstance();
  const url = `callback`;
  const res = await post(manager,url, callback);
  return res;
 }

 export async function deleteScheduledCallback(callback) {
  const manager = Flex.Manager.getInstance();
  const id = callback.id;
  const url = `callback/${id}`;
  return await remove(manager,url);
 }
 

let  get  = async(manager, path) => {
  const fetchBody = {
    token: manager.store.getState().flex.session.ssoTokenPayload.token,
  };
  console.log('Update worker with payload: ', fetchBody);

  const { REACT_APP_SERVICE_URL } = process.env;
  const url =  `http://${REACT_APP_SERVICE_URL}/${path}`
      //body: new URLSearchParams(fetchBody),
  const fetchOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'Authorization': manager.store.getState().flex.session.ssoTokenPayload.token,
    }
  };
  try {
    const response = await fetch(url, fetchOptions);
    const data = await response.json();
  return data
  } catch (error) {
    console.error(error);
  }
}


let remove = async (manager, path, errorNotification) => {

  const { REACT_APP_SERVICE_URL } = process.env;
  const url =  `http://${REACT_APP_SERVICE_URL}/${path}`

  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      'Authorization': manager.store.getState().flex.session.ssoTokenPayload.token,
    },
  };

  try {
    const resp = await fetch(
      url,
      options
    );
     return await resp.json();
  } catch (e) {
    ///notifications.error(errorNotification);
    throw e;
  }
};




  /**
   * Internal method to make a POST request
   * @param path  the path to post to
   * @param params the post parameters
   */
 let post = async (manager, path, params, errorNotification) => {

    const { REACT_APP_SERVICE_URL } = process.env;
    const url =  `http://${REACT_APP_SERVICE_URL}/${path}`
    const body = {
      ...params,
    };

    const options = {
      method: "POST",
      body: new URLSearchParams(body),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        'Authorization': manager.store.getState().flex.session.ssoTokenPayload.token,
      },
    };

    try {
      const resp = await fetch(
        url,
        options
      );
      return await resp.json();
    } catch (e) {
      ///notifications.error(errorNotification);
      throw e;
    }
  };