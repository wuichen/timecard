'use strict';

import Reflux             from 'reflux';
import TimeCardActions from '../actions/TimeCardActions';

const TimeCardStore = Reflux.createStore({
    listenables: [TimeCardActions],

    data:{
        selectedIndex: null
    },
    onSwitchStaffCard(selectedIndex) {
      console.log(selectedIndex);
        if(this.data.selectedIndex === selectedIndex){
            this.data.selectedIndex = null;
        }else{
            this.data.selectedIndex = selectedIndex;
        }
        this.trigger(this.data);
    },

});

export default TimeCardStore;