import React from "react";

export function PurchasedCourses({ purchasedCourses }) {
    return (
        <div className="purchased_courses">
            <h2>Your Purchased Courses</h2>
            <ul>
                {purchasedCourses && purchasedCourses.length > 0 ? (
                    purchasedCourses.map(course => (
                        <li key={course._id}>{course.coursename}</li>
                    ))
                ) : (
                    <li>No purchased courses yet</li>
                )}
            </ul>
        </div>
    );
}
