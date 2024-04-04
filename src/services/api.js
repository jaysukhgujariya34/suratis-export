import axios from "axios";

const baseUrl = "http://localhost:8000";

export const GetApi = async (path) => {
  try {
    // eslint-disable-next-line prefer-const
    let response = await axios.get(baseUrl + path, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    // eslint-disable-next-line dot-notation
    if (response.data.token && response.data.token !== null) {
      // eslint-disable-next-line dot-notation
      localStorage.setItem("token", response.data.token);
    }
      if (response && response.status === 200) {
        console.log(response.data.message);
    //   toast.success(response.data.message);
    }
    return response;
  } catch (error) {
    if (error && error.response) {
      if (error && error.response && error.response.status === 400) {
          if (error.response.data.message) {
            console.log(error.response.data.message);
        //   toast.error(error.response.data.message);
          console.log(error);
        }
      }
    }
  }
};

export const PostApi = async (path, data) => {
  try {
    const response = await axios.post(baseUrl + path, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (response.data.token && response.data.token !== null) {
      localStorage.setItem("token", response?.data?.token);
    }

    if (response && response.status === 200) {
    //   toast.success(response.data.message);
    }
    return response;
  } catch (error) {
      if (error && error.response) {
        console.log(error.response);
    //   toast.error(error?.response?.data?.message);
    }
  }
};
