import { useState } from "react";
import { Faculty } from "../../services/api";

export default function AddFaculty() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function AddnewFaculty(e: any) {
        e.preventDefault();
        try {
            await Faculty.register(name, email, password);
            
                alert("Faculty registered successfully");
                setName("");
                setEmail("");
                setPassword("");
            
        } catch (error) {
            console.error(error);
            alert("An unexpected error occurred");
        }
    }

    return (
        <div className="flex flex-col items-center justify-center bg-white p-4">
            <h1 className="text-2xl font-bold mb-4">Add Faculty</h1>
            <form className="w-1/2 bg-gray-100 p-4 rounded shadow" onSubmit={AddnewFaculty}>
                <div className="mb-4">
                    <label className="block text-black font-medium mb-2" htmlFor="name">
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        className="text-black w-full px-3 py-2 border rounded"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-black font-medium mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="text-black w-full px-3 py-2 border rounded"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-black font-medium mb-2" htmlFor="password">
                        Set Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        className="text-black w-full px-3 py-2 border rounded"
                        placeholder="Set Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="bg-black text-white px-4 py-2 rounded">
                    Add Faculty
                </button>
            </form>
        </div>
    );
}
