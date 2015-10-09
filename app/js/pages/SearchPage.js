'use strict';

import React         from 'react/addons';
import {Link}        from 'react-router';
import DocumentTitle from 'react-document-title';
var Calendar = require('react-input-calendar');
import classNames from 'classnames'
var Parse = require('parse');
Parse.initialize("umJWoYdcF0EOGf62IiqOinOpmpUaUeYvyvn4QtZ5", "mCvBkC3Yr8lF5R5mNNVfMNWoKLBMOTjpSwaMZ6eH");

import StaffTimeCard from '../components/StaffTimeCard';


const SearchPage = React.createClass({

  getInitialState(){
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    firstDay.setHours(8,0);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    lastDay.setHours(23,0);
    return({
      startDate: firstDay,
      endDate: lastDay,
      staffs: [],
      searchName: ''
    })
  },

  // setName(event) {
  //     console.log(event.target.value);
  //     this.setState({
  //       staffName: event.target.value
  //     })
  // },
  componentDidMount () {
      this.search();
  },
  setStartDate(date) {
      var d = new Date(date);
      d.setHours(8,0);
      console.log(d);
      this.setState({
        startDate: d
      })
  },
  setEndDate(date) {
      var d = new Date(date);
      d.setHours(23,0);
      console.log(d);
      this.setState({
        endDate: d
      })
  },
  setSearchName (event) {
      this.setState({
          searchName: event.target.value
      })
      console.log(this.state.searchName);
  },
  search() {
      this.setState({
          staffs: []
      })
      var self = this;
      var TimePunchObject = Parse.Object.extend('TimePunch');
      var timePunchObject = new TimePunchObject();
      var query = new Parse.Query(TimePunchObject);   

      if(this.state.searchName.length > 0){
        query.equalTo('name',this.state.searchName);
      }
      query.greaterThan('createdAt',this.state.startDate);
      query.lessThan('createdAt',this.state.endDate);

      query.find().then(function(results){
          var staffs = {};
          for (var i = 0; i < results.length; i++) {

              var totalWorkMilliseconds = 0;
              var requiredWorkMinutes = 0;
              var workingRecord = {};
              var missingTime = [];

              workingRecord.date = results[i].get('createdAt');

              if(typeof results[i].get('morningSignIn') != 'undefined' || typeof results[i].get('morningSignOut')!= 'undefined'){
                  if(typeof results[i].get('morningSignIn') === 'undefined'){
                      missingTime.push({
                          date: results[i].get('createdAt'),
                          missingTime: 'morningSignIn'
                      })
                  }else if(typeof results[i].get('morningSignOut')=== 'undefined'){
                       missingTime.push({
                          date: results[i].get('createdAt'),
                          missingTime: 'morningSignOut'
                      })                     
                  }else{
                      requiredWorkMinutes = requiredWorkMinutes + 210
                      var morningSignIn = results[i].get('morningSignIn');
                      var morningSignOut = results[i].get('morningSignOut');
                      var morningWorkMilliseconds = Math.abs(morningSignOut - morningSignIn);

                      totalWorkMilliseconds = totalWorkMilliseconds + morningWorkMilliseconds;
                      workingRecord.morning = {
                          morningSignIn: morningSignIn,
                          morningSignOut: morningSignOut,
                          morningMinutes: morningWorkMilliseconds/60000,
                          bonus: morningWorkMilliseconds/6000 - 210
                      }
                  }
              }

              if(typeof results[i].get('afternoonSignIn') != 'undefined'|| typeof results[i].get('afternoonSignOut')!= 'undefined'){
                  if(typeof results[i].get('afternoonSignIn') === 'undefined'){
                      missingTime.push({
                          date: results[i].get('createdAt'),
                          missingTime: 'afternoonSignIn'
                      })
                  }else if(typeof results[i].get('afternoonSignOut')=== 'undefined'){
                       missingTime.push({
                          date: results[i].get('createdAt'),
                          missingTime: 'afternoonSignOut'
                      })                     
                  }else{
                      requiredWorkMinutes = requiredWorkMinutes + 210
                      var afternoonSignIn = results[i].get('afternoonSignIn');
                      var afternoonSignOut = results[i].get('afternoonSignOut');
                      var afternoonWorkMilliseconds = Math.abs(afternoonSignOut-afternoonSignIn);
                      totalWorkMilliseconds = totalWorkMilliseconds + afternoonWorkMilliseconds;
                      workingRecord.afternoon = {
                          afternoonSignIn: afternoonSignIn,
                          afternoonSignOut: afternoonSignOut,
                          afternoonMinutes: afternoonWorkMilliseconds/60000,
                          bonus: (afternoonWorkMilliseconds/6000 - 210)
                      }
                  }
              }

              if(typeof results[i].get('eveningSignIn') != 'undefined'|| typeof results[i].get('eveningSignOut') != 'undefined'){
                  if(typeof results[i].get('eveningSignIn') === 'undefined'){
                      missingTime.push({
                          date: results[i].get('createdAt'),
                          missingTime: 'eveningSignIn'
                      })
                  }else if(typeof results[i].get('eveningSignOut')=== 'undefined'){
                       missingTime.push({
                          date: results[i].get('createdAt'),
                          missingTime: 'eveningSignOut'
                      })                     
                  }else{
                      requiredWorkMinutes = requiredWorkMinutes + 180;
                      var eveningSignIn = results[i].get('eveningSignIn');
                      var eveningSignOut = results[i].get('eveningSignOut');
                      var eveningWorkMilliseconds = Math.abs(eveningSignOut-eveningSignIn);
                      totalWorkMilliseconds = totalWorkMilliseconds + eveningWorkMilliseconds;
                      workingRecord.evening = {
                          eveningSignIn: eveningSignIn,
                          eveningSignOut: eveningSignOut,
                          eveningMinutes: eveningWorkMilliseconds/60000,
                          bonus: (eveningWorkMilliseconds/6000 - 180)
                      }
                  }
              }


              // check if staff exists
              if(typeof staffs[results[i].get('name')] === 'undefined'){
                  staffs[results[i].get('name')] = {};
              }

              // check if totalworkminutes exists
              if(staffs[results[i].get('name')].totalWorkMinutes){
                  var hours = staffs[results[i].get('name')].totalWorkMinutes;
                  staffs[results[i].get('name')].totalWorkMinutes = hours + totalWorkMilliseconds/60000
              }else{
                  staffs[results[i].get('name')].totalWorkMinutes = totalWorkMilliseconds/60000
              }

              // chcke if requiredworkminutes exists
              if(staffs[results[i].get('name')].requiredWorkMinutes){
                console.log('here')
                  var hours = staffs[results[i].get('name')].requiredWorkMinutes;
                  staffs[results[i].get('name')].requiredWorkMinutes = hours + requiredWorkMinutes
              }else{
                  staffs[results[i].get('name')].requiredWorkMinutes = requiredWorkMinutes
              }

              // check if working records exists
              if(staffs[results[i].get('name')].workingRecords){
                staffs[results[i].get('name')].workingRecords.push(workingRecord)
              }else{
                staffs[results[i].get('name')].workingRecords = [];
                staffs[results[i].get('name')].workingRecords.push(workingRecord)
              }
          }

          for (var staff in staffs) {
            if (staffs.hasOwnProperty(staff)) {
                staffs[staff].staffName = staff;
                self.state.staffs.push(staffs[staff]);
            }
          }

          console.log(self.state.staffs);
          self.setState({
              staffs: self.state.staffs
          })

      })



  },


  render() {
    return (
      <DocumentTitle title="Search">
        <section className="search-page">
          <nav>
                    <div className={classNames('nav-wrapper','teal','lighten-2')}>
                      <a href="#" className={classNames('brand-logo','center')}>Dr.Wu's Clinic</a>
                    </div>
          </nav>

          <div className={classNames('card','searchSection')}>
            <input className='nameInput' type='text' onChange={this.setSearchName} />
            <Calendar
            format="MM/DD/YYYY"
            closeOnSelect={true}
            onChange={this.setStartDate}
            placeholder='Please enter start date'
            date={this.state.startDate}
            />
            <Calendar
            format="MM/DD/YYYY"
            closeOnSelect={true}
            onChange={this.setEndDate}
            placeholder='Please enter end date'
            date={this.state.endDate}
            />
            <a className={classNames('searchButton','waves-effect','waves-light','btn')} onClick={this.search}><i className={classNames('material-icons', 'right')}>search</i>Search</a>
          </div>
          {this.state.staffs.map(function(staff){
              return(
                  <StaffTimeCard staff={staff} />
              )
          }.bind(this))}

        </section>
      </DocumentTitle>
    );
  }

});

export default SearchPage;