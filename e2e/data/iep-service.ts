import { api } from "../helpers";
import moment from '../../node_modules/moment/moment'

export const getIepSearch = async (token: string, baseApiUrl: string, request): Promise<any> => {
  const payload = {
    pageNo: 1,
    pageSize: 50,
    sortBy: "Student Name",
    sortDirection: "asc",
    status: "yes",
  };

  return await api.postRequest(
    token,
    request,
    `${baseApiUrl}/api/iep/search`,
    payload
  );
};

export const getCasemisTableA = async (token: string, baseApiUrl: string, request, studentId): Promise<any> => {
  const payload = {
    isIneligible: false,
    reptDate: moment(new Date()).format("MM/DD/YYYY"),
  };

  return await api.postRequest(
    token,
    request,
    `${baseApiUrl}/api/casemis/tableA/${studentId}/0`,
    payload
  );
};

export const getCasemisTableB = async (token: string, baseApiUrl: string, request, studentId): Promise<any> => {
	const payload = {
	  isIneligible: false,
	  reptDate: moment(new Date()).format("MM/DD/YYYY"),
	};
  
	return await api.postRequest(
	  token,
	  request,
	  `${baseApiUrl}/api/casemis/tableB/${studentId}/0`,
	  payload
	);
};