import { PageContext } from "@microsoft/sp-page-context";
import {
    SPHttpClient,
    SPHttpClientResponse
} from '@microsoft/sp-http';
import "@pnp/polyfill-ie11";
import { sp } from "@pnp/sp/presets/all";
import { Web } from "@pnp/sp/webs";
import { ConsoleListener, Logger, LogLevel } from "@pnp/logging";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import { slice } from './index';
import { toast } from 'react-toastify';

let web;

if (Environment.type === EnvironmentType.Local) {  
    web = Web("https://localhost:4323");
} else {
    web = Web("https://dlamil.dps.mil/sites/SPO_PEODashboard");
    // web = Web("https://codicast1.sharepoint.com/");
}

export function addAccount(account){
    
    return async (dispatch) => {
        dispatch(slice.actions.setLoading(true));
        try {
            sp.web.lists.getByTitle("DLA_Users").items.add(account).then( result => {
                console.log(result.data);
                dispatch(slice.actions.updateAccounts(result.data));
            });
            toast.success(`Successfully added account "${account.First_Name} ${account.Last_Name}"`);
            
        } catch (e) {
            toast.error("Error creating user");
            return e;
        }
        
    }; 
}

export function checkUserFolder(user){

    try {
        const getFolder = web.rootFolder.folders.getByName("User Images/"+user);
        console.log(getFolder.length);
        if(getFolder.length == 0){
            const newFolder = web.rootFolder.folders.add("User Images/"+user);
        }
    } catch (e) {
        toast.error("Error adding image");
        return e;
    }
    
}

export function getAccounts(group){

    return async (dispatch) => {
        dispatch(slice.actions.setLoading(true));
        let items = await sp.web.lists.getByTitle("DLA_Users").items.filter("Group eq '"+group+"'").getPaged();
        dispatch(slice.actions.setAccounts(items.results));
        return items;
        
    };

}

export function getUser(email){

    return async (dispatch) => {
        dispatch(slice.actions.setLoading(true));
        const result = sp.web.lists.getByTitle("DLA_Users").items.filter("Email eq '"+email+"'").get().then( user => {
            dispatch(slice.actions.setData(user[0]));
            return user[0];
        } );
        
        return result;
        
    };

}

export function getUserbyID(ID){

    return async (dispatch) => {
        dispatch(slice.actions.setLoading(true));
        const result = sp.web.lists.getByTitle("DLA_Users").items.filter("ID eq '"+ID+"'").get().then( user => {
            return user[0];
        } );
        
        return result;
        
    };

}

export function updateUserImage(user, file){

    return async (dispatch) => {
        try {
            if (file.size <= 10485760) {
    
                // small upload
                const uploadFile = await web.getFolderByServerRelativeUrl("/User Images/"+user+"/").files.add(file.name, file, true).then( result => {
                    dispatch(slice.actions.setImage(result.data));
                    toast.success(`Successfully uploaded image "${file.name}`);
                    return result.data;
                });  

                return uploadFile;

            } else {
                // large upload
                toast.error("File Too Large");
                return false;
                // return async (dispatch) => {
                //     web.getFolderByServerRelativeUrl("/User Images/"+user+"/").files.addChunked(file.name, file, data => {
    
                //         console.log({ data: data, level: LogLevel.Verbose, message: "progress" });
        
                //     }, true);                
                // }
                
            }
        } catch (e) {
            toast.error("Error adding image");
            return e;
        }
    };

    
}

export function updateUser(id, user){
    
    return async (dispatch) => {
        dispatch(slice.actions.setLoading(true));
        try {
            console.log(user);
            sp.web.lists.getByTitle("DLA_Users").items.getById(id).update(user);
            toast.success(`Successfully updated user "${user.First_Name} ${user.Last_Name}"`);
            dispatch(slice.actions.setLoading(false));
        } catch (e) {
            toast.error("Error creating user");
            return e;
        }
        
    }; 
}

export function removeAccount(account){
    
    return async (dispatch) => {
        dispatch(slice.actions.setLoading(true));
        try {
            sp.web.lists.getByTitle("DLA_Users").items.getById(account.ID).delete();
            toast.success(`Successfully removed account "${account.First_Name} ${account.Last_Name}"`);
            dispatch(slice.actions.removeAccount(account.ID));
            dispatch(slice.actions.setLoading(false));
        } catch (e) {
            toast.error("Error creating user");
            return e;
        }
        
    }; 
}