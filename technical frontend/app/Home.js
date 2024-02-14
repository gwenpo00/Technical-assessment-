import React, { useEffect, useState } from "react";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import LinearProgress from "@mui/joy/LinearProgress"; // Import LinearProgress
import axios from "axios";
import Table from "@mui/joy/Table";
import { Pagination } from "@mui/material";

const Home = () => {
  const [allDetails, setAllDetails] = useState([]);
  const [uploadInProgress, setUploadInProgress] = useState(false); // state to track upload progress
  const [uploadProgress, setUploadProgress] = useState(0); // state to track upload progress percentage
  const [currentPage, setCurrentPage] = useState(1); // state to track current page
  const [totalPages, setTotalPages] = useState(1); // state to track total pages
  const [searchTerm, setSearchTerm] = useState(""); // state to store search term
  const recordsPerPage = 20;
  const [pageRefresh, setPageRefresh] = useState(false);

  useEffect(() => {
    async function getFileDetails() {
      try {
        console.log("Getting details...");
        const response = await axios.get("http://localhost:8080/getInfo");
        console.log(response.data.results);
        if (response.data) {
          setAllDetails(response.data.results);
          console.log("can get details");
          // calculate total pages
          setTotalPages(
            Math.ceil(response.data.results.length / recordsPerPage)
          );
        } else {
          setAllDetails([]);
        }
      } catch (error) {
        console.log(error);
        console.log("cannot retrieve details");
      }
    }
    getFileDetails();
  }, [pageRefresh]);

  async function uploadFile(e) {
    e.preventDefault();
    try {
      const file = document.getElementById("fileUpload").files[0];
      if (!file) {
        window.alert("Please select a file to upload");
        return;
      }
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (fileExtension !== "csv") {
        window.alert("Only upload CSV files");
        document.getElementById("fileUpload").value = "";
        return;
      }
      const formData = new FormData();
      formData.append("file", file);

      setUploadInProgress(true);

      // to track upload progress
      const config = {
        onUploadProgress: async (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setUploadProgress(progress);
          await new Promise((resolve) => setTimeout(resolve, 500));
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await axios.post(
        "http://localhost:8080/upload",
        formData,
        config
      );
      if (response.data) {
        window.alert("File uploaded successfully");
      }
      console.log(response);
      setPageRefresh((prev) => !prev);
      setUploadInProgress(false);
      setUploadProgress(0);
      document.getElementById("fileUpload").value = "";
    } catch (error) {
      window.alert("Error uploading file");
      console.error(error);
      setUploadInProgress(false);
      setUploadProgress(0);
    }
  }

  //for the pagination
  const handlePageChange = (event, pageNumber) => {
    setCurrentPage(pageNumber);
  };

  //for the search input change
  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  //filter details based on search term, if no search, then show all details
  const filteredDetails = searchTerm
    ? allDetails.filter((detail) =>
        Object.values(detail).some((value) =>
          value.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : allDetails;

  //to calculate start and end index based on current page and records per page
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;

  useEffect(() => {
    //calculate total pages based on total records and records per page
    setTotalPages(Math.ceil(filteredDetails.length / recordsPerPage));
  }, [filteredDetails]);

  const handleCancelClick = () => {
    document.getElementById("fileUpload").value = "";
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <form method="post">
          <div style={{ display: "flex", marginBottom: "10px" }}>
            <Input
              id="fileUpload"
              type="file"
              style={{ marginRight: "10px" }}
            ></Input>
            <Button onClick={uploadFile} variant="outlined" color="primary">
              Upload file
            </Button>
            <Button
              onClick={handleCancelClick}
              variant="outlined"
              color="secondary"
              style={{
                border: "1px solid #333",
                marginLeft: "10px",
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
        {uploadInProgress && ( // show progress if upload is in progress
          <div style={{ marginTop: "10px" }}>
            <LinearProgress
              determinate
              value={uploadProgress}
              style={{ transition: "none" }}
            />
          </div>
        )}
      </div>

      <div>
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchInputChange}
          style={{ marginBottom: "10px" }}
        />
        <Table>
          <thead>
            <tr>
              <th>PostId</th>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Body</th>
            </tr>
          </thead>
          <tbody>
            {filteredDetails.slice(startIndex, endIndex).map((detail) => (
              <tr key={detail.id}>
                <td>{detail.postId}</td>
                <td>{detail.id}</td>
                <td>{detail.name}</td>
                <td>{detail.email}</td>
                <td>{detail.body}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
