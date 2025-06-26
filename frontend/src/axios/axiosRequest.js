import axios from 'axios'
import { getAuthToken, getBaseURL, getSecurityPin } from '../utils/helperFunctions'

// fetch data directly
export function fetchData(path, setData, setError) {
    const token = getAuthToken();
    axios.get(getBaseURL() + path, {headers : {
        Authorization : `Bearer ${token}`
    }})
    .then(res =>{
        if(res.status === 200){
            setData(res.data);
        }
    })
    .catch(err =>{
        console.log(err);
        setError('Failed to load the data');
    })
}

// fetch data with security pin
export function fetchSecureData(path, setData, setError) {
    const token = getAuthToken();
    const securityPin = getSecurityPin();
    if(!securityPin){
        setError('No security pin provided');
        return;
    }
    axios.get(getBaseURL() + path, {headers : {
        Authorization : `Bearer ${token}`,
        'x-securityPin' : securityPin
    }})
    .then(res =>{
        if(res.status === 200){
            setData(res.data);
            console.log(res.data);
        }
    })
    .catch(err =>{
        console.log(err);
        setError('Failed to load the data');
    })
}
