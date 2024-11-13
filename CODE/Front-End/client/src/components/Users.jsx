import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "./Loading";
import { setLoading } from "../redux/reducers/rootSlice";
import { useDispatch, useSelector } from "react-redux";
import Empty from "./Empty";
import fetchData from "../helper/apiCall";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const Users = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const getAllUsers = async () => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(`/user/getallusers`);
      setUsers(temp);
    } catch (error) {
      toast.error("Failed to load users. Please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const deleteUser = async (userId) => {
    const confirm = window.confirm("Are you sure you want to delete?");
    if (!confirm) return;

    try {
      await toast.promise(
        axios.delete("/user/deleteuser", {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          data: { userId },
        }),
        {
          loading: "Deleting user...",
          success: "User deleted successfully",
          error: "Unable to delete user",
        }
      );
      getAllUsers();
    } catch (error) {
      toast.error("An error occurred while deleting the user.");
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <section className="user-section">
          <h3 className="home-sub-heading">All Users</h3>
          {users.length > 0 ? (
            <div className="user-container">
              <table>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Pic</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Mobile No.</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Is Doctor</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1}</td>
                      <td>
                        <img
                          className="user-table-pic"
                          src={user.pic}
                          alt={user.firstname}
                        />
                      </td>
                      <td>{user.firstname}</td>
                      <td>{user.lastname}</td>
                      <td>{user.email}</td>
                      <td>{user.mobile}</td>
                      <td>{user.age}</td>
                      <td>{user.gender}</td>
                      <td>{user.isDoctor ? "Yes" : "No"}</td>
                      <td className="select">
                        <button
                          className="btn user-btn"
                          onClick={() => deleteUser(user._id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty />
          )}
        </section>
      )}
    </>
  );
};

export default Users;
