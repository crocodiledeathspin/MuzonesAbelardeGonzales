import AxiosInstance from "./AxiosInstance";

const UserService = {
loadUsers: async (page = 1, search = '') => {
    try {
      const params = new URLSearchParams({ page: page.toString() });
      if (search) params.append('search', search);
      const response = await AxiosInstance.get(`/user/loadUsers?${params.toString()}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  loadUser: async (userId: string | number) => {
    try {
      const response = await AxiosInstance.get(`/user/loadUser/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  storeUser: async (data: any) => {
    try {
      const response = await AxiosInstance.post("/user/storeUser", data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  updateUser: async (userId: string | number, data: any) => {
    try {
      const response = await AxiosInstance.put(
        `/user/updateUser/${userId}`,
        data,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  destroyUser: async (userId: string | number) => {
    try {
      const response = await AxiosInstance.delete(`/user/destroyUser/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};
    
export default UserService;
