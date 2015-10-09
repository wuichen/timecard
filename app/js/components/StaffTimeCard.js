'use strict';

import React         from 'react/addons';
import classNames from 'classnames'
// var Parse = require('parse');
// Parse.initialize("umJWoYdcF0EOGf62IiqOinOpmpUaUeYvyvn4QtZ5", "mCvBkC3Yr8lF5R5mNNVfMNWoKLBMOTjpSwaMZ6eH");

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;


var StaffTimeCard = React.createClass({
    getInitialState() {
        return({
            expanded: false
        })
    },
    displayName: 'StaffTimeCard',

    componentDidMount() {

    },

    expand(){
        this.setState({
            expanded: !this.state.expanded
        })
    },

    render() {

        return(
            <div className={classNames('card','staffTimeCard')} onClick={this.expand}>
                <span>{this.props.staff.staffName}</span>
                <span> should work</span>
                <span className='number'> {Math.round(this.props.staff.requiredWorkMinutes)} </span>minutes
                <span> and worked</span>
                <span className='number'> {Math.round(this.props.staff.totalWorkMinutes)} </span>minutes
                bonus<span className='number'> {Math.round(this.props.staff.totalWorkMinutes - this.props.staff.requiredWorkMinutes)} minutes</span>
                
                <ReactCSSTransitionGroup transitionName='expand'>
                    {this.state.expanded && (
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