
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import { slice } from './index';
import { toast } from 'react-toastify';
import { config } from '../../../../config';

let web;

if (Environment.type === EnvironmentType.Local) {
    web = Web("https://localhost:4323");
} else {
    web = Web(config.spURi);
}

export function addAccount(account){

  async function updatePrograms(mgr) {
    if (mgr.ACRONYM) {
      const result = await web.lists.getByTitle("DLA_Programs").items.filter("Acronym eq '"+mgr.ACRONYM+"'").select("ID", "Acronym", "ProgramManager").get().then( program => {
        return program[0];
      } );

      const { ID, ProgramManager } = result;
      const program = { ProgramManager }
      program.ProgramManager = ProgramManager && ProgramManager.trim() ? ProgramManager.trim() + ', ' + Title : Title;
      web.lists.getByTitle("DLA_Programs").items.getById(ID).update(program);
      console.log("got a resulting program: ", result, program);
    }
    if (mgr.JCODE) {
      let bi = 0, count = 0, list = web.lists.getByTitle("DLA_Programs"), batches = [web.createBatch()];
      const entityTypeFullName = await list.getListItemEntityTypeFullName();
      const results = await web.lists.getByTitle("DLA_Programs").items.filter("JCODE eq '"+mgr.JCODE+"'").select("ID", "Acronym", "JCODE", "PortfolioManager").get().then( programs => {
        return programs;
      } );

      results.forEach(p => {
        const { ID, PortfolioManager } = p;
        const program = { PortfolioManager }
        program.PortfolioManager = PortfolioManager && PortfolioManager.trim() ? PortfolioManager.trim() + ', ' + Title : Title;
        console.log("got a resulting program for JCODE: ", p, program);
        list.items.getById(ID).inBatch(batches[bi]).update(program);
        if (count++ === 399) batches.push(web.createBatch()), bi++, count = 0;
      });

      batches.forEach(async batch => {
          console.log("Updating batch: ", batch);
          await batch.execute().then(() => console.log('program portfolio mgr update execution complete.'))
              .catch(error => (console.log('Error updating program porfolio mgr: ', error)));
      });
    }
  }

  const { ACRONYM, JCODE, Title } = account;
  console.log('adding account: ', account);
  return async (dispatch) => {
    dispatch(slice.actions.setLoading(true));
    try {
        web.lists.getByTitle("DLA_Users").items.add(account).then( async result => {
            console.log('account added: ', account, result.data);
            dispatch(slice.actions.updateAccounts(result.data));
            if (ACRONYM || JCODE) await updatePrograms({ ACRONYM, JCODE });
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
        let items = await web.lists.getByTitle("DLA_Users").items.filter("Group eq '"+group+"'").getPaged();
        dispatch(slice.actions.setAccounts(items.results));

        if(items.hasNext){
            dispatch(slice.actions.setNext(items.nextUrl));
        }

        return items;

    };

}

export function getUser(email){

    return async (dispatch) => {
        dispatch(slice.actions.setLoading(true));
        const result = web.lists.getByTitle("DLA_Users").items.filter("Email eq '"+email+"'").get().then( user => {
            dispatch(slice.actions.setData(user[0]));
            return user[0];
        } );

        return result;

    };

}

export function getUserbyID(ID){

    return async (dispatch) => {
        dispatch(slice.actions.setLoading(true));
        const result = web.lists.getByTitle("DLA_Users").items.filter("ID eq '"+ID+"'").get().then( user => {
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
            web.lists.getByTitle("DLA_Users").items.getById(id).update(user);
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
            web.lists.getByTitle("DLA_Users").items.getById(account.ID).delete();
            toast.success(`Successfully removed account "${account.First_Name} ${account.Last_Name}"`);
            dispatch(slice.actions.removeAccount(account.ID));
            dispatch(slice.actions.setLoading(false));
        } catch (e) {
            toast.error("Error creating user");
            return e;
        }

    };
}
