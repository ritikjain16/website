import React, { useState, useEffect, lazy } from "react";
import user_image from "../assets/boy.png";
import { Link } from "react-router-dom";
import axios from "axios";
import './GemsCard.css';
// import Pagination from "../Pagination/Pagination";
// import FilterForm from "./FilterForm";
import Loader from "../Loader/Loader";
const Pagination = lazy(() => import("../Pagination/Pagination"));
const FilterForm = lazy(() => import("./FilterForm"));

const GemCardItem = ({
  _id,
  name,
  branch,
  profilePhoto,
  
}) => {
  return (
    <Link to={`/userProfile/${_id}`} style={{ textDecoration: "none" }}>
      <div className="gemprofile-card">
        <div className="gemcard-header">
          <div className="gempic">
            {profilePhoto && <img src={profilePhoto} className="GemImg" alt="" />}
            {!profilePhoto && <img src={user_image} className="GemImg" alt="" />}
          </div>
          <div className="gemname">{name}</div>
          <div className="gemdesc">{branch}</div>
          {/* <div className="sm"> */}
            {/* <Link to={facebook} className="fab fa-facebook"></Link>
            <Link to={linkedin} className="fab fa-linkedin"></Link>
  <Link to={github} className="fab fa-github"></Link>*/}
          {/* </div> */}
        </div>
      </div>
    </Link>
  );
};
const GemCard = (props) => {
  const [userData, setUserData] = useState([]);
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("");
  const [profession, setProfession] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(19);
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  console.log(props);

  const handleNameSearch = (e) => {
    e.preventDefault();
    axios
      .get(
        `/api/gems?year=${year}&branch=${branch}&profession=${profession}&page=${currentPage}&size=${limit}&name=${name}`
      )
      .then((res) => {
        setLoading(false);
        setUserData(res.data.data);
        setTotalItems(res.data.totalItems);
      })
      .catch((err) => {
        // console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    axios
      .get(
        `/api/gems?year=${year}&branch=${branch}&profession=${profession}&page=${currentPage}&size=${limit}`
      )
      .then((res) => {
        setLoading(false);
        setUserData(res.data.data);
        setTotalItems(res.data.totalItems);
      })
      .catch((err) => {
        // console.log(err);
        setLoading(false);
      });
  }, [currentPage, year, branch, profession]);

  const handlePageChange = (page) => {
    console.log(page);
    setCurrentPage(page);
  };

  return (
    <div className="gemcard_main_cot" style={{ marginBottom: "3rem" }}>
      <FilterForm
        year={year}
        setYear={setYear}
        branch={branch}
        name={name}
        setBranch={setBranch}
        setProfession={setProfession}
        setPage={setCurrentPage}
        setName={setName}
        handleNameSearch={handleNameSearch}
      />
      <div className="c gemcard_cot">
        <div className="gemcard_wrapper">
          {userData.map((dt, index) => (
            <GemCardItem key={index} {...dt} />
          ))}
        </div>
      </div>
      {totalItems > limit && (
        <Pagination
          totalItems={totalItems}
          pageSize={limit}
          handlePageChange={handlePageChange}
        />
      )}
      {loading && <Loader />}
    </div>
  );
};

export default GemCard;
