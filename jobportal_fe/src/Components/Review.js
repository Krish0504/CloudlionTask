import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/style.css";
import { getAllApplicants } from "./Services/apiCalls.js";
import HeaderComponent from "./Header.js";

export default function ReviewApplicant() {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({isError:false,errorMessage:""});
  const [reload,setReload]=useState(false);

  useEffect(() => {
    setReload(false);
    getAllApplicants().then((res) => {
      if (res.status == 404) {
        setLoading(false);
        setError({isError:true,errorMessage:"Unable to Fetch Data"});
      
      }
      if (res.status == 500) {
        setLoading(false);
        setError({isError:true,errorMessage:"Something went wrong"});
      }
      if (res.status == 200) {
        if (res.data &&
          res.data != undefined &&
          res.data !== null &&
          res.data.length !== 0
        ) {
          setApplicants(res.data);
          setLoading(false);
          setError({isError:false,errorMessage:""});
        }
        else{
          setLoading(false);
          setError({isError:true,errorMessage:"No active Applicants"});
        }
        
      }
    });

    getAllApplicants();
  }, [reload]);

  const handleRowClick = (id) => {
    navigate(`/registration/${id}/admin`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <HeaderComponent  page="review"/>
      <div className="mainDiv">
        {error.isError?<>
        <div>
          <h1 className="text-danger">{error.errorMessage}</h1>

        </div>
        </>:
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">UserName</th>
              <th scope="col">Email</th>
            </tr>
          </thead>
          <tbody>
            {/* Loop through applicants data and create rows */}
            {applicants.map((applicant) => (
              <tr
                key={applicant._id}
                onClick={() => handleRowClick(applicant._id)}
                style={{ cursor: "pointer" }}
              >
                <th scope="row">{applicant._id.slice(0, 8)}</th>
                <td>{applicant.userName}</td>
                <td>{applicant.email}</td>
              </tr>
            ))}
          </tbody>
        </table>}
        <footer>
        <button className="btn btn-primary m-2" onClick={()=>navigate("/")}>Back</button>
        <button className="btn btn-success m-2" onClick={()=>setReload(true)}> Reload</button>
      </footer>
      </div>
      
    </>
  );
}
