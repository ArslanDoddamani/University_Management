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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Add Faculty</h1>
      <form
        className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg"
        onSubmit={AddnewFaculty}
      >
        <div className="mb-4">
          <label className="block font-medium mb-2" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            className="w-full px-3 py-2 border rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-3 py-2 border rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2" htmlFor="password">
            Set Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-3 py-2 border rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Set Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Faculty
        </button>
      </form>
    </div>
  );
}
