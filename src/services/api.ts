import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: (USN: string, password: string) => 
    api.post('/auth/login', { USN, password }),
  register: (userData: any) => 
    api.post('/auth/register', userData)
};

export const student = {
  addGrades:(studentId: string, grades:{ subjectCode: string; grade: string }[])=>api.put('/student/addgrade',{studentId,grades}),
  getStudents:()=>api.get('/student/allstudents'),
  getSubjects: () => api.get('/student/allsubjects'),
  registeredsubjects: (userId) => api.get(`/student/registeredsubjects?userId=${userId}`),

  getProfile: () => api.get('/student/profile'),
  registerSubjects: (subjectIds: string[]) => 
    api.post('/student/register-subjects', { subjectIds }),
  applyChallengeValuation: (subjectId: string) =>
    api.post('/student/challenge-valuation', { subjectId }),
  getPayments: () => api.get('/student/payments'),
  getResults: () => api.get('/student/results'),
  createOrder:(SubjectId:string,userId:string)=>api.post('/student/purchase',{SubjectId,userId}),
  getApiKey:()=>api.get('/student/getApiKey'),
  verifyPayment:(razorpay_order_id:string, razorpay_payment_id:string, razorpay_signature:string, SubjectId:string, UserId:string)=>api.post('/student/verifypayment',{razorpay_order_id, razorpay_payment_id, razorpay_signature, SubjectId, UserId})
};

export const admin = {
  addSubject: (subjectData: any) => 
    api.post('/admin/subjects', subjectData),
  login:(email:string,password:string)=>
    api.post('/admin/login',{email,password}),
  assignUSN: (userId: string, USN: Number) =>
    api.patch(`/admin/assign-usn/${userId}`, { USN }),
  addGrades: (gradeData: any) =>
    api.post('/admin/grades', gradeData),
  allSubjects:()=>
    api.get('/admin/allSubjects'),
  DeleteSubject: (subjectId: string) =>
    api.delete('/admin/subject', { data: { subjectId } }),  
  FindSubject: (subjectId: string) =>
    api.get(`/admin/particularSubject?subjectId=${subjectId}`)
  
};

export const Faculty={
  register:(name:string,email:string,password:string)=>
    api.post('/faculty/register',{name,email,password}),
  login:(email:string,password:string)=>
    api.post('/Faculty/login',{email,password}),
}