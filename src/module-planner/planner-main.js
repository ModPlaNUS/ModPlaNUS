import React from "react";
import { useState } from "react";
import Box from "./Box";
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import PlannerMain from './PlannerMain.css';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import SaveIcon from '@mui/icons-material/Save';
import { createFilterOptions } from "@mui/material/Autocomplete";
import firebase from 'firebase/compat/app';
import { db } from "../authentication/firebase-config";
import {
  doc,
  onSnapshot, 
  updateDoc,
} from "firebase/firestore";
import { Card } from "@mui/material";



//NUSMODS API to retrieve the data for autocomplete from
const API_NUSMODS_URL = 'https://api.nusmods.com/v2/2021-2022/moduleList.json';

//NUSMODS API to retrieve the data for each module
const API_MODULE_INFO = 'https://api.nusmods.com/v2/2021-2022/modules/';

export function convert(finalArray) {
  let stack = ["BO"];
  let Operator = ["AND", "OR"]
  let precedence = ["OR", "AND"]
  let ExpY = []
  for (let element = 0; element < finalArray.length; element++) {
    if (finalArray[element] === "BO") {
      stack.push(finalArray[element]);
    }
    if (Operator.includes(finalArray[element])) {
      if (Operator.includes(stack[stack.length-1]) && precedence.indexOf(stack[stack.length-1]) > precedence.indexOf(finalArray[element])) {
        ExpY.push(stack[stack.length-1])
        stack.pop()
        stack.push(finalArray[element]);
      }
      else {
        stack.push(finalArray[element]);
      }
    }
    if (!Operator.includes(finalArray[element]) && finalArray[element] !== "BO" && finalArray[element] !== "BC") { 
      ExpY.push(finalArray[element]);
    }
    if (finalArray[element] === "BC") {
        for (let a = stack.length -1; a >0; a--) {
          if (stack[a] !== "BO" && stack[a] !== "BC") { 
            ExpY.push(stack[a])
          }
          stack.pop()
      }
    }
  }
  return ExpY;
}

export function evaluate(finalArr) {
  let finalArray = convert(finalArr)
  let evaluation = false
  let Operator = ["AND", "OR"]
  let stack = []
  for (let element = 0; element < finalArray.length; element++) {
    if (!Operator.includes(finalArray[element])) {
      stack.push(finalArray[element]);
    }
    if (Operator.includes(finalArray[element])) {
        let operator = finalArray[element]
        let operand1 = stack.pop();
        let operand2 = stack.pop();
      if (operator === "AND") {
          evaluation = operand1 && operand2
      }
      if (operator === "OR") {
          evaluation = operand1 || operand2
      }
      stack.push(evaluation)
    }
  }
  return stack.pop();

}

export function WarningList(props) {
  const { warnings, setWarnings } = props;

  function handleWarningCompletionToggled(toToggleWarning, toToggleWarningIndex) {
    let newWarnings = [
      ...warnings.slice(0, toToggleWarningIndex),
      {
        msg: toToggleWarning.msg,
        isComplete: !toToggleWarning.isComplete
      },
      ...warnings.slice(toToggleWarningIndex + 1)
    ];

    newWarnings = newWarnings.filter((w, i)=> !w.isComplete);
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

export function ModuleList(props) {
  
  const { modules, setModules } = props;

  function handleModuleCompletionToggled(toToggleModule, toToggleModuleIndex) {
    let newModules = [
      ...modules.slice(0, toToggleModuleIndex),
      {
        code: toToggleModule.code,
        grade: toToggleModule.grade,
        mc: toToggleModule.mc,
        workLoad: toToggleModule.workLoad,
        isComplete: !toToggleModule.isComplete,
      },
      ...modules.slice(toToggleModuleIndex + 1)
    ];

    setModules(newModules);

  }

  function handleModuleDeletion(toToggleModule, toToggleModuleIndex) {
    let newModules = [
      ...modules.slice(0, toToggleModuleIndex),
      {
        code: toToggleModule.code,
        grade: toToggleModule.grade,
        mc: toToggleModule.mc,
        workLoad: toToggleModule.workLoad,
        isComplete: !toToggleModule.isComplete,
      },
      ...modules.slice(toToggleModuleIndex + 1)
    ];

    newModules = newModules.filter((w, i)=> !w.isComplete);
    setModules(newModules);

  }

  return (
    <table style={{ margin: "0 auto", width: "100%" }}>
          <thead>
            <tr>
              <th>No.</th>
              <th>Module</th>
              <th>Grade</th>
              <th>MC</th>
              <th>Workload (hrs/week)</th>
              <th>Completed</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((mods, index) => (
              <tr key={mods.code}>
                <td>{index + 1}</td>
                <td>{mods.code}</td>
                <td>{mods.grade}</td>
                <td>{mods.mc}</td>
                <td>{mods.workLoad}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={mods.isComplete}
                    onChange={() => handleModuleCompletionToggled(mods, index)}
                  />
                </td>
                <td>
                  <input
                    type="button"
                    onClick={() => handleModuleDeletion(mods, index)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  );
}



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
  const [MC, setMC] = useState('');
  const [MCtl, setMCtl] = useState('0');
  let mcs = 0;
  const [workload, setWorkload] = useState('');
  const [workloadTl, setWorkloadTl] = useState('0');

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
  

 function findMC(code){
    const response = fetch(`${API_MODULE_INFO}${code}.json`)
    .then(res => res.json())
    .then(res => {
      setMC(res.moduleCredit);
      mcs = res.moduleCredit;
    });
  
  };

  function findWL(code){
      const response = fetch(`${API_MODULE_INFO}${code}.json`)
      .then(res => res.json())
      .then(res => {
        setWorkload(res.workload);
      });
    
    };
  
  React.useEffect(()=>{

    if(p){

    const code = p.moduleCode;
    const mc = p.moduleCredit;
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
        const msg = code + " PRECLUSIONS ERRORS: Did you accidentally add these preclusion modules? " + preclusions;

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
      if(!coreqMods.every(element => {
        console.log(mods.includes(element));
        return mods.includes(element);
      })){
        const msg = code + " COREQUISITE ERROR: Have you remembered to add these corequisite modules? " + corequisites;

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
    const prereqArr5 = prerequisites.replaceAll("or its equivalent", " ");
    const  prereqArr1 = prereqArr5.replaceAll("and", "AND");
    const prereqArr2 = prereqArr1.replaceAll("or", "OR");
    const prereqArr3 = prereqArr2.replaceAll("(", " BO ");
    const prereqArr4 = prereqArr3.replaceAll(")", " BC ");
    const prereqArr = prereqArr4.match(res);

    let finalArray = prereqArr.map(x=>{
      if(x!=="BO" && x !=="BC" && x!=="AND" && x!== "OR" && x!=="TRUE"){
        return mods.includes(x);
      } else {
        if(x==="TRUE"){
          return true;
        }
        return x;
      }
    });

    const vari = evaluate(finalArray);
    
      if(!eligibleMods.includes(code)){
        if(!vari){
        
          const msg = code + " PREREQUISITE ERRORS: Are you sure you have finished these prerequisite modules? " + prerequisites;
          
          const newWarnings = [
            ...warnings,
          {
           msg: msg,
           isComplete: false

          }
        ];
        setWarnings(newWarnings);

      } else {
        setWarnings(code + " WARNING: Our program detected one or more of the following prerequisites to be unfulfilled! " + prerequisites)
      }
    }
  }
    
     const fulfillReqs = p.fulfillRequirements;
     if(fulfillReqs){
       let newEligibleMods = eligibleMods.concat(fulfillReqs).filter((v, i, a) => a.indexOf(v) === i);
       setEligibleMods(newEligibleMods);
     }

}
  
}, [p]);


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

function addToList(code, grade, modCred, workHrs){
  const newModule = [
    ...Module,
    {
      code: code,
      grade: grade,
      mc: modCred,
      workLoad: workHrs,
      isComplete: false,
    }
  ];

  setModule(newModule);
}


<Typography>{warnings}</Typography>



  function addModule(code, grade) {

    const add1 = parseInt(MC);
    const add2 = parseInt(MCtl);
    const newMC = add1+ add2;
    setMCtl(newMC);


    
    const mods = Module.map(x=>x.code);
    const wl = workload.reduce((partialSum, a) => partialSum + a, 0);
    const wl1 = parseInt(wl);
    const wl2 = parseInt(workloadTl);
    const newWl = wl1 + wl2;
    setWorkloadTl(newWl);
    if(mods.includes(code)){
     const msg = "You cannot add the same module twice! " + code;
     alert(msg);
    } else {
      handleAddition(code);
      addToList(code, grade, MC, wl);
    }
    setSelected(true);

  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if(modCode){
    addModule(modCode, gradePlanned);
    } else {
      alert("Please add a module!");
    }
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
      const repetitive = planned.map(y=>y.code);
      const newMods = planned.concat(Module.filter(a => !repetitive.includes(a.code)));
      const currMC = user.currentMC + MCtl;
      const semMC = MCtl;

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

      Y1S1Planned: newMods,
      Y1S1CAP: user.Y1S1CAP,
      Y1S1MC: semMC,

      Y1S2Planned: user.Y1S2Planned,
      Y1S2CAP:user.Y1S2CAP,

      Y2S1Planned: user.Y2S1Planned,
      Y2S1CAP:user.Y2S1CAP,

      Y2S2Planned: user.Y2S2Planned,
      Y2S2CAP:user.Y2S2CAP,

      Y3S1Planned: user.Y3S1Planned,
      Y3S1CAP:user.Y3S1CAP,

      Y3S2Planned: user.Y3S2Planned,
      Y3S2CAP: user.Y3S2CAP,

      Y4S1Planned: user.Y4S1Planned,
      Y4S1CAP:user.Y4S1CAP,

      Y4S2Planned: user.Y4S2Planned,
      Y4S2CAP:user.Y4S2CAP,

      currentMC: currMC,
      eligibleMods: user.eligibleMods.concat(eligibleMods).filter((v, i, a) => a.indexOf(v) === i),
      currentCAP: user.currentCAP,
      warnings:user.warnings.concat(warnings),
      }
      await updateDoc(userDoc, userNew);
    }

    if(ys==="YEAR 1 SEM 2"){

      const planned = user.Y1S2Planned;
      const currMC = user.currentMC + MCtl;
      const semMC = MCtl;
      const repetitive = planned.map(y=>y.code);
      const newMods = planned.concat(Module.filter(a => !repetitive.includes(a.code)));


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
      Y1S1CAP: user.Y1S1CAP,

      Y1S2Planned: newMods,
      Y1S2CAP:user.Y1S2CAP,
      Y1S2MC: semMC,

      Y2S1Planned: user.Y2S1Planned,
      Y2S1CAP:user.Y2S1CAP,

      Y2S2Planned: user.Y2S2Planned,
      Y2S2CAP:user.Y2S2CAP,

      Y3S1Planned: user.Y3S1Planned,
      Y3S1CAP:user.Y3S1CAP,

      Y3S2Planned: user.Y3S2Planned,
      Y3S2CAP: user.Y3S2CAP,

      Y4S1Planned: user.Y4S1Planned,
      Y4S1CAP:user.Y4S1CAP,

      Y4S2Planned: user.Y4S2Planned,
      Y4S2CAP:user.Y4S2CAP,

      currentMC: currMC,
      eligibleMods: user.eligibleMods.concat(eligibleMods).filter((v, i, a) => a.indexOf(v) === i),
      currentCAP: user.currentCAP,
      warnings:user.warnings.concat(warnings),
      }
      await updateDoc(userDoc, userNew);
    }
    if(ys==="YEAR 2 SEM 1"){

      const planned = user.Y2S1Planned;
      const currMC = user.currentMC + MCtl;
      const semMC = MCtl;
      const repetitive = planned.map(y=>y.code);
      const newMods = planned.concat(Module.filter(a => !repetitive.includes(a.code)));

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
        Y1S1CAP: user.Y1S1CAP,  
        Y1S2Planned: user.Y1S2Planned,
        Y1S2CAP:user.Y1S2CAP,
  
        Y2S1Planned: newMods,
        Y2S1CAP:user.Y2S1CAP,
        Y2S1MC: semMC,
  
        Y2S2Planned: user.Y2S2Planned,
        Y2S2CAP:user.Y2S2CAP,
  
        Y3S1Planned: user.Y3S1Planned,
        Y3S1CAP:user.Y3S1CAP,
  
        Y3S2Planned: user.Y3S2Planned,
        Y3S2CAP: user.Y3S2CAP,
  
        Y4S1Planned: user.Y4S1Planned,
        Y4S1CAP:user.Y4S1CAP,
  
        Y4S2Planned: user.Y4S2Planned,
        Y4S2CAP:user.Y4S2CAP,
  
        currentMC: currMC,
        eligibleMods: user.eligibleMods.concat(eligibleMods).filter((v, i, a) => a.indexOf(v) === i),
        currentCAP: user.currentCAP,
        warnings:user.warnings.concat(warnings),
        }
        await updateDoc(userDoc, userNew);
    }
    if(ys==="YEAR 2 SEM 2"){

      const planned = user.Y2S2Planned;
      const currMC = user.currentMC + MCtl;
      const semMC = MCtl;
      const repetitive = planned.map(y=>y.code);
      const newMods = planned.concat(Module.filter(a => !repetitive.includes(a.code)));

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
        Y1S1CAP: user.Y1S1CAP,
  
        Y1S2Planned: user.Y1S2Planned,
        Y1S2CAP:user.Y1S2CAP,
  
        Y2S1Planned: user.Y2S1Planned,
        Y2S1CAP:user.Y2S1CAP,
  
        Y2S2Planned: newMods,
        Y2S2CAP:user.Y2S2CAP,
        Y2S2MC: semMC,
  
        Y3S1Planned: user.Y3S1Planned,
        Y3S1CAP:user.Y3S1CAP,
  
        Y3S2Planned: user.Y3S2Planned,
        Y3S2CAP: user.Y3S2CAP,
  
        Y4S1Planned: user.Y4S1Planned,
        Y4S1CAP:user.Y4S1CAP,
  
        Y4S2Planned: user.Y4S2Planned,
        Y4S2CAP:user.Y4S2CAP,
  
        eligibleMods: user.eligibleMods.concat(eligibleMods).filter((v, i, a) => a.indexOf(v) === i),
        currentCAP: user.currentCAP,
        warnings:user.warnings.concat(warnings),
        currentMC: currMC,
        }
        await updateDoc(userDoc, userNew);
    }
    if(ys==="YEAR 3 SEM 1"){
      const planned = user.Y3S1Planned;
      const repetitive = planned.map(y=>y.code);
      const newMods = planned.concat(Module.filter(a => !repetitive.includes(a.code)));
      const currMC = user.currentMC + MCtl;
      const semMC = MCtl;

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
        Y1S1CAP: user.Y1S1CAP,
  
        Y1S2Planned: user.Y1S2Planned,
        Y1S2CAP:user.Y1S2CAP,
  
        Y2S1Planned: user.Y2S1Planned,
        Y2S1CAP:user.Y2S1CAP,
  
        Y2S2Planned: user.Y2S2Planned,
        Y2S2CAP:user.Y2S2CAP,
  
        Y3S1Planned: newMods,
        Y3S1CAP:user.Y3S1CAP,
        Y3S1MC: semMC,
  
        Y3S2Planned: user.Y3S2Planned,
        Y3S2CAP: user.Y3S2CAP,
  
        Y4S1Planned: user.Y4S1Planned,
        Y4S1CAP:user.Y4S1CAP,
  
        Y4S2Planned: user.Y4S2Planned,
        Y4S2CAP:user.Y4S2CAP,
  
        eligibleMods: user.eligibleMods.concat(eligibleMods).filter((v, i, a) => a.indexOf(v) === i),
        currentCAP: user.currentCAP,
        warnings:user.warnings.concat(warnings),
        currentMC: currMC,
        }
        await updateDoc(userDoc, userNew);
    }
    if(ys==="YEAR 3 SEM 2"){
      const planned = user.Y3S2Planned;
      const currMC = user.currentMC + MCtl;
      const semMC = MCtl;
      const repetitive = planned.map(y=>y.code);
      const newMods = planned.concat(Module.filter(a => !repetitive.includes(a.code)));
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
        Y1S1CAP: user.Y1S1CAP,
  
        Y1S2Planned: user.Y1S2Planned,
        Y1S2CAP:user.Y1S2CAP,
  
        Y2S1Planned: user.Y2S1Planned,
        Y2S1CAP:user.Y2S1CAP,
  
        Y2S2Planned: user.Y2S2Planned,
        Y2S2CAP:user.Y2S2CAP,
  
        Y3S1Planned: user.Y3S1Planned,
        Y3S1CAP:user.Y3S1CAP,
  
        Y3S2Planned: newMods,
        Y3S2CAP: user.Y3S2CAP,
        Y3S2MC: semMC,
  
        Y4S1Planned: user.Y4S1Planned,
        Y4S1CAP:user.Y4S1CAP,
  
        Y4S2Planned: user.Y4S2Planned,
        Y4S2CAP:user.Y4S2CAP,
  
        eligibleMods: user.eligibleMods.concat(eligibleMods).filter((v, i, a) => a.indexOf(v) === i),
        currentCAP: user.currentCAP,
        warnings:user.warnings.concat(warnings),
        currentMC: currMC,
        }
        await updateDoc(userDoc, userNew);
    }
    if(ys==="YEAR 4 SEM 1"){
      const planned = user.Y4S1Planned;
      const currMC = user.currentMC + MCtl;
      const semMC = MCtl;
      const repetitive = planned.map(y=>y.code);
      const newMods = planned.concat(Module.filter(a => !repetitive.includes(a.code)));
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
        Y1S1CAP: user.Y1S1CAP,
  
        Y1S2Planned: user.Y1S2Planned,
        Y1S2CAP:user.Y1S2CAP,
  
        Y2S1Planned: user.Y2S1Planned,
        Y2S1CAP:user.Y2S1CAP,
  
        Y2S2Planned: user.Y2S2Planned,
        Y2S2CAP:user.Y2S2CAP,
  
        Y3S1Planned: user.Y3S1Planned,
        Y3S1CAP:user.Y3S1CAP,
  
        Y3S2Planned: user.Y3S2Planned,
        Y3S2CAP: user.Y3S2CAP,
  
        Y4S1Planned: newMods,
        Y4S1CAP:user.Y4S1CAP,
        Y4S1MC: semMC,
  
        Y4S2Planned: user.Y4S2Planned,
        Y4S2CAP:user.Y4S2CAP,
  
        eligibleMods: user.eligibleMods.concat(eligibleMods).filter((v, i, a) => a.indexOf(v) === i),
        currentCAP: user.currentCAP,
        warnings:user.warnings.concat(warnings),
        currentMC: currMC,
        }
        await updateDoc(userDoc, userNew);
    }
    if(ys==="YEAR 4 SEM 2"){
      const planned = user.Y4S2Planned;
      const currMC = user.currentMC + MCtl;
      const semMC = MCtl;
      const repetitive = planned.map(y=>y.code);
      const newMods = planned.concat(Module.filter(a => !repetitive.includes(a.code)));
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
        Y1S1CAP: user.Y1S1CAP,
  
        Y1S2Planned: user.Y1S2Planned,
        Y1S2CAP:user.Y1S2CAP,
  
        Y2S1Planned: user.Y2S1Planned,
        Y2S1CAP:user.Y2S1CAP,
  
        Y2S2Planned: user.Y2S2Planned,
        Y2S2CAP:user.Y2S2CAP,
  
        Y3S1Planned: user.Y3S1Planned,
        Y3S1CAP:user.Y3S1CAP,
  
        Y3S2Planned: user.Y3S2Planned,
        Y3S2CAP: user.Y3S2CAP,
  
        Y4S1Planned: user.Y4S1Planned,
        Y4S1CAP:user.Y4S1CAP,
  
        Y4S2Planned: newMods,
        Y4S2CAP:user.Y4S2CAP,
        Y4S2MC: semMC,
  
        eligibleMods: user.eligibleMods.concat(eligibleMods).filter((v, i, a) => a.indexOf(v) === i),
        currentCAP: user.currentCAP,
        warnings:user.warnings.concat(warnings),
        currentMC: currMC,
        }
        await updateDoc(userDoc, userNew);
    }
    else{
    }
  }


  const OPTIONS_LIMIT = 7;

  const filterOptions = createFilterOptions({
    limit: OPTIONS_LIMIT
});

  return (
    
    <>
      <div className="Planner" style={PlannerMain.planner}>

      <Typography variant="h3" gutterBottom>
        Begin Your Journey!
      </Typography>

      <Card>
        <Typography variant='h6'>
          Summary
        </Typography>
        
      <Box>
      Total MCs: {MCtl}
      </Box>

      <Box>
      Total Workload: {workloadTl}
      </Box>

      </Card>

      <p></p>
      <p></p>

<Card>
<p>

</p>

<Typography variant='h6'>
          Choose Your Year And Semester!
        </Typography>

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
      <p></p>

</Card>

<p></p>
<p></p>


        <div>
        <Card>
        <p></p>
        <Typography variant='h6'>
          Warnings
        </Typography>
            {warnings.length > 0 ? (
                <WarningList warnings={warnings} setWarnings={setWarnings} />
            ) : (
                <p>No warnings</p>
            )}
            </Card>
            <p></p>
            </div>


        <main>

          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <h2>Plan Modules</h2>
      <Autocomplete
      filterOptions={filterOptions}
      disablePortal
      autoHighlight={true}
      id="modules"
      name="modules"
      options={data}
      getOptionLabel = {(option) => option.moduleCode+" : "+option.title} 
      autoSelect = {true}
      renderInput={(params) => <TextField {...params} label={"Module Code"} />}
      onChange={(event, value) => { 
        if(value!==null){
        setModCode(value.moduleCode);
        const mcCount = findMC(value.moduleCode);
        const wlCount = findWL(value.moduleCode);
        }}
      }

/>
      <p></p>
      
    
      <Autocomplete
      disablePortal
      filterOptions={filterOptions}
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
      /> 
    

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
            <div>
            {Module.length > 0 ? (
                <ModuleList modules={Module} setModules={setModule} />
            ) : (
                <p>Add Modules Here!</p>
            )}
            </div>

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
