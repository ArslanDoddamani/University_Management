export const calculateGrades = (grades) => {
  const gradePoints = {
    'S': 10,
    'A': 9,
    'B': 8,
    'C': 7,
    'D': 6,
    'E': 5,
    'F': 0,
    'W': 0
  };

  const semesterResults = {};
  let totalCredits = 0;
  let totalPoints = 0;

  // Group grades by semester
  grades.forEach(grade => {
    const sem = grade.semester;
    if (!semesterResults[sem]) {
      semesterResults[sem] = {
        grades: [],
        sgpa: 0,
        totalCredits: 0,
        totalPoints: 0
      };
    }

    const points = gradePoints[grade.grade] * grade.subject.credits;
    semesterResults[sem].grades.push({
      subject: grade.subject,
      grade: grade.grade,
      points
    });

    semesterResults[sem].totalCredits += grade.subject.credits;
    semesterResults[sem].totalPoints += points;
    
    totalCredits += grade.subject.credits;
    totalPoints += points;
  });

  // Calculate SGPA for each semester
  Object.keys(semesterResults).forEach(sem => {
    const result = semesterResults[sem];
    result.sgpa = result.totalPoints / result.totalCredits;
  });

  // Calculate CGPA
  const cgpa = totalPoints / totalCredits;

  return {
    semesterResults,
    cgpa
  };
};