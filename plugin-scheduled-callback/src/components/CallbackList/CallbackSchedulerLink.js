import React from 'react';
import { SideLink, Actions } from '@twilio/flex-ui';
 
const CallbackSchedulerLink = ({ activeView }) => {
   function navigate() {
       Actions.invokeAction('NavigateToView', { viewName: 'callback-scheduler-view'});
   }
 
   return (
       <SideLink
       showLabel={true}
       icon="Clock"
       iconActive="Clock"
       isActive={activeView === 'callback-scheduler-view'}
       onClick={navigate}>
       Callback Scheduler
       </SideLink>
   )
}
export default CallbackSchedulerLink;