import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const PopUp = ({okUrl}) => {

    const {url,type}=okUrl;
    
    const navigate=useNavigate();

  const handleRedirect = () => {
    navigate(url); 
  };

  return (
    

        <div
          className="modal show d-block justify-content-center align-content-center"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <p>{type=="submit"?"Applied Successfully": type=="reject"?"rejected successfully":"Success"}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleRedirect}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      
    
  );
};

export default PopUp;
