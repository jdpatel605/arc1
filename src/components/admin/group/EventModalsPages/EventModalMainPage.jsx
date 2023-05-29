import React, {useEffect, useContext, useState, useRef} from "react";
import moment from 'moment';
import {default as momentTz} from 'moment-timezone';
import DatePicker from "react-datepicker";
import CreatableSelect from 'react-select/creatable';
import {useDispatch, useSelector} from "react-redux";
import EventParticipantsPage from './EventParticipantsPage';
import {createAdminEventRequest, editAdminEventRequest} from "../../../../store/actions";
import {EventContext} from '../EventContext';
import Spinner from './../../../spinner';
import "react-datepicker/dist/react-datepicker.css";
import {Helper} from './../../../../utils/helper';
import {ChevronRightIcon} from "../../../../utils/Svg";
import {Logger} from './../../../../utils/logger';
import Switch from "react-switch";
import Select from 'react-select';
import { useAlert } from "react-alert";

const dateFormat = "YYYY-MM-DD";
const minEventDate = new Date(Helper.formatDate());
const occurList = [{label: 1, value: 1}, {label: 2, value: 2}, {label: 3, value: 3}, {label: 4, value: 4}, {label: 5, value: 5}, {label: 6, value: 6}, {label: 7, value: 7}, {label: 8, value: 8}, {label: 9, value: 9}, {label: 10, value: 10}, {label: 11, value: 11}, {label: 12, value: 12}, {label: 13, value: 13}, {label: 14, value: 14}, {label: 15, value: 15}]

const fileLocation = "src\\components\\events\\EventModalsPages\\EventModalMainPage.jsx";

const EventModalMainPage = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const {eventCreateLoading, eventCreateError, eventCreateFlag} = useSelector(({adminGroup}) => adminGroup);
  const {
    eventDetails, setEventDetails, setCurrentPage, handleHideEventModal, activeTab, eventEditMode, editEventId,
    validationErrors, setValidationErrors, setActiveTab, showEventModal
  } = useContext(EventContext);
  const [validForm, setValidForm] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [uniqueEventName, setUniqueEventName] = useState(false);
  const [eventStartTimeOptions, setEventStartTimeOptions] = useState([]);
  const [eventEndTimeOptions, setEventEndTimeOptions] = useState([]);
  const [disableDate, setDisableDate] = useState(false);
  const [focusDate, setFocusDate] = useState(false);
  const [focusStartTime, setFocusStartTime] = useState(false);
  const [focusEndTime, setFocusEndTime] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [recurring, setRecurring] = useState('');
  const [defaultRecurringData, defaultRecurring] = useState([]);
  const [recurringListData, recurringList] = useState([]);
  const [occurances, setOccurances] = useState('');
  const [defaultOccurancesData, defaultOccurances] = useState([]);
  const [occurancesListData, occurancesList] = useState(occurList);
  const [customeDay, setCustomeDay] = useState([]);
  const [weekDays, setWeekDays] = useState([]);
  const [dayError, isDayError] = useState(true);
  const [repeatEvent, setRepeatEvent] = useState(false);
  const currentDateStr = momentTz().tz(Helper.getTimeZone()).format(dateFormat);
  const currentTimeStr = momentTz().tz(Helper.getTimeZone()).format('HH:mm:00');
  const eventNameRef = useRef(null)

  useEffect(() => {
    if(showEventModal === true) {
      console.log(eventDetails);
      setIsRepeat(eventDetails.repeat);
      setRepeatEvent(eventDetails.repeat);
      recurringList(eventDetails?.listRecurring);
      if(eventDetails?.customeDay && eventDetails?.customeDay.length !== 0) {
        setCustomeDay(eventDetails?.customeDay);
        setWeekDays(eventDetails?.weekDays);
        isDayError(false);
      }
      if(eventDetails.recurring) {
        defaultRecurring(eventDetails.recurring);
        setRecurring(eventDetails?.recurring?.value);
      }
      if(eventDetails.recurring) {
        defaultOccurances(eventDetails.occurance);
        setOccurances(eventDetails?.occurance?.value);
      }
      eventNameRef.current.focus()
    }
  }, [showEventModal])
  // Hook, when edit mode is enabled; add time slots for start and end time elements
  useEffect(() => {

    try {
      // Disabled date if less than today
      if(eventEditMode === true) {
        const date = moment(eventDetails.date).format('YYYY-MM-DD');
        handleAddTimeSlots('startTime', '', date);
        const eventDate = moment(eventDetails.date)
        const diffDays = eventDate.diff(dateTimeTz(), 'days');
        if(diffDays < 0) {
          setDisableDate(true);
        }
      } else {
        if(eventDetails.startTime.value) {
          handleAddTimeSlots('endTime', eventDetails.startTime.value);
          if(eventDetails.endTime.value) {
            setEventDetails(preProps => ({...preProps, endTime: eventDetails.endTime}));
            setValidationErrors(prevProps => ({...prevProps, endTime: {valid: true, message: ''}}));
          }
        }
      }

    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:Hook'})
    }

  }, [eventEditMode])

  const dateTimeTz = (dateTime = '') => {

    try {
      const tz = Helper.getTimeZone()
      let dateTimeTzObj = momentTz().tz(tz);
      if(dateTime) {
        dateTimeTzObj = momentTz(dateTime).tz(tz);
      }

      return dateTimeTzObj;
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'dateTimeTz'})
    }

  }

  // Manual validation
  useEffect(() => {
    try {

      const validFieldCount = (eventEditMode === true) ? 4 : 5;
      let validCount = 0;

      for(const property in validationErrors) {
        if(validationErrors[property].valid === true) {
          validCount++;
        }
      }
      if(validCount >= validFieldCount) {
        setValidForm(true)
        validationErrors.eventHost = { valid: true, message: '' }
        setShowErrors(false)
      } else {
        setValidForm(false)
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:Hook:ManualValidation'})
    }


  }, [validationErrors]);

  const validateField = (field, value = '') => {

    try {

      // Set event date either today or event date field value
      const currentDateTimeTz = dateTimeTz();
      let eventDate = dateTimeTz();
      if(field === 'date' && value !== null) {
        const eDate = dateTimeTz(value).format("YYYY-MM-DD");
        let eTime = "00:00:00";
        if(eventDetails.startTime.value) {
          eTime = eventDetails.startTime.value
        }
        eventDate = Helper.convertDateTz(`${eDate} ${eTime}`, true);
      } else if(field === 'startTime' && value) {
        if(eventDetails.date) {
          eventDate = Helper.convertDateTz(`${moment(eventDetails.date).format(dateFormat)} ${value}`, true);
        } else {
          eventDate = Helper.convertDateTz(`${currentDateStr} ${value}`, true);
        }
      }

      // Validate event name
      if(field === 'eventName') {
        if(value.trim() === '') {
          setValidationErrors(prevProps => ({
            ...prevProps, eventName: {valid: false, message: 'Event Name is required'}
          }));
        } else if(isNaN(value) === false) {
          setValidationErrors(prevProps => ({
            ...prevProps, eventName: {valid: false, message: 'Event Name must content letter also'}
          }));
        } else {
          setValidationErrors(prevProps => ({...prevProps, eventName: {valid: true, message: ''}}));
        }
      }
      // Validate event host
      if (field === 'eventHost') {
        if (eventDetails.eventGroupHost.id === '') {
          setValidationErrors(prevProps => ({
            ...prevProps, eventName: { valid: false, message: 'Event Name is required' }
          }));
        } else {
          setValidationErrors(prevProps => ({ ...prevProps, eventName: { valid: true, message: '' } }));
        }
      }
      if(field === 'date') {
        if(value === null) {
          setValidationErrors(prevProps => ({
            ...prevProps, date: {valid: false, message: 'Date is required'}
          }));
        } else {
          setValidationErrors(prevProps => ({...prevProps, date: {valid: true, message: ''}}));
        }
        // Validate start time if has value
        if(eventDetails.startTime.value) {
          const startTimeDiff = eventDate.diff(currentDateTimeTz, 'minutes');
          if(startTimeDiff < 0) {
            setValidationErrors(prevProps => ({
              ...prevProps, startTime: {valid: false, message: 'Start Time must be in the future'}
            }));
          } else {
            setValidationErrors(prevProps => ({...prevProps, startTime: {valid: true, message: ''}}));
          }
        }
      }
      if(field === 'startTime') {
        const startTimeDiff = eventDate.diff(currentDateTimeTz, 'minutes');
        if(value === '') {
          setValidationErrors(prevProps => ({
            ...prevProps, startTime: {valid: false, message: 'Start Time is required'}
          }));
        } else if(startTimeDiff < 0) {
          setValidationErrors(prevProps => ({
            ...prevProps, startTime: {valid: false, message: 'Start Time must be in the future'}
          }));
        } else {
          setValidationErrors(prevProps => ({...prevProps, startTime: {valid: true, message: ''}}));
        }
      }
      if(field === 'endTime') {
        if(value === '') {
          setValidationErrors(prevProps => ({
            ...prevProps, endTime: {valid: false, message: 'End Time is required'}
          }));
        } else {
          setValidationErrors(prevProps => ({...prevProps, endTime: {valid: true, message: ''}}));
        }
      }

    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'validateField'})
    }


  }
  
  const allValidateField = (value) => {
    if (value.eventName === '') {
      console.log('name');
      validationErrors.eventName = { valid: false, message: 'Event Name is required' }
      setShowErrors(true);
    }

    if (eventDetails.eventGroupHost.id === '') {
      console.log('host');
      validationErrors.eventHost = { valid: false, message: 'Event Host is required' }
      setShowErrors(true);
    }

    if (eventDetails.date === '') {
      console.log('date');
      validationErrors.date = { valid: false, message: 'Date is required' }
      setShowErrors(true);
    }

    if (Object.keys(eventDetails.startTime).length === 0 && eventDetails.startTime.constructor === Object) {
      console.log('s time');
      validationErrors.startTime = { valid: false, message: 'Start Time is required' }
      setShowErrors(true);
    }

    if (Object.keys(eventDetails.endTime).length === 0 && eventDetails.endTime.constructor === Object) {
      console.log('e time');
      validationErrors.endTime = { valid: false, message: 'End Time is required' }
      setShowErrors(true);
    }

    if (value.eventName !== '' && eventDetails.eventGroupHost.id !== '' && eventDetails.date !== '' && (Object.keys(eventDetails.startTime).length !== 0 && eventDetails.startTime.constructor === Object) && (Object.keys(eventDetails.endTime).length !== 0 && eventDetails.endTime.constructor === Object)) {
      const date = moment(eventDetails.date).format(dateFormat);
      const beginsAt = moment(`${date} ${eventDetails.startTime.value}`).format("YYYY-MM-DD HH:mm:00");
      const endsAt = moment(`${date} ${eventDetails.endTime.value}`).format("YYYY-MM-DD HH:mm:00");

      const beginsAtTz = Helper.convertDateTz(beginsAt);
      const endsAtTz = Helper.convertDateTz(endsAt);

      var frequency = recurring;
      var selectedDay = [];
      if(recurring === 'weekly_days') {
        var selectedDay = [1,1,1,1,1,0,0];
      }
      else if(recurring === 'custom') {
        var frequency = 'weekly_days';
        const daysArray = ['m', 't', 'w', 'th', 'f', 'sa', 'su'];
        var tempFre = [];
        daysArray.map((item,key) => {
          if(customeDay.includes(item)) {
            tempFre.push(1);
          }
          else {
            tempFre.push(0);
          }
        });
        var selectedDay = tempFre;
      }

      if(recurring === 'custom' && selectedDay.length === 0) {
        
      }

      const payload = {
        id: eventDetails.eventGroupHost.id,
        hostType: eventDetails.eventGroupHost.hostType,
        data: {
          name: eventDetails.eventName,
          description: eventDetails.description,
          begins_at: beginsAtTz,
          ends_at: endsAtTz,
          type: eventDetails.type,
          frequency: frequency,
          frequencyDay: selectedDay,
          repeat_amount: occurances,
          visibility: eventDetails.visibility,
        }
      };

      if(eventEditMode === false) {
        dispatch(createAdminEventRequest(payload));
      } else {
        payload.id = editEventId;
        dispatch(editAdminEventRequest(payload));
      }
    }
  }

  const nearestToFive = num => {
    try {
      const minute = Math.ceil(num / 15) * 15;
      if(minute === 60) {
        return 55;
      } else {
        return minute;
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'nearestToFive'})
    }
  };

  const handleUpdateEventDetails = (e) => {

    try {
      const {name, value} = e.target;
      setEventDetails(prevProps => ({...prevProps, [name]: value}));

      validateField(name, value);
      setUniqueEventName(false);
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'handleUpdateEventDetails'})
    }

  }

  const submitEventForm = (e) => {
    if(validForm && e.key == 'Enter') {
      handelCreateGroup()
    }
  }

  const handelCreateGroup = e => {
    try {
      allValidateField(eventDetails);
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'handelCreateGroup'})
    }

  }

  const displayErrorMessage = data => {
    if(typeof data === 'object') {
      return <span className="text-error">{data.message}</span>
    } else {
      return <span className="text-error">{data}</span>
    }
  }

  useEffect(() => {
    if(eventCreateError !== "") {
      setUniqueEventName(true);
    } else {
      setUniqueEventName(false);
    }
  }, [eventCreateError]);

  const handleDateChange = date => {
    try {
      const dayName = moment(date).format('dddd');
      const dayNo = moment(date).format('Do');
      const onlyDate = moment(date).format('YYYY-MM-DD');
      setEventDetails(prevProps => ({...prevProps, date}));
      const dateTime = Helper.convertDateTz(`${moment(date).format(dateFormat)} ${dateTimeTz().format("HH:mm:ss")}`);
      const finalDate = dateTimeTz(dateTime);
      handleAddTimeSlots('startTime', finalDate, onlyDate);
      validateField('date', finalDate);

      const recurList = [{label: 'Daily', value: 'daily'}, {label: 'Everyday on Weekdays', value: 'weekly_days'}, {label: 'Weekly on ' + dayName, value: 'weekly'}, {label: 'Monthly on the ' + dayNo, value: "monthly"}, {label: 'Custom', value: 'custom'}];
      // const recurList = [{label: 'Daily', value: 'daily'}, {label: 'Weekly on ' + dayName, value: 'weekly'}, {label: 'Monthly on the ' + dayNo, value: "monthly"}];
      recurringList(recurList);
      setEventDetails(prevProps => ({...prevProps, listRecurring: recurList}));
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'handleDateChange'})
    }
  }

  const handleStartTimeChange = (newValue, actionMeta) => {
    try {
      if(actionMeta.action === "create-option") {
        const newStartDate = moment(`${currentDateStr} ${newValue.value}`);
        const validTime = newStartDate.format('HH:mm a');
        if(validTime !== 'Invalid date') {
          const customValue = {
            value: newStartDate.format(`HH:mm:00`),
            label: newStartDate.format(`hh:mm a`)
          };
          setEventDetails(prevProps => ({...prevProps, startTime: customValue}));
          handleAddTimeSlots('endTime', customValue.value);
          validateField('startTime', customValue.value);
        } else {
          validateField('startTime', '');
        }
      } else {
        setEventDetails(prevProps => ({...prevProps, startTime: newValue}));
        let labelSplit = newValue.label.split(' ');
        handleAddTimeSlots('endTime', newValue.value, '', labelSplit[0])
        validateField('startTime', newValue.value);
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'handleStartTimeChange'})
    }

  };

  const handleEndTimeChange = (newValue, actionMeta) => {
    try {
      if(actionMeta.action === "create-option") {
        const newEndDate = moment(`${currentDateStr} ${newValue.value}`);
        const newStartDate = moment(`${currentDateStr} ${eventDetails.startTime.value}`);
        const minDiff = newEndDate.diff(newStartDate, 'minutes'); 
        const validTime = newEndDate.format('HH:mm a');

        if(validTime !== 'Invalid date' && eventDetails.startTime.value && minDiff > 0) {

          let diffLabel = ''
          const hours = Helper.minutesToHours(minDiff);
          if(hours < 60) {
            diffLabel = ` (${hours} min)`;
          } else {
            diffLabel = ` (${hours} hrs)`;
          }

          const customValue = {
            value: newEndDate.format(`HH:mm:00`),
            label: `${newEndDate.format('hh:mm a')} ${diffLabel}`
          };
          setEventDetails(prevProps => ({...prevProps, endTime: customValue}));
          validateField('endTime', customValue.value);
        } else {
          validateField('endTime', '');
        }
      } else {
        setEventDetails(prevProps => ({...prevProps, endTime: newValue}));
        validateField('endTime', newValue.value);
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'handleEndTimeChange'})
    }
  };

  const handleAddTimeSlots = (type = 'startTime', timeValue = '00:00:00', date = '', label = '') => {
    try {
      let dateValue = moment();
      if(date === currentDateStr) {
        dateValue = moment(`${currentDateStr} ${currentTimeStr}`);
      }
      if(type === 'endTime') {
        let valueTime = timeValue;
        let timeSplit = timeValue.split(':');
        if(label === 'Create' && (parseInt(timeSplit[0]) < 7)) {
          const newTime = parseInt(timeSplit[0])+12;
          valueTime = newTime+':'+timeSplit[1];
        }
        dateValue = moment(`${currentDateStr} ${valueTime}`);
        resetEventStartEndTime('endTime');
        setValidationErrors(prevProps => ({
          ...prevProps, endTime: {valid: false, message: ''}
        }));
      }
      const nextDayTmp = moment(dateValue).add('1', 'days').format('YYYY-MM-DD 07:00:00');
      const minuteBreathSlot = Math.abs(dateValue.diff(nextDayTmp, 'minutes'));
      if(minuteBreathSlot >= 15) {
        const currentMinute = moment(dateValue).format("mm");
        let currentHour = moment(dateValue).format("HH");
        const nearestMinute = nearestToFive(currentMinute);
        let currentDateObj = moment(dateValue).format(`YYYY-MM-DD 07:00:00`);
        const timeSlots = [];
        if (nearestMinute === 55) {
          currentHour = parseInt(currentHour)+1;
          if(date === currentDateStr) {
            currentDateObj = moment(dateValue).format(`YYYY-MM-DD ${currentHour}:00:00`);
          }
          if (type === 'endTime') {
            currentDateObj = moment(dateValue).format(`YYYY-MM-DD ${currentHour}:00:00`);
          }
        }
        else {
          if(date === currentDateStr) {
            currentDateObj = moment(dateValue).format(`YYYY-MM-DD HH:${nearestMinute}:00`);
          }
          if (type === 'endTime') {
            currentDateObj = moment(dateValue).format(`YYYY-MM-DD HH:${nearestMinute}:00`);
          }
        }
        const nextDayObj = moment(dateValue).add('1', 'days').format('YYYY-MM-DD 07:00:00');
        const currentDate = moment(currentDateObj);
        const nextDay = moment(nextDayObj);
        let diffLabel = '';

        if(type === 'endTime') {
          currentDate.add('15', 'minutes');
          const totalMinutes = currentDate.diff(dateValue, 'minutes');
          const hours = Helper.minutesToHours(totalMinutes);
          if(hours < 60) {
            diffLabel = ` (${hours} min)`;
          } else {
            diffLabel = ` (${hours} hrs)`;
          }
        }

        for(let index = 1; index <= 100; index++) {
          if(currentDate < nextDay) {
            timeSlots.push({
              value: currentDate.format(`HH:mm:00`),
              label: currentDate.format(`hh:mm a`) + diffLabel
            });
            currentDate.add('15', 'minutes');
            if(type === 'endTime') {
              const totalMinutes = currentDate.diff(dateValue, 'minutes');
              const hours = Helper.minutesToHours(totalMinutes);
              if(hours < 60) {
                diffLabel = ` (${hours} min)`;
              } else {
                diffLabel = ` (${hours} hrs)`;
              }
            }
          }
        }
        if(type === 'startTime') {
          setEventStartTimeOptions(timeSlots);
        } else {
          setEventEndTimeOptions(timeSlots);
        }
      }
      else {
        setEventStartTimeOptions([]);
        setEventEndTimeOptions([]);
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'handleAddTimeSlots'})
    }
  }

  const resetEventStartEndTime = (eventTime = '') => {
    if(eventTime === 'startTime') {
      setEventDetails(prevProps => ({...prevProps, startTime: {}}));
      setEventStartTimeOptions([]);
    } else if(eventTime === 'endTime') {
      setEventDetails(prevProps => ({...prevProps, endTime: {}}));
      setEventEndTimeOptions([]);
    } else {
      setEventDetails(prevProps => ({...prevProps, startTime: {}, endTime: {}}));
      setEventStartTimeOptions([]);
      setEventEndTimeOptions([]);
    }
  }

  const showGroupHostPage = () => {
    /* if(eventEditMode === false) {
      setCurrentPage('groupHostPage')
    } */
  }

  const changeRepeat = (checked) => {
    if(!eventDetails?.date) {
      alert.error('Please select date first');
    }
    else {
      setIsRepeat(checked)
      setRepeatEvent(checked);
      if(!checked) {
        defaultRecurring([]);
        setRecurring('');
        defaultOccurances([]);
        setOccurances('');
        setEventDetails(prevProps => ({...prevProps, ['recurring']: ''}));
        setEventDetails(prevProps => ({...prevProps, ['occurance']: ''}));
      }
      setEventDetails(prevProps => ({...prevProps, ['repeat']: checked}));
    }
  };
  
  const changeRecurring = (selected) => {
    defaultRecurring(selected);
    setRecurring(selected.value);
    if(selected.value === 'custom') {
      setValidForm(false);
    }
    else {
      const validFieldCount = (eventEditMode === true) ? 4 : 5;
      let validCount = 0;

      for(const property in validationErrors) {
        if(validationErrors[property].valid === true) {
          validCount++;
        }
      }
      if(validCount >= validFieldCount) {
        setValidForm(true);
      }
    }
    setEventDetails(prevProps => ({...prevProps, ['recurring']: selected}));
  }

  const focusRecurring = value => {
    if(recurring === '') {
      setRecurring(' ');
    }
  }

  const focusOutRecurring = value => {
    if(recurring === ' ') {
      setRecurring('');
    }
  }

  const changeOccurances = (selected) => {
    defaultOccurances(selected);
    setOccurances(selected.label);
    setEventDetails(prevProps => ({...prevProps, ['occurance']: selected}));
  }

  const focusOccurances = value => {
    if(occurances === '') {
      setOccurances(' ');
    }
  }

  const focusOutOccurances = value => {
    if(occurances === ' ') {
      setOccurances('');
    }
  }

  const handleDayChange = event => {
    const target = event.target;
    var value = target.value;
    
    if(target.checked) {
      // setWeekDays(prevProps => ({ ...prevProps, [value]: value }));
      weekDays[value] = value;
      customeDay.push(value);
    } else {
      weekDays.splice(value, 1);
      delete weekDays[value];
      for(var i = 0; i < customeDay.length; i++) {
        if(customeDay[i] === value) {
          customeDay.splice(i, 1);
        }
      }
    }
    if(customeDay.length === 0) {
      isDayError(true);
      setValidForm(false);
    }
    else {
      isDayError(false);
      const validFieldCount = (eventEditMode === true) ? 4 : 5;
      let validCount = 0;

      for(const property in validationErrors) {
        if(validationErrors[property].valid === true) {
          validCount++;
        }
      }
      if(validCount >= validFieldCount) {
        setValidForm(true);
      }
    }
    setEventDetails(prevProps => ({...prevProps, ['weekDays']: weekDays}));
    setEventDetails(prevProps => ({...prevProps, ['customeDay']: customeDay}));
  }

  return (
    <>
      <div className="modal-header justify-content-between pt-0">
        <div>
          <h4 className="modal-title">{eventEditMode === false ? 'Create' : 'Edit'} Event</h4>
          <label>Select the options below in order to {eventEditMode === false ? 'create' : 'edit'} your event.</label>
        </div>
      </div>
      <div className="tab-section">
        <ul id="tabs" className="nav nav-tabs" role="tablist">
          <li className="nav-item w-50">
            <a onClick={() => setActiveTab('eventInfo')} id="tab-screen-A" href="#eventInfo" className={`nav-link ${activeTab === 'eventInfo' && 'active'}`} data-toggle="tab" role="tab">Event Info</a>
          </li>
          <li className="nav-item w-50">
            {
              eventEditMode === true
                ?
                <a onClick={() => setActiveTab('eventParticipants')} id="tabEventParticipants" href="#eventParticipants" className={`nav-link ${activeTab === 'eventParticipants' && 'active'}`} data-toggle="tab" role="tab">Event Participants</a>
                :
                <a href="#/" className="nav-link disable-link">Event Participants</a>
            }
          </li>
        </ul>
        <div id="content" className="tab-content" role="tablist">
          <div id="eventInfo" className={`card tab-pane fade ${activeTab === 'eventInfo' && 'active show'}`} role="tabpanel" aria-labelledby="tab-screen-A">
            <div className="card-header" role="tab" id="screen-heading-A">
              <h5 className="mb-0">
                <a data-toggle="collapsed" href="#collapse-A" aria-expanded="false" aria-controls="collapse-A">
                  Event Info
                </a>
              </h5>
            </div>
            <div id="collapse-A" className="collapse" data-parent="#content" role="tabpanel" aria-labelledby="screen-heading-A">
              <form className="form-sec" noValidate="" onSubmit={(e) => handelCreateGroup(e)}>
                <div className="mt-2">
                  <p>Event Info</p>
                  <div>
                    <div className="form-group">
                      <div className={`bg-black-500 ${validationErrors.eventName.valid === false && 'err-div'}`}>
                        <input
                          ref={eventNameRef}
                          type="text"
                          name="eventName"
                          className={`form-control`}
                          value={eventDetails.eventName}
                          onChange={(e) => handleUpdateEventDetails(e)}
                          onKeyPress={(e) => submitEventForm(e)}
                          maxLength="64"
                          required
                        />
                        <label className="txt-label">Event Name</label>
                      </div>
                      {validationErrors.eventName.valid === false && displayErrorMessage(validationErrors.eventName.message)}
                      {(uniqueEventName === true && validationErrors.eventName.valid === true) && displayErrorMessage(eventCreateError)}
                    </div>
                    <div className="form-group">
                      <div className="bg-black-500">
                        <textarea
                          className="form-control textDescription"
                          name="description"
                          style={{height: 100}}
                          defaultValue={eventDetails.description}
                          onChange={(e) => handleUpdateEventDetails(e)}
                          maxLength="500"
                        />
                        <label className="txt-label">Event Description</label>
                      </div>
                    </div>
                    <p>Event Host</p>
                    <div className="form-group">
                      <div className="bg-black-500 setting-box" onClick={() => showGroupHostPage()}>
                        <span className={`setting-text ${eventDetails.eventGroupHost.id && 'text-white font-weight-bold'} `}>{eventDetails.eventGroupHost.name}</span>
                        {
                          (eventEditMode === false) &&
                          <a className="click-btn" href="#/"></a>
                        }
                      </div>
                    </div>
                    <p>Event Details</p>
                    <div className="d-flex justify-content-between">
                      <div className="mr-1 w-33">
                        <div className="form-group event-date">
                          <div className={`bg-black-500 ${validationErrors.date.valid === false && 'err-div'}`} style={{overflow: 'visible', zIndex: 1}}>
                            <DatePicker
                              name="date"
                              minDate={minEventDate}
                              autoComplete="false"
                              className="form-control"
                              selected={eventDetails.date}
                              dateFormat="MMM dd, yyyy"
                              onChange={date => handleDateChange(date)}
                              showMonthDropdown
                              showYearDropdown
                              disabled={disableDate}
                              onFocus={() => setFocusDate(true)}
                              onBlur={() => setFocusDate(false)}
                            />
                            <label className={`txt-label ${(eventDetails.date || focusDate) && 'top-5'}`}>Date</label>
                          </div>
                          {(validationErrors.date.valid === false) && displayErrorMessage(validationErrors.date.message)}
                        </div>
                      </div>
                      <div className="ml-1 mr-1 w-33">
                        <div className="form-group">
                          <div className={`bg-black-500 time-display ${validationErrors.startTime.valid === false && 'err-div'}`} style={{overflow: 'visible', zIndex: 1}}>
                            <CreatableSelect
                              //menuIsOpen= {true}
                              onChange={handleStartTimeChange}
                              options={eventStartTimeOptions}
                              value={eventDetails.startTime}
                              onFocus={() => setFocusStartTime(true)}
                              onBlur={() => setFocusStartTime(false)}
                            />
                            <label className={`txt-label ${(eventDetails.startTime.value || focusStartTime) && 'top-5'}`}>Start Time</label>
                          </div>
                          {(validationErrors.startTime.valid === false) && displayErrorMessage(validationErrors.startTime.message)}
                        </div>
                      </div>
                      <div className="ml-1 w-33">
                        <div className="form-group">
                          <div className={`bg-black-500 time-display ${(validationErrors.endTime.valid === false && validationErrors.endTime.message !== '') && 'err-div'}`} style={{overflow: 'visible', zIndex: 1}}>
                            <CreatableSelect
                              isSearchable= {false}
                              onChange={handleEndTimeChange}
                              options={eventEndTimeOptions}
                              value={eventDetails.endTime}
                              onFocus={() => setFocusEndTime(true)}
                              onBlur={() => setFocusEndTime(false)}
                            />
                            <label className={`txt-label ${(eventDetails.endTime.value || focusEndTime) && 'top-5'}`}>End Time</label>
                          </div>
                          {(validationErrors.endTime.valid === false) && displayErrorMessage(validationErrors.endTime.message)}
                        </div>
                      </div>
                    </div>
                    {!eventEditMode &&
                    <div className="repeat-box">
                      <div className="repeat-box-switch">
                      <p className="repeat-heading">{isRepeat ? 'Does Repeat' : "Does Not Repeat"}</p>
                        <Switch
                          onChange={(e) => changeRepeat(e)}
                          checked={isRepeat}
                          handleDiameter={18}
                          checkedIcon={false}
                          uncheckedIcon={false}
                          offColor="#2a2e32"
                          onColor="#0f9279"
                          offHandleColor="#454b52"
                          onHandleColor="#18b99a"
                          boxShadow="none"
                          activeBoxShadow="none"
                          height={25}
                          width={40}
                          className="react-switch"
                        />
                      </div>
                      {repeatEvent === true &&
                        <>
                          <div className="form-group row responsive-col repeat-box-option pb-2">
                            <div className="col-sm-6 pl-0">
                              <div className="bg-black-600 bg-focus">
                                <Select
                                  // menuIsOpen={true}
                                  isSearchable={false}
                                  value={defaultRecurringData}
                                  onChange={changeRecurring}
                                  onMenuOpen={focusRecurring}
                                  onMenuClose={focusOutRecurring}
                                  options={recurringListData}
                                  placeholder=""
                                />
                                <label className={recurring ? 'top-5' : ''}>Recurring</label>
                              </div>
                            </div>
                            <div className="col-sm-6 pr-0">
                              <div className="bg-black-600 bg-focus">
                                <Select
                                  isSearchable={false}
                                  value={defaultOccurancesData}
                                  onChange={changeOccurances}
                                  onMenuOpen={focusOccurances}
                                  onMenuClose={focusOutOccurances}
                                  options={occurancesListData}
                                  placeholder=""
                                />
                                <label className={occurances ? 'top-5' : ''}># Occurrences</label>
                              </div>
                            </div>
                          </div>
                          {recurring === 'custom' &&
                          <>
                            <div className="select-size">
                              <p className="head-text">Select which days you would like to repeat</p>
                              <input type="checkbox" name="weekday[]" id="su" value="su" onChange={(e) => handleDayChange(e)} checked={eventDetails?.weekDays?.su ? true : false}/>
                              <input type="checkbox" name="weekday[]" id="m" value="m" onChange={(e) => handleDayChange(e)} checked={eventDetails?.weekDays?.m ? true : false}/>
                              <input type="checkbox" name="weekday[]" id="t" value="t" onChange={(e) => handleDayChange(e)} checked={eventDetails?.weekDays?.t ? true : false}/>
                              <input type="checkbox" name="weekday[]" id="w" value="w" onChange={(e) => handleDayChange(e)} checked={eventDetails?.weekDays?.w ? true : false}/>
                              <input type="checkbox" name="weekday[]" id="th" value="th" onChange={(e) => handleDayChange(e)} checked={eventDetails?.weekDays?.th ? true : false}/>
                              <input type="checkbox" name="weekday[]" id="f" value="f" onChange={(e) => handleDayChange(e)} checked={eventDetails?.weekDays?.f ? true : false}/>
                              <input type="checkbox" name="weekday[]" id="sa" value="sa" onChange={(e) => handleDayChange(e)} checked={eventDetails?.weekDays?.sa ? true : false}/>

                              <label htmlFor="su">Su</label>
                              <label htmlFor="m">M</label>
                              <label htmlFor="t">T</label>
                              <label htmlFor="w">W</label>
                              <label htmlFor="th">Th</label>
                              <label htmlFor="f">F</label>
                              <label htmlFor="sa">Sa</label>
                            </div>
                            {dayError &&
                              <div className="days-error">
                                <span className="error">Please select atleast one day</span>
                              </div>
                            }
                          </>
                          }
                          
                        </>
                      }
                    </div>
                    }
                    <div className="form-group">
                      <div className="bg-black-500 setting-box" onClick={() => setCurrentPage('advanceSettingsPage')}>
                        <span className="setting-text text-gray">Advanced Settings</span>
                        <a className="click-btn" href="#/">{ChevronRightIcon}</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="btn-sec pl-2 pr-2">
                  <span className="btn btn-medium md-box btn-black clr-white" onClick={() => handleHideEventModal()}>Cancel</span>
                  <button type="button"
                    onClick={handelCreateGroup}
                    className={`btn btn-medium md-box btn-submit btn-green`}
                    disabled={eventCreateLoading}
                  >
                    {eventEditMode === false ? 'Create Event' : 'Save'} {eventCreateLoading === true && <Spinner />}
                  </button>
                </div>
              </form>
            </div>
          </div>
          {eventEditMode === true && <EventParticipantsPage />}
        </div>
      </div>
    </>
  );

}

export default EventModalMainPage;
