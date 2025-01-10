import { useEffect, useState } from "react";
import { admin } from "../../services/api";

export default function Allsubjects(){
    const [subjects,setSubjects]=useState([]);

    useEffect(()=>{
        async function fetchSubjects(){
            const response = await admin.allSubjects();
            setSubjects(response.data);
        }

        fetchSubjects()

    },[]);

    async function DeleteSubject(subjectId:any,name:String){
        alert('subject id is '+subjectId);
        let res=confirm('Are you sure to delete the subject '+name);
        if(!res) return;
        try{
            const response=await admin.DeleteSubject(subjectId);
            alert('subject deleted successfully');
        }catch(err){
            alert('error while deleting subject');
        }
        
    }

    // async function EditSubject(subjectId:any){
    //     alert('subject id is '+subjectId);
    //     let res=confirm('Are you sure to delete the subject '+name);
        
    // }

    return(<div className="text-black">
        <h1>All subjects</h1><br />
        <div>
            {subjects.map((subject, index) => (
                <div className="border-2 border-black p-2 m-2" key={subject._id}>
                    <h2>name {subject.name}</h2>
                    <h2>semester{subject.semester}</h2>
                    <h2>credits{subject.credits}</h2>
                    <h2>department{subject.department}</h2>
                    <h2>registration{subject.fees.registration}</h2>
                    <h2>reRegistrationF{subject.fees.reRegistrationF}</h2>
                    <h2>reRegistrationW{subject.fees.reRegistrationW}</h2>
                    <h2>challengeValuation{subject.fees.challengeValuation}</h2>
                    <div>
                    {/* <button className="bg-green-500 text-white p-1 m-2 cursor-pointer">Edit</button> */}
                    <button className="bg-red-500 text-white p-1 m-2 cursor-pointer" onClick={()=>DeleteSubject(subject._id,subject.name)}>Delete</button>
                    </div>
                    </div>
            ))}
        </div>
    </div>)
}