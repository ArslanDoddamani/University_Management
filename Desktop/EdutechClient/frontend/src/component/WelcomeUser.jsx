import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { PurchasedCourses } from "./PurchasedCourses";

export function WelcomeUser() {
    const [courses, setCourses] = useState([]);
    const [purchasedCourses, setPurchasedCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
    }, []);

    async function fetchCourses() {
        try {
            const response = await axios.get(`${import.meta.env.VITE_ADMIN_BACKEND_URL}/allcourses`);
            setCourses(response.data);
            setLoading(false);
        } catch (e) {
            setLoading(false);
            setError(e.message);
            console.log("Error while fetching course from database", e);
        }
    }

    function PurchaseCourse(courseId) {
        // Find the purchased course
        const purchasedCourse = courses.find(course => course._id === courseId);
        
        // Add the purchased course to the local state
        setPurchasedCourses(prevState => [...prevState, purchasedCourse]);
        
        // Alert the user
        alert('Course purchased successfully');

        // Redirect to purchases page
        // navigate('/purchases');
    }

    return (
        <>
            {loading ?
                (<div className="loading_msg">LOADING...</div>) :
                error ?
                    (<div className="error_msg">{(error === "Network Error") ? <><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhCz_7R8H3elkwLcQ_zYP_J55iOLZ3VQL9S8lAqZCNXA&s"/></> : <>{error}</>}</div>) :
                    (
                        <div className="dashboard">
                            <div className="purchase_navbar">
                                <h1>Welcome to Edutech</h1>
                                <button id="purchased_courses" onClick={() => navigate('/purchases')}>PURCHASED COURSES</button>
                            </div>
                            <h2 id="courseheading">What would you like to <span id="highlight">learn?</span></h2>
                            <div className="displayCourses">
                                {courses.map((course) => (
                                    <div className="coursedetails" key={course._id}>
                                        <img id="course_img" src={course.image} alt="course"></img>
                                        <h1 id="course_title">{course.coursename}</h1>
                                        <p id="coursedescription">{course.description}</p>
                                        <h3 id="courseprice">₹{course.price}</h3>
                                        <div className="purchasesection">
                                            <button className="purchasebtn" id="PurchaseBtn" onClick={() => PurchaseCourse(course._id)}>Buy Now</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Render PurchasedCourses component with purchasedCourses state
                            <PurchasedCourses purchasedCourses={purchasedCourses} /> */}
                        </div>
                    )
            }
        </>
    );
}
