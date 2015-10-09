'use strict';

import React         from 'react/addons';
import Reflux             from 'reflux';

import classNames from 'classnames'
import TimeCardStore from '../stores/TimeCardStore';
import TimeCardActions from '../actions/TimeCardActions';
// var Parse = require('parse');
// Parse.initialize("umJWoYdcF0EOGf62IiqOinOpmpUaUeYvyvn4QtZ5", "mCvBkC3Yr8lF5R5mNNVfMNWoKLBMOTjpSwaMZ6eH");

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;


var StaffTimeCard = React.createClass({
    mixins: [Reflux.connect(TimeCardStore)],
    getInitialState() {
    },
    displayName: 'StaffTimeCard',

    componentDidMount() {

    },

    expand(){
        TimeCardActions.switchStaffCard(this.props.index);
    },

    render() {
        console.log(this.props.isExpanded);

        return(
            <div className={classNames('card','staffTimeCard')} onClick={this.expand}>
                <span>{this.props.staff.staffName}</span>
                <span> should work</span>
                <span className='number'> {Math.round(this.props.staff.requiredWorkMinutes)} </span>minutes
                <span> and worked</span>
                <span className='number'> {Math.round(this.props.staff.totalWorkMinutes)} </span>minutes
                bonus<span className='number'> {Math.round(this.props.staff.totalWorkMinutes - this.props.staff.requiredWorkMinutes)} minutes</span>
                
                <ReactCSSTransitionGroup transitionName='expand'>
                    {this.props.isExpanded && (
                        <div>
                            abc
                        </div>
                    )}
                </ReactCSSTransitionGroup>


            </div>
        )

    }
});


export default StaffTimeCard;