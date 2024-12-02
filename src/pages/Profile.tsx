import { FC, useEffect, useState } from "react";
import axiosInstance from "../config/axios.config";

// Define the expected data structure based on the API response
interface Role {
  name: string;
  description: string;
  permissions: { name: string; description: string }[];
}

interface UserData {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  dob: string;
  roles: Role[];
}

const Profile: FC = () => {
  const [userInfo, setUserInfo] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state

  // Fetch user data when the component mounts using axios
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Get token from localStorage
        if (!token) {
          setError("No authentication token found.");
          setLoading(false);
          return;
        }

        // Call the API using axios with the authorization token
        const response = await axiosInstance.get("http://localhost:8080/identity/users/myInfo", {
         
        });

        if (response.data && response.data.data) {
          setUserInfo(response.data.data); // Set user data to state
        } else {
          setError("Invalid response structure.");
        }
      } catch (error) {
        setError("Error fetching user data.");
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    fetchUserData(); // Call the fetch function
  }, []); // Empty dependency array, will only run once when the component mounts

  // Show a loading state if user data is not yet fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show error message if there's an error
  if (error) {
    return <div>{error}</div>;
  }

  // Render the profile data once loaded
  return (
  <div className="container mx-auto min-h-[83vh] w-full max-w-5xl dark:text-white">
    <h1 className="text-4xl p-4 font-bold font-lora">Your Account</h1>
    <div className="font-karla grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-1 p-4">
      {/* Profile Picture */}
      <img src={`https://www.gravatar.com/avatar/${userInfo?.id}`} alt="Profile" className="text-center" />

      {/* User Information Table */}
      <table className="table-auto w-full">
        <tbody>
          <tr>
            <td className="font-bold w-32">Username</td>
            <td>{userInfo?.username}</td>
          </tr>
          <tr>
            <td className="font-bold w-32">First Name</td>
            <td>{userInfo?.firstName}</td>
          </tr>
          <tr>
            <td className="font-bold w-32">Last Name</td>
            <td>{userInfo?.lastName}</td>
          </tr>
          <tr>
            <td className="font-bold w-32">Date of Birth</td>
            <td>{userInfo?.dob}</td>
          </tr>
          <tr>
            <td className="font-bold w-32">Roles</td>
            <td>{userInfo?.roles?.map((role) => role.name).join(", ")}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

};

export default Profile;
