import React from "react";
import { useState } from "react";
import Box from "./Components/Box/Box";
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import PlannerMain from './PlannerMain.css';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { createFilterOptions } from "@mui/material/Autocomplete";
import firebase from 'firebase/compat/app';
import { db } from "../authentication/firebase-config";
import {
  setDoc,
  doc,
  onSnapshot, 
  updateDoc,
} from "firebase/firestore";



//NUSMODS API to retrieve the data for autocomplete from
const API_NUSMODS_URL = 'https://api.nusmods.com/v2/2021-2022/moduleList.json';

//NUSMODS API to retrieve the data for each module
const API_MODULE_INFO = 'https://api.nusmods.com/v2/2021-2022/modules/';

/**
 * function to render the planner page along with all of its components
 */
export default function Planner() {

  //the grade entered of planned module to be added
  const [gradePlanned, setGradePlanned] = useState('');
 
  //the module planned to be added
  const [Module, setModule] = useState([]);

  //module code of planned module to be added
  const [modCode, setModCode] = useState('');

  //data from the API set for Autocomplete information
  const [data, setData] = React.useState([]);

  //set preclusion, prerequsiites, corequisites and eligibleMods
  const [prerequisiteMods, setPrerequisiteMods] = React.useState([]);
  const [preclusionMods, setPreclusionMods] = React.useState([]);
  const [corequisiteMods, setCorequisiteMods] = React.useState([]);
  const [eligibleMods, setEligibleMods] = React.useState([]);

  //truth state of the completion
  const [containsCoreqs, setContainsCoreqs] = React.useState(true);
  const [containsPrereqs, setContainsPrereqs] = React.useState(true);
  const [containsPrecs, setContainsPrecs] = React.useState(false);

  //year and sem of study
  const [ys, setYS] = React.useState('');

  //truth state of selection
  const [selected, setSelected] = React.useState(false);

   //the current user of the module
   const userCurr = firebase.auth().currentUser;

  //string of module planned seperated by semicolon
  let modsPlanned = "";
  
  //set of eligible modules the student is allowed to take (all the preliminary modules are added here)
  //let eligibleMods = ['CS1101S', 'MA1521', 'CS1231S'];


  //the list of warnings to be displayed to user
  const [warnings, setWarnings] = React.useState([]);

  //a cariable to conduct trials with
  const [p, setP] = React.useState('');



//for when the page renders to help set the options for autocomplete
React.useEffect(
  () => {
      fetch(API_NUSMODS_URL)
      .then(res => res.json())
      .then(d => setData(d));
  },[data]);

  
  React.useEffect(()=>{

    if(p){

    const code = p.moduleCode;
    setModCode(code);
    const res = new RegExp(/(\b[A-Z0-9][A-Z0-9]+|\b[A-Z]\b)/g);
    const mods = Module.map(x => x.code);

    
    //preclusion condition to be matched
    const preclusions = p.preclusion;
    let precMods = [];
    
    if(preclusions){
      precMods = preclusions.match(res);
      setPreclusionMods(precMods);
      if(mods.some(element => {
        return precMods.includes(element);})){
        const msg = "PRECLUSIONS ERRORS: Did you finish this preclusions condition? " + preclusions;

        const newWarnings = [
          ...warnings,
          {
           msg: msg,
           isComplete: false

          }
        ];
        setWarnings(newWarnings.filter((v, i, a) => a.indexOf(v) === i));
      }
    }



    //corequisite condition to be matched
    const corequisites = p.corequisite;
    let coreqMods = [];
    
    if(corequisites){
      coreqMods = corequisites.match(res);
      setCorequisiteMods(coreqMods);
      if(coreqMods.every(element => {
        return mods.includes(element);
      })){
        const msg = "COREQUISITE ERRORS: Did you finish this corequisite condition? " + corequisites;

        const newWarnings = [
          ...warnings,
          {
           msg: msg,
           isComplete: false

          }
        ];
        setWarnings(newWarnings);

      }
    }

    //check if prerequisites are matched
    const prerequisites = p.prerequisite;

    if(prerequisites){
    const  prereqArr1 = prerequisites.replaceAll("and", "AND");
    const prereqArr2 = prereqArr1.replaceAll("or", "OR");
    const prereqArr3 = prereqArr2.replaceAll("(", " BO ");
    const prereqArr4 = prereqArr3.replaceAll(")", " BC ");
    const prereqArr = prereqArr4.match(res);
    console.log("HIII");
    console.log(prereqArr);

    const finalArray = prereqArr.map(x=>{
      if(x!=="BO" && x !=="BC" && x!=="AND" && x!== "OR"){
        return mods.includes(x);
      } else {
        return x;
      }
    });

    console.log(finalArray);
    
      if(!eligibleMods.includes(code)){
        const msg = "PREREQUISITE ERRORS: Did you finish this prerequisite condition? " + prerequisites;
        console.log(msg);

        const newWarnings = [
          ...warnings,
          {
           msg: msg,
           isComplete: false

          }
        ];
        setWarnings(newWarnings);

      }
  }
    
     const fulfillReqs = p.fulfillRequirements;
     if(fulfillReqs){
       let newEligibleMods = eligibleMods.concat(fulfillReqs).filter((v, i, a) => a.indexOf(v) === i);
       setEligibleMods(newEligibleMods);
       //userInfo.eligibleMods = eligibleMods;
     }

     //addToList(code); 
}
  
}, [p]);

// React.useEffect(()=>{
//   userInfo.eligibleMods = eligibleMods;
//   userInfo.plannedMods = Module.map(x=>x.code);
//   userInfo.warnings = warnings;
//   updateUser(user.uid);
// }, [warnings, eligibleMods, Module])

  React.useEffect(()=>{

    const code = modCode;
    const mods = Module.map(x => x.code);

    setContainsPrecs(
      mods.some(element => {
           return preclusionMods.includes(element);
      })
    );

    setContainsCoreqs(
      corequisiteMods.every(element => {
        return mods.includes(element);
      })
    );

    setContainsPrereqs(
      eligibleMods.includes(code)
    );


  }, [eligibleMods, corequisiteMods, preclusionMods])


//retrieve data regarding the module
function handleAddition(code){
   const response = fetch(`${API_MODULE_INFO}${code}.json`)
   .then(res => res.json())
   .then(res => setP(res)); 
}

function WarningList(props) {
  const { warnings, setWarnings } = props;

  function handleWarningCompletionToggled(toToggleWarning, toToggleWarningIndex) {
    const newWarnings = [
      ...warnings.slice(0, toToggleWarningIndex),
      {
        msg: toToggleWarning.msg,
        isComplete: !toToggleWarning.isComplete
      },
      ...warnings.slice(toToggleWarningIndex + 1)
    ];
    setWarnings(newWarnings);

  }
  return (
    <table style={{ margin: "0 auto", width: "100%" }}>
          <thead>
            <tr>
              <th>No.</th>
              <th>Warning</th>
              <th>Handled</th>
            </tr>
          </thead>
          <tbody>
            {warnings.map((warns, index) => (
              <tr key={warns.msg}>
                <td>{index + 1}</td>
                <td>{warns.msg}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={warns.isComplete}
                    onChange={() => handleWarningCompletionToggled(warns, index)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  );
}

function addToList(code){
  const newModule = [
    ...Module,
    {
      code: code,

    }
  ];

  setModule(newModule);
}

<Typography>{warnings}</Typography>



  function addModule(code) {
    
    const mods = Module.map(x=>x.code);

    if(mods.includes(code)){
     const msg = "You cannot add the same module twice! " + code;
     console.log(msg);
     alert(msg);
    } else {
      handleAddition(code);
      addToList(code);
      console.log(eligibleMods);
    }
    setSelected(true);

  }

  const handleSubmit = (event) => {
    event.preventDefault();
    addModule(modCode);
  }

  const handleSave = (event) => {
    event.preventDefault();
    updateProfile(firebase.auth().currentUser.uid);

  }

  const [user, setUser] = useState([]);
  function getInfo(){
    if(firebase.auth().currentUser){

      const userI = onSnapshot(doc(db, "users", firebase.auth().currentUser.uid), 
      (doc) => {
        //console.log(doc.data());
        setUser(doc.data());
        });
        return userI;
      } else {
       console.log("no info");
      }
  }

  React.useEffect(()=>{getInfo()}, []);
  

  const updateProfile = async (id) =>{

    const mods = Module.map(x => x.code);
    const userDoc = doc(db, "users", id);

    if(ys==="YEAR 1 SEM 1"){
      const planned = user.Y1S1Planned;
      console.log(planned);
      const confirmed = user.Y1S1Confirmed;
      const newPlanned = planned.concat(mods).filter((v, i, a) => a.indexOf(v) === i);
      const newConfirmed = confirmed.concat(mods).filter((v, i, a) => a.indexOf(v) === i);

      const userNew = {
      email: user.email,
      displayName: user.displayName,
      firstName: user.firstName,
      lastName: user.lastName,
      major: user.major,
      minor: user.minor,
      year: user.year,
      semester: user.semester,
      otherProgrammes: user.otherProgrammes,

      Y1S1Planned: newPlanned,
      Y1S1Confirmed: newConfirmed,
      Y1S1CAP: user.Y1S1CAP,

      Y1S2Planned: user.Y1S2Planned,
      Y1S2Confirmed: user.Y1S2Confirmed,
      Y1S2CAP:user.Y1S2CAP,

      Y2S1Planned: user.Y2S1Planned,
      Y2S1Confirmed: user.Y2S1Confirmed,
      Y2S1CAP:user.Y2S1CAP,

      Y2S2Planned: user.Y2S2Planned,
      Y2S2Confirmed: user.Y2S2Confirmed,
      Y2S2CAP:user.Y2S2CAP,

      Y3S1Planned: user.Y3S1Planned,
      Y3S1Confirmed: user.Y3S1Confirmed,
      Y3S1CAP:user.Y3S1CAP,

      Y3S2Planned: user.Y3S2Planned,
      Y3S2Confirmed: user.Y3S2Confirmed,
      Y3S2CAP: user.Y3S2CAP,

      Y4S1Planned: user.Y4S1Planned,
      Y4S1Confirmed: user.Y4S1Confirmed,
      Y4S1CAP:user.Y4S1CAP,

      Y4S2Planned: user.Y4S2Planned,
      Y4S2Confirmed: user.Y4S2Confirmed,
      Y4S2CAP:user.Y4S2CAP,

      eligibleMods: user.eligibleMods.concat(eligibleMods).filter((v, i, a) => a.indexOf(v) === i),
      currentCAP: user.currentCAP,
      warnings:user.warnings.concat(warnings),
      }
      await updateDoc(userDoc, userNew);
    }

    if(ys==="YEAR 1 SEM 2"){

      const planned = user.Y1S2Planned;
      console.log(planned);
      const confirmed = user.Y1S2Confirmed;
      const newPlanned = planned.concat(mods).filter((v, i, a) => a.indexOf(v) === i);
      const newConfirmed = confirmed.concat(mods).filter((v, i, a) => a.indexOf(v) === i);


      const userNew = {
      email: user.email,
      displayName: user.displayName,
      firstName: user.firstName,
      lastName: user.lastName,
      major: user.major,
      minor: user.minor,
      year: user.year,
      semester: user.semester,
      otherProgrammes: user.otherProgrammes,

      Y1S1Planned: user.Y1S1Planned,
      Y1S1Confirmed: user.Y1S1Confirmed,
      Y1S1CAP: user.Y1S1CAP,

      Y1S2Planned: newPlanned,
      Y1S2Confirmed: newConfirmed,
      Y1S2CAP:user.Y1S2CAP,

      Y2S1Planned: user.Y2S1Planned,
      Y2S1Confirmed: user.Y2S1Confirmed,
      Y2S1CAP:user.Y2S1CAP,

      Y2S2Planned: user.Y2S2Planned,
      Y2S2Confirmed: user.Y2S2Confirmed,
      Y2S2CAP:user.Y2S2CAP,

      Y3S1Planned: user.Y3S1Planned,
      Y3S1Confirmed: user.Y3S1Confirmed,
      Y3S1CAP:user.Y3S1CAP,

      Y3S2Planned: user.Y3S2Planned,
      Y3S2Confirmed: user.Y3S2Confirmed,
      Y3S2CAP: user.Y3S2CAP,

      Y4S1Planned: user.Y4S1Planned,
      Y4S1Confirmed: user.Y4S1Confirmed,
      Y4S1CAP:user.Y4S1CAP,

      Y4S2Planned: user.Y4S2Planned,
      Y4S2Confirmed: user.Y4S2Confirmed,
      Y4S2CAP:user.Y4S2CAP,

      eligibleMods: user.eligibleMods.concat(eligibleMods).filter((v, i, a) => a.indexOf(v) === i),
      currentCAP: user.currentCAP,
      warnings:user.warnings.concat(warnings),
      }
      await updateDoc(userDoc, userNew);
    }
    if(ys==="YEAR 2 SEM 1"){

      const planned = user.Y2S1Planned;
      console.log(planned);
      const confirmed = user.Y2S1Confirmed;
      const newPlanned = planned.concat(mods).filter((v, i, a) => a.indexOf(v) === i);
      const newConfirmed = confirmed.concat(mods).filter((v, i, a) => a.indexOf(v) === i);


      const userNew = {
        email: user.email,
        displayName: user.displayName,
        firstName: user.firstName,
        lastName: user.lastName,
        major: user.major,
        minor: user.minor,
        year: user.year,
        semester: user.semester,
        otherProgrammes: user.otherProgrammes,
  
        Y1S1Planned: user.Y1S1Planned,
        Y1S1Confirmed: user.Y1S1Confirmed,
        Y1S1CAP: user.Y1S1CAP,
  
        Y1S2Planned: user.Y1S2Planned,
        Y1S2Confirmed: user.Y1S2Confirmed,
        Y1S2CAP:user.Y1S2CAP,
  
        Y2S1Planned: newPlanned,
        Y2S1Confirmed: newConfirmed,
        Y2S1CAP:user.Y2S1CAP,
  
        Y2S2Planned: user.Y2S2Planned,
        Y2S2Confirmed: user.Y2S2Confirmed,
        Y2S2CAP:user.Y2S2CAP,
  
        Y3S1Planned: user.Y3S1Planned,
        Y3S1Confirmed: user.Y3S1Confirmed,
        Y3S1CAP:user.Y3S1CAP,
  
        Y3S2Planned: user.Y3S2Planned,
        Y3S2Confirmed: user.Y3S2Confirmed,
        Y3S2CAP: user.Y3S2CAP,
  
        Y4S1Planned: user.Y4S1Planned,
        Y4S1Confirmed: user.Y4S1Confirmed,
        Y4S1CAP:user.Y4S1CAP,
  
        Y4S2Planned: user.Y4S2Planned,
        Y4S2Confirmed: user.Y4S2Confirmed,
        Y4S2CAP:user.Y4S2CAP,
  
        eligibleMods: user.eligibleMods.concat(eligibleMods).filter((v, i, a) => a.indexOf(v) === i),
        currentCAP: user.currentCAP,
        warnings:user.warnings.concat(warnings),
        }
        await updateDoc(userDoc, userNew);
    }
    if(ys==="YEAR 2 SEM 2"){

      const planned = user.Y2S2Planned;
      console.log(planned);
      const confirmed = user.Y2S2Confirmed;
      const newPlanned = planned.concat(mods).filter((v, i, a) => a.indexOf(v) === i);
      const newConfirmed = confirmed.concat(mods).filter((v, i, a) => a.indexOf(v) === i);

      const userNew = {
        email: user.email,
        displayName: user.displayName,
        firstName: user.firstName,
        lastName: user.lastName,
        major: user.major,
        minor: user.minor,
        year: user.year,
        semester: user.semester,
        otherProgrammes: user.otherProgrammes,
  
        Y1S1Planned: user.Y1S1Planned,
        Y1S1Confirmed: user.Y1S1Confirmed,
        Y1S1CAP: user.Y1S1CAP,
  
        Y1S2Planned: user.Y1S2Planned,
        Y1S2Confirmed: user.Y1S2Confirmed,
        Y1S2CAP:user.Y1S2CAP,
  
        Y2S1Planned: user.Y2S1Planned,
        Y2S1Confirmed: user.Y2S1Confirmed,
        Y2S1CAP:user.Y2S1CAP,
  
        Y2S2Planned: newPlanned,
        Y2S2Confirmed: newConfirmed,
        Y2S2CAP:user.Y2S2CAP,
  
        Y3S1Planned: user.Y3S1Planned,
        Y3S1Confirmed: user.Y3S1Confirmed,
        Y3S1CAP:user.Y3S1CAP,
  
        Y3S2Planned: user.Y3S2Planned,
        Y3S2Confirmed: user.Y3S2Confirmed,
        Y3S2CAP: user.Y3S2CAP,
  
        Y4S1Planned: user.Y4S1Planned,
        Y4S1Confirmed: user.Y4S1Confirmed,
        Y4S1CAP:user.Y4S1CAP,
  
        Y4S2Planned: user.Y4S2Planned,
        Y4S2Confirmed: user.Y4S2Confirmed,
        Y4S2CAP:user.Y4S2CAP,
  
        eligibleMods: user.eligibleMods.concat(eligibleMods).filter((v, i, a) => a.indexOf(v) === i),
        currentCAP: user.currentCAP,
        warnings:user.warnings.concat(warnings),
        }
        await updateDoc(userDoc, userNew);
    }
    if(ys==="YEAR 3 SEM 1"){
      const planned = user.Y3S1Planned;
      console.log(planned);
      const confirmed = user.Y3S1Confirmed;
      const newPlanned = planned.concat(mods).filter((v, i, a) => a.indexOf(v) === i);
      const newConfirmed = confirmed.concat(mods).filter((v, i, a) => a.indexOf(v) === i);

      const userNew = {
        email: user.email,
        displayName: user.displayName,
        firstName: user.firstName,
        lastName: user.lastName,
        major: user.major,
        minor: user.minor,
        year: user.year,
        semester: user.semester,
        otherProgrammes: user.otherProgrammes,
  
        Y1S1Planned: user.Y1S1Planned,
        Y1S1Confirmed: user.Y1S1Confirmed,
        Y1S1CAP: user.Y1S1CAP,
  
        Y1S2Planned: user.Y1S2Planned,
        Y1S2Confirmed: user.Y1S2Confirmed,
        Y1S2CAP:user.Y1S2CAP,
  
        Y2S1Planned: user.Y2S1Planned,
        Y2S1Confirmed: user.Y2S1Confirmed,
        Y2S1CAP:user.Y2S1CAP,
  
        Y2S2Planned: user.Y2S2Planned,
        Y2S2Confirmed: user.Y2S2Confirmed,
        Y2S2CAP:user.Y2S2CAP,
  
        Y3S1Planned: newPlanned,
        Y3S1Confirmed: newConfirmed,
        Y3S1CAP:user.Y3S1CAP,
  
        Y3S2Planned: user.Y3S2Planned,
        Y3S2Confirmed: user.Y3S2Confirmed,
        Y3S2CAP: user.Y3S2CAP,
  
        Y4S1Planned: user.Y4S1Planned,
        Y4S1Confirmed: user.Y4S1Confirmed,
        Y4S1CAP:user.Y4S1CAP,
  
        Y4S2Planned: user.Y4S2Planned,
        Y4S2Confirmed: user.Y4S2Confirmed,
        Y4S2CAP:user.Y4S2CAP,
  
        eligibleMods: user.eligibleMods.concat(eligibleMods).filter((v, i, a) => a.indexOf(v) === i),
        currentCAP: user.currentCAP,
        warnings:user.warnings.concat(warnings),
        }
        await updateDoc(userDoc, userNew);
    }
    if(ys==="YEAR 3 SEM 2"){
      const planned = user.Y3S2Planned;
      console.log(planned);
      const confirmed = user.Y3S2Confirmed;
      const newPlanned = planned.concat(mods).filter((v, i, a) => a.indexOf(v) === i);
      const newConfirmed = confirmed.concat(mods).filter((v, i, a) => a.indexOf(v) === i);
      const userNew = {
        email: user.email,
        displayName: user.displayName,
        firstName: user.firstName,
        lastName: user.lastName,
        major: user.major,
        minor: user.minor,
        year: user.year,
        semester: user.semester,
        otherProgrammes: user.otherProgrammes,
  
        Y1S1Planned: user.Y1S1Planned,
        Y1S1Confirmed: user.Y1S1Confirmed,
        Y1S1CAP: user.Y1S1CAP,
  
        Y1S2Planned: user.Y1S2Planned,
        Y1S2Confirmed: user.Y1S2Confirmed,
        Y1S2CAP:user.Y1S2CAP,
  
        Y2S1Planned: user.Y2S1Planned,
        Y2S1Confirmed: user.Y2S1Confirmed,
        Y2S1CAP:user.Y2S1CAP,
  
        Y2S2Planned: user.Y2S2Planned,
        Y2S2Confirmed: user.Y2S2Confirmed,
        Y2S2CAP:user.Y2S2CAP,
  
        Y3S1Planned: user.Y3S1Planned,
        Y3S1Confirmed: user.Y3S1Confirmed,
        Y3S1CAP:user.Y3S1CAP,
  
        Y3S2Planned: newPlanned,
        Y3S2Confirmed: newConfirmed,
        Y3S2CAP: user.Y3S2CAP,
  
        Y4S1Planned: user.Y4S1Planned,
        Y4S1Confirmed: user.Y4S1Confirmed,
        Y4S1CAP:user.Y4S1CAP,
  
        Y4S2Planned: user.Y4S2Planned,
        Y4S2Confirmed: user.Y4S2Confirmed,
        Y4S2CAP:user.Y4S2CAP,
  
        eligibleMods: user.eligibleMods.concat(eligibleMods).filter((v, i, a) => a.indexOf(v) === i),
        currentCAP: user.currentCAP,
        warnings:user.warnings.concat(warnings),
        }
        await updateDoc(userDoc, userNew);
    }
    if(ys==="YEAR 4 SEM 1"){
      const planned = user.Y4S1Planned;
      console.log(planned);
      const confirmed = user.Y4S1Confirmed;
      const newPlanned = planned.concat(mods).filter((v, i, a) => a.indexOf(v) === i);
      const newConfirmed = confirmed.concat(mods).filter((v, i, a) => a.indexOf(v) === i);
      const userNew = {
        email: user.email,
        displayName: user.displayName,
        firstName: user.firstName,
        lastName: user.lastName,
        major: user.major,
        minor: user.minor,
        year: user.year,
        semester: user.semester,
        otherProgrammes: user.otherProgrammes,
  
        Y1S1Planned: user.Y1S1Planned,
        Y1S1Confirmed: user.Y1S1Confirmed,
        Y1S1CAP: user.Y1S1CAP,
  
        Y1S2Planned: user.Y1S2Planned,
        Y1S2Confirmed: user.Y1S2Confirmed,
        Y1S2CAP:user.Y1S2CAP,
  
        Y2S1Planned: user.Y2S1Planned,
        Y2S1Confirmed: user.Y2S1Confirmed,
        Y2S1CAP:user.Y2S1CAP,
  
        Y2S2Planned: user.Y2S2Planned,
        Y2S2Confirmed: user.Y2S2Confirmed,
        Y2S2CAP:user.Y2S2CAP,
  
        Y3S1Planned: user.Y3S1Planned,
        Y3S1Confirmed: user.Y3S1Confirmed,
        Y3S1CAP:user.Y3S1CAP,
  
        Y3S2Planned: user.Y3S2Planned,
        Y3S2Confirmed: user.Y3S2Confirmed,
        Y3S2CAP: user.Y3S2CAP,
  
        Y4S1Planned: newPlanned,
        Y4S1Confirmed: newConfirmed,
        Y4S1CAP:user.Y4S1CAP,
  
        Y4S2Planned: user.Y4S2Planned,
        Y4S2Confirmed: user.Y4S2Confirmed,
        Y4S2CAP:user.Y4S2CAP,
  
        eligibleMods: user.eligibleMods.concat(eligibleMods).filter((v, i, a) => a.indexOf(v) === i),
        currentCAP: user.currentCAP,
        warnings:user.warnings.concat(warnings),
        }
        await updateDoc(userDoc, userNew);
    }
    if(ys==="YEAR 4 SEM 2"){
      const planned = user.Y4S2Planned;
      console.log(planned);
      const confirmed = user.Y4S2Confirmed;
      const newPlanned = planned.concat(mods).filter((v, i, a) => a.indexOf(v) === i);
      const newConfirmed = confirmed.concat(mods).filter((v, i, a) => a.indexOf(v) === i);
      const userNew = {
        email: user.email,
        displayName: user.displayName,
        firstName: user.firstName,
        lastName: user.lastName,
        major: user.major,
        minor: user.minor,
        year: user.year,
        semester: user.semester,
        otherProgrammes: user.otherProgrammes,
  
        Y1S1Planned: user.Y1S1Planned,
        Y1S1Confirmed: user.Y1S1Confirmed,
        Y1S1CAP: user.Y1S1CAP,
  
        Y1S2Planned: user.Y1S2Planned,
        Y1S2Confirmed: user.Y1S2Confirmed,
        Y1S2CAP:user.Y1S2CAP,
  
        Y2S1Planned: user.Y2S1Planned,
        Y2S1Confirmed: user.Y2S1Confirmed,
        Y2S1CAP:user.Y2S1CAP,
  
        Y2S2Planned: user.Y2S2Planned,
        Y2S2Confirmed: user.Y2S2Confirmed,
        Y2S2CAP:user.Y2S2CAP,
  
        Y3S1Planned: user.Y3S1Planned,
        Y3S1Confirmed: user.Y3S1Confirmed,
        Y3S1CAP:user.Y3S1CAP,
  
        Y3S2Planned: user.Y3S2Planned,
        Y3S2Confirmed: user.Y3S2Confirmed,
        Y3S2CAP: user.Y3S2CAP,
  
        Y4S1Planned: user.Y4S1Planned,
        Y4S1Confirmed: user.Y4S1Confirmed,
        Y4S1CAP:user.Y4S1CAP,
  
        Y4S2Planned: newPlanned,
        Y4S2Confirmed: newConfirmed,
        Y4S2CAP:user.Y4S2CAP,
  
        eligibleMods: user.eligibleMods.concat(eligibleMods).filter((v, i, a) => a.indexOf(v) === i),
        currentCAP: user.currentCAP,
        warnings:user.warnings.concat(warnings),
        }
        await updateDoc(userDoc, userNew);
    }
    else{
     //do nothing...?
    }
  }


  const OPTIONS_LIMIT = 10;

  const filterOptions = createFilterOptions({
    limit: OPTIONS_LIMIT
});

  return (
    
    <>
      <div className="Planner" style={PlannerMain.planner}>

        <h1>Plan your modules!</h1>

      <Autocomplete
      disablePortal
      id="semesters"
      name="semesters"
      options={[
        {l: 'YEAR 1 SEM 1'},
        {l: 'YEAR 1 SEM 2'},
        {l: 'YEAR 2 SEM 1'},
        {l: 'YEAR 2 SEM 2'},
        {l: 'YEAR 3 SEM 1'},
        {l: 'YEAR 3 SEM 2'},
        {l: 'YEAR 4 SEM 1'},
        {l: 'YEAR 4 SEM 2'},
      ]}
      getOptionLabel = {(option) => option.l} 
      autoSelect = {true}
      renderInput={(params) => <TextField {...params} label={"Year and Semester"} />}
      onChange={(event, value) => {setYS(value.l);}}
      />


        <div>
            {warnings.length > 0 ? (
                <WarningList warnings={warnings} setWarnings={setWarnings} />
            ) : (
                <p>No warnings</p>
            )}
            </div>

        <main>

          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <h2>Add Data</h2>
      <Autocomplete
      filterOptions={filterOptions}
      disablePortal
      autoHighlight={true}
      id="modules"
      name="modules"
      options={data}
      getOptionLabel = {(option) => option.moduleCode+" : "+option.title } 
      autoSelect = {true}
      renderInput={(params) => <TextField {...params} label={"Module Code"} />}
      onChange={(event, value) => { 
        if(value!==null){
          setModCode(value.moduleCode);
        }}
      }

/>
      <p></p>
      
    
      {/* <Autocomplete
      disablePortal
      id="grades"
      name="grades"
      options={[
        {l: 'A+'},
        {l: 'A'},
        {l: 'A-'},
        {l: 'B+'},
        {l: 'B'},
        {l: 'B-'},
        {l: 'C+'},
        {l: 'C'},
        {l: 'C-'},
        {l: 'D+'},
        {l: 'D'},
        {l: 'D-'},
        {l: 'F'},
        {l: 'S'},
        {l: 'U'},
      ]}
      getOptionLabel = {(option) => option.l} 
      autoSelect = {true}
      renderInput={(params) => <TextField {...params} label={"Predicted Grade"} />}
      onChange={(event, value) => {setGradePlanned(value.l);}}
      /> */}
    

      <p></p>
      <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSubmit}
              >
                Add Module
              </Button>
          </Box>

          <Box>
            <h2>List of modules</h2>
            <table style={{ margin: "0 auto", width: "100%" }}>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Modules</th>
                </tr>
              </thead>
              <tbody>
                {Module.map((Mod, idx) => (
                  <tr key={Mod.code}>
                    <td>{idx + 1}</td>
                    <td>{Mod.code}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p></p>


            <Grid item xs={12} m={5}>
            <Button variant="contained" 
            startIcon={<SaveIcon />} 
            sx ={{m: 4}}
            onClick={handleSave}
            >
            Save Changes
            </Button>
            </Grid>

          </Box>
          <p> </p>
        </main>
      </div>
    </>
  );
} 
