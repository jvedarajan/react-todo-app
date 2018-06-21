import React, { Component } from "react";
export function getCurrentTime () {
        const today = new Date();
        const h = checkTime(today.getHours());
        const m = checkTime(today.getMinutes());
        const s =  checkTime(today.getSeconds());
        const date = checkTime(today.getDate());
        const month = checkTime(today.getMonth());
        const year = today.getFullYear();
        const currentDateTime = year+"-"+month+"-"+date+" "+h+":"+m+":"+s;
        return currentDateTime;
    }
export function checkTime(i){
    if (i < 10) {
        i = "0" + i;
      }
      return i ;
  }
  class commonFunction extends Component {
  }
  export default commonFunction;