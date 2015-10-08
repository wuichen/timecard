'use strict';

import React         from 'react/addons';
import {Link}        from 'react-router';
import DocumentTitle from 'react-document-title';

import classNames from 'classnames'
var Parse = require('parse');
Parse.initialize("umJWoYdcF0EOGf62IiqOinOpmpUaUeYvyvn4QtZ5", "mCvBkC3Yr8lF5R5mNNVfMNWoKLBMOTjpSwaMZ6eH");

// var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;


var HomePage = React.createClass({
    displayName: 'Home',

    componentDidMount() {

        var Staff = Parse.Object.extend("Staff");
        var queryObject = new Parse.Query(Staff);
        var self = this;
        // queryObject.find({
        //     success: function (results) {
        //         for (var i = 0; i < results.length; i++) {
        //             self.state.staffs.push(results[i].get('name'))
        //         }
        //         self.setState({
        //             staffs: self.state.staffs
        //         })
        //     },
        //     error: function (error) {
        //         alert("Error: " + error.code + " " + error.message);
        //     }
        // })
        
        queryObject.find().then(function(results){
                for (var i = 0; i < results.length; i++) {
                    self.state.staffs.push(results[i].get('name'))
                    console.log(results[i].get('name'))
                }            
                self.setState({
                    staffs: self.state.staffs
                })               
        })


    },
    getInitialState() {
        return({
            staffs: []
        })
    },
    signIn(staffName, time){

        var currentTime = new Date();

        var startWorkHour = new Date();
        startWorkHour.setHours(8,0);
        var endWorkHour = new Date();
        endWorkHour.setHours(23,0);

        var TimePunchObject = Parse.Object.extend('TimePunch');
        var timePunchObject = new TimePunchObject();
        var query = new Parse.Query(TimePunchObject);
        query.greaterThan('morningSignIn',startWorkHour);
        query.lessThan('morningSignIn',endWorkHour);
        query.equalTo('name',staffName);            
    },

    timePunch(staffName, signInOuttime) {
        var currentTime = new Date();

        var startWorkHour = new Date();
        startWorkHour.setHours(8,0);
        var endWorkHour = new Date();
        endWorkHour.setHours(23,0);

        var TimePunchObject = Parse.Object.extend('TimePunch');
        var timePunchObject = new TimePunchObject();
        var query = new Parse.Query(TimePunchObject);

        query.greaterThan('createdAt',startWorkHour);
        query.lessThan('createdAt',endWorkHour);
        query.equalTo('name',staffName);


        query.find().then(function(results){
            if(results.length === 1){
                if(typeof results[0].get(signInOuttime) === 'undefined'){
                    return query.get(results[0].id)
                }else{
                    return false;
                }
            }else{
                return timePunchObject;
            }
        }).then(function(object){
            if(object){
                timePunchObject = object;
                timePunchObject.set(signInOuttime, currentTime);
                timePunchObject.set('name',staffName)
                timePunchObject.save();
            }
        })

    },

    render() {
//         var TestObject = Parse.Object.extend("TestObject");
// var testObject = new TestObject();
// testObject.save({foo: "bar"}).then(function(object) {
//   alert("yay! it worked");
// });


        return(
            <DocumentTitle title="Home">
              <section className="not-found-page">

                <nav>
                    <div className={classNames('nav-wrapper','teal','lighten-2')}>
                      <a href="#" className={classNames('brand-logo','center')}>Dr.Wu's Clinic</a>
                    </div>
                </nav>
                <div className='cardContainer'>
                    
                    {this.state.staffs.map(function(staffName){
                        return(
                            <div className={classNames('card','staffCard')}>
                                <div className='card-image'>
                                    <span className='card-title'>{staffName}</span>
                                    <img src='http://shackmanlab.org/wp-content/uploads/2013/07/person-placeholder.jpg' />
                                </div>
                                <div className='card-content'>
                                    <a onClick={this.timePunch.bind(this,staffName,'morningSingIn')}>morning sign in </a>
                                    <a onClick={this.timePunch.bind(this,staffName,'morningSignOut')}>morning sign out</a>

                                    <a onClick={this.timePunch.bind(this,staffName,'afternoonSignIn')}>afternoon sign in</a>
                                    <a onClick={this.timePunch.bind(this,staffName,'afternoonSignOut')}>afternoon sign out</a>

                                    <a onClick={this.timePunch.bind(this,staffName,'eveningSignIn')}>evening sign in</a>
                                    <a onClick={this.timePunch.bind(this,staffName,'eveningSignOut')}>evening sign out</a>
                                </div>
                            </div>
                        )
                    }.bind(this))}

                </div>
              </section>

            </DocumentTitle>
        )

    }
});


export default HomePage;