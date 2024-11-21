import React from "react";

export default function HeaderComponent({id,role,name,page}){
    console.log({id,role,name,page})

    function bindHeading(){
        if(page=="review"){
            return " ADMIN ";
        }
        if(page=="registration"){
            if(!id){
                return " APPLICANT ";
            }

            if(role=="admin"){
                return " ADMIN ";
            }
            else{
                return name;
            }
        }
    }

    return(
        <>
        <header className="d-flex justify-content-center align-content-center">
        <h1>Welcome {bindHeading()}</h1>
      </header>
      </>
    )
}