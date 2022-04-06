import { Web } from "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import { toast } from 'react-toastify';
import { slice } from './index';
import { config } from '../../../../config';

let web;

if (Environment.type === EnvironmentType.Local) {
    web = Web("https://localhost:4323");
} else {
    web = Web(config.spURi);
}

export function getProgramImprovements(ID){

    return async (dispatch) => {
        dispatch(slice.actions.setLoading(true));
        let programs = web.lists.getByTitle("Improvements").items.filter("ProgramID eq '"+ID+"'").get().then( items => {
            if(items){
                dispatch(slice.actions.setProgramImprovements(items));
            }

        });

    };

}

export function setProgramImprovements(improvements){

    return async (dispatch) => {
        dispatch(slice.actions.setProgramImprovements(improvements));
    };

}

export function getUserProgram(ID){

    return async (dispatch) => {
        dispatch(slice.actions.setLoading(true));
        const result = web.lists.getByTitle("DLA_User_Programs").items.filter("ProgramID eq '"+ID+"'").get().then( user => {
            return user[0];
        } );

        return result;

    };

}

export function addUserProgram(program){

    return async (dispatch) => {
        dispatch(slice.actions.setLoading(true));
        try {
            const items: any[] = await web.lists.getByTitle("DLA_User_Programs").items.filter("ProgramID eq '"+program.ProgramID+"'").get();
            if (items.length > 0) {
                const update = await web.lists.getByTitle("DLA_User_Programs").items.getById(items[0].ID).update(program);
                toast.success(`Successfully updated Program "${program.Title}"`);
            }else{
                web.lists.getByTitle("DLA_User_Programs").items.add(program).then( result => {
                    console.log(result.data);
                    dispatch(slice.actions.updateUserPrograms(result.data));
                });
                toast.success(`Successfully added "${program.Title}"`);
            }

        } catch (e) {
            toast.error("Error adding Program");
            return e;
        }

    };
}

export function removeUserProgram(program){

    return async (dispatch) => {
        dispatch(slice.actions.setLoading(true));
        try {
            web.lists.getByTitle("DLA_User_Programs").items.filter("ProgramID eq '"+program.ID+"'").delete();
            dispatch(slice.actions.setLoading(false));
        } catch (e) {
            toast.error("Error creating user");
            return e;
        }

    };
}

export function updateUserProgram(program){

    return async (dispatch) => {
        dispatch(slice.actions.setLoading(true));
        try {

            const items: any[] = await web.lists.getByTitle("DLA_User_Programs").items.filter("ProgramID eq '"+program.ProgramID+"'").get();
            if (items.length > 0) {
                const update = await web.lists.getByTitle("DLA_User_Programs").items.getById(items[0].ID).update(program);
                toast.success(`Successfully updated Program "${program.Title}"`);
            }

            dispatch(slice.actions.setLoading(false));
        } catch (e) {
            toast.error("Error updating program");
            return e;
        }

    };
}

export function getUserPrograms(userID){

    return async (dispatch) => {
        dispatch(slice.actions.setLoading(true));
        let programIDs = [];
        let programs = web.lists.getByTitle("DLA_User_Programs").items.select("ProgramID").filter("UserID eq '"+userID+"' and Active eq 'Active'").top(50).orderBy("Created", false).get().then( items => {
            const list = Object.keys(items);
            list.map(item => {
                const programID = `${item['ProgramID']}`;
                programIDs.push(programID);
            });

            dispatch(slice.actions.setUserPrograms(programIDs));

            if(items.hasNext){
                dispatch(slice.actions.setNext(items.nextUrl));
            }

        });

    };

}

export function setUserPrograms(programs){

    return async (dispatch) => {

        dispatch(slice.actions.setUserPrograms(programs));

    };

}

export function getAllPrograms(){

    return async (dispatch) => {
        dispatch(slice.actions.setLoading(true));
        let programs = web.lists.getByTitle("DLA_Programs").items.filter("Active eq 'Active'").top(50).orderBy("Created", false).getPaged().then( items => {
            console.log('Ray - get all programs', items.results)
            dispatch(slice.actions.setPrograms(items.results))

            if(items.hasNext){
                dispatch(slice.actions.setNext(items.nextUrl));
            }

        });

    };

}

export function getDITMR(){

    return async (dispatch) => {
        dispatch(slice.actions.setLoading(true));
        let programs = web.lists.getByTitle("DITMR_Data").items.getAll().then( items => {
          console.log("got items: ", items)
            dispatch(slice.actions.setDITMR(items));

            if(items.hasNext){
                dispatch(slice.actions.setNext(items.nextUrl));
            }

        });

    };

}

export function getPortfolios(){

    return async (dispatch) => {
        dispatch(slice.actions.setLoading(true));
        let programs = web.lists.getByTitle("DLA_Portfolios").items.getAll().then( items => {
            dispatch(slice.actions.setPortfolios(items));

            if(items.hasNext){
                dispatch(slice.actions.setNext(items.nextUrl));
            }

        });

    };

}

export function getProgram(email){

    return async (dispatch) => {
        dispatch(slice.actions.setLoading(true));
        const result = web.lists.getByTitle("DLA_Programs").items.filter("Email eq '"+email+"'").get().then( user => {
            dispatch(slice.actions.setProgram(user[0]));
            return user[0];
        } );

        return result;

    };

}

export function getProgramByID(id){

    return async (dispatch) => {
        dispatch(slice.actions.setLoading(true));
        const program = await web.lists.getByTitle("DLA_Programs").items.select("ID", "Acronym").top(100).orderBy("Created", false).getById(id).get();
        dispatch(slice.actions.setProgram(program));

    };

}

export function addProgram(program){

    return async (dispatch) => {
        dispatch(slice.actions.addProgram(program));
    };

}

export function showProgramByID(id){

    return async (dispatch) => {
        dispatch(slice.actions.setLoading(true));
        const program = await web.lists.getByTitle("DLA_Programs").items.select("ID", "Acronym").top(100).orderBy("Created", false).getById(id).get();
        return program;

    };

}

export function getScoreHistory(program){

    return async (dispatch) => {
        dispatch(slice.actions.setLoading(true));
        const score = await web.lists.getByTitle("Total_Program_Scores").items.getByTitle(program).orderBy("Created", false).getAll().then( data => {
            if(data.length > 0){
                console.log(data);
                return data;
            }else{
                return false;
            }

        } );

    };

}

export async function getCompositeScore(id){

    const score = await web.lists.getByTitle("Total_Program_Scores").items.filter("ProgramID eq '"+id+"'").select("CompositeScore", "TotalScore", "TotalGoal").top(1).orderBy("Created", false).get().then( data => {
        if(data.length > 0){
            return data[0];
        }else{
            return 0.0;
        }

    } );

    return score;

}

export function addCompositeScore(score){

    return async (dispatch) => {
        try {

            dispatch(slice.actions.setLoading(true));
            const result = await web.lists.getByTitle("Total_Program_Scores").items.add(score);
            toast.success(`Successfully add Score for "${score.Title}"`);
            return result;

        } catch (e) {
            toast.error("Error adding Composite Score");
            return e;
        }


    };
}

export function addScore(score, type){

    return async (dispatch) => {
        try {

            dispatch(slice.actions.setLoading(true));
            const result = await web.lists.getByTitle(type).items.add(score);
            return result;

        } catch (e) {
            toast.error("Error adding score for " + type);
            console.log(e);
            return e;
        }
    };
}

export function getProgramScores(id, type){


    const select = ['ProgramID', 'Title', 'TargetScore', 'OriginalScore', 'GoalScore', 'TotalScoreID'];
    const defaultScore = {
        TargetScore: 0,
        OriginalScore: 0,
        GoalScore: 0
    };

    let filter = '';

    if(type === 'history'){
        filter = `TotalScoreID eq ${id}`;
    }else{
        filter = `ProgramID eq ${id}`;
    }

    return async (dispatch) => {
        dispatch(slice.actions.setLoading(true));

        const governance = await web.lists.getByTitle("Program_Governance").items.select(select).filter(filter).top(1).orderBy("Created", false).get().then( data => {
            return data[0] ? data[0]: defaultScore;
        } );

        const operations =  await web.lists.getByTitle("Program_Operations").items.select(select).filter(filter).top(1).orderBy("Created", false).get().then( data => {
            return data[0] ? data[0]: defaultScore;
        } );

        const people =  await web.lists.getByTitle("Program_People_Culture").items.select(select).filter(filter).top(1).orderBy("Created", false).get().then( data => {
            return data[0] ? data[0]: defaultScore;
        } );

        const strategy =  await web.lists.getByTitle("Program_Strategy").items.select(select).filter(filter).top(1).orderBy("Created", false).get().then( data => {
            return data[0] ? data[0]: defaultScore;
        } );

        const technology =  await web.lists.getByTitle("Program_Technology").select(select).items.filter(filter).top(1).orderBy("Created", false).get().then( data => {
            return data[0] ? data[0]: defaultScore;
        } );

        const scoreData = {governance, operations, people, strategy, technology};

        console.log("Got score data: ", scoreData);

        dispatch(slice.actions.setProgramScores(scoreData));

    };

}

export function getProgramHistory(id){

  console.log("getting programs history for: ", id);


    const select = ["*", "Author/ID", "Author/Title"];
    let includeFields = ['ID', 'Title', 'Modified', 'Modified By', 'Created', 'Created By'];
    let filter = `ProgramID eq ${id}`;

    return async (dispatch) => {
        dispatch(slice.actions.setLoading(true));

        const score = await web.lists.getByTitle("Total_Program_Scores").items.filter(filter).top(5).select(select).expand("Author").orderBy("Created", false).get().then( data => {
            return data[0] ? data: [];
        } );

        const insights = await web.lists.getByTitle("Insights").items.filter(filter).top(5).select(select).expand("Author").orderBy("Created", false).get().then( data => {
            return data[0] ? data: [];
        } );

        const improvements = await web.lists.getByTitle("Improvements").items.filter(filter).top(5).select(select).expand("Author").orderBy("Created", false).get().then( data => {
            return data[0] ? data: [];
        } );

        const historyData = {improvements, insights, score};

        console.log("got history data for: ", id, historyData);

        dispatch(slice.actions.setProgramHistory(historyData));

    };

}



export function removeInsight(id){

    return async (dispatch) => {
        dispatch(slice.actions.setLoading(true));
        try {
            const items = await web.lists.getByTitle("Insights").items.getById(id).get();
            if (items) {
                web.lists.getByTitle("Insights").items.getById(id).delete();
                dispatch(slice.actions.setLoading(false));

            }

            toast.success(`Successfully removed Insight`);

        } catch (e) {
            toast.error("Error removing insight");
            return e;
        }

    };
}

export function addInsight(id, insight){

    return async (dispatch) => {
        dispatch(slice.actions.setLoading(true));
        try {
            if(id > 0){
                const item = await web.lists.getByTitle("Insights").items.filter(`Id eq ${id}`).get();
                if (item) {
                    web.lists.getByTitle("Insights").items.getById(id).update(insight);
                    dispatch(slice.actions.setLoading(false));
                    toast.success(`Successfully updated Insight`);
                }

            }else{

                web.lists.getByTitle("Insights").items.add(insight);
                dispatch(slice.actions.setLoading(false));
                toast.success(`Successfully added Insight`);

            }
        } catch (e) {
            toast.error("Error adding insight");
            console.log(e);
            return e;
        }

    };
}

export function getProgramInsights(id){

    const select = ['ID','Lens', 'Content'];

    return async (dispatch) => {
        dispatch(slice.actions.setLoading(true));

        const governance = await web.lists.getByTitle("Insights").items.select(select).filter(`ProgramID eq ${id} and Lens eq 'governance'`).orderBy("Created", false).getAll().then( data => {
            return data ? data: [];
        } );

        const operations =  await web.lists.getByTitle("Insights").items.select(select).filter(`ProgramID eq ${id} and Lens eq 'operations'`).orderBy("Created", false).getAll().then( data => {
            return data ? data: [];
        } );

        const people =  await web.lists.getByTitle("Insights").items.select(select).filter(`ProgramID eq ${id} and Lens eq 'people'`).orderBy("Created", false).getAll().then( data => {
            return data ? data: [];
        } );

        const strategy =  await web.lists.getByTitle("Insights").items.select(select).filter(`ProgramID eq ${id} and Lens eq 'strategy'`).orderBy("Created", false).getAll().then( data => {
            return data ? data: [];
        } );

        const technology =  await web.lists.getByTitle("Insights").items.select(select).filter(`ProgramID eq ${id} and Lens eq 'technology'`).orderBy("Created", false).getAll().then( data => {
            return data ? data: [];
        } );

        const insightData = {governance, operations, people, strategy, technology};

        dispatch(slice.actions.setProgramInsights(insightData));
        return insightData;

    };

}

export function getProgramBudgets(acronym){
    console.log("finding budgets for: ", `"${acronym}"`);

    return async (dispatch) => {
        dispatch(slice.actions.setLoading(true));

        // const budgets = await web.lists.getByTitle("DLABudgets").items.getAll().then( data => {
        const budgets = await web.lists.getByTitle("DLA_BudgetData").items.filter(`program eq '${acronym}'`).get().then( data => {
            return data ? data: [];
        } );

        const budgetData = {budgets};

        dispatch(slice.actions.setProgramBudgets(budgetData));
        return budgetData;
    };

}

export function replaceProgramBudgets(newData){
    console.log("replacing budgets.");
    return async (dispatch) => {
        dispatch(slice.actions.setLoading(true));

        let bi = 0, count = 0, list = web.lists.getByTitle("DLA_BudgetData"), batches = [web.createBatch()];
        const entityTypeFullName = await list.getListItemEntityTypeFullName();
        const budgets = await list.items.getAll().then(data => data ? data: []);

        let success = true;

        let added = 0, total = newData.length - 1;
        newData.map(d => {
            d.Title = d.REQ_ID, delete d.REQ_ID;
            for (const key in d) {
                if (d[key]==="") d[key] = null;
                if (key.includes(' '))
                    d[key.replace(/\s/g, '_x0020_').substr(0, 32)] = d[key], delete d[key];
            }
            return d;
        }).forEach(d => {
            list.items.inBatch(batches[bi]).add(d, entityTypeFullName).then(r =>
            console.log('budget item added successfully!', d, r, ++added, (added / total * 100).toFixed(2) + '%'))
            .catch(error => (success = false, console.log('Error adding budget item: ', error, "item: ", d)));
            if (count++ === 399) batches.push(web.createBatch()), bi++, count = 0;
        });

        budgets.forEach(b => {
            list.items.getById(b.ID).inBatch(batches[bi]).delete();
            if (count++ === 399) batches.push(web.createBatch()), bi++, count = 0;
        });

        batches.forEach(async batch => {
            console.log("Updating batch: ", batch);
            await batch.execute().then(() => console.log('budget update execution complete.'))
                .catch(error => (success = false, console.log('Error replacing budgets: ', error)));
        });
        return success;
    };

}

export function removeImprovement(id){

    return async (dispatch) => {
        dispatch(slice.actions.setLoading(true));
        try {
            const items = await web.lists.getByTitle("DLA_Improvements").items.getById(id).get();
            if (items) {
                web.lists.getByTitle("DLA_Improvements").items.getById(id).delete();
                dispatch(slice.actions.setLoading(false));

            }

            toast.success(`Successfully removed Improvement`);

        } catch (e) {
            toast.error("Error removing improvement");
            return e;
        }

    };
}

export function updateProgramApproval(program){

    return async (dispatch) => {
        // dispatch(slice.actions.setLoading(true));
        try {
          delete program.Score
          delete program.Original
          console.log("updating program: ", program)
          web.lists.getByTitle("DLA_Programs").items.getById(program.ID).update(program);
          // dispatch(slice.actions.setLoading(false));
          toast.success(`Updated Approal Status for ${program.Title}!`);
        } catch (e) {
            toast.error("Error updating Approval status");
            console.log(e);
            return e;
        }

    };
}

export function updateProgramBLUF(program, BLUF){

    return async (dispatch) => {
        dispatch(slice.actions.setLoading(true));
        try {
          const update = { BLUF };
          console.log("updating program: ", program, update)
          web.lists.getByTitle("DLA_Programs").items.getById(program.ID).update(update);
          dispatch(slice.actions.setLoading(false));
          toast.success(`Updated BLUF for ${program.Title}!`);
        } catch (e) {
            toast.error("Error updating program BLUF");
            console.log(e);
            return e;
        }

    };
}

export function addDLAImprovement(id, improvement){

    return async (dispatch) => {
        dispatch(slice.actions.setLoading(true));
        try {
            if(id > 0){
                const item = await web.lists.getByTitle("DLA_Improvements").items.filter(`Id eq ${id}`).get();
                if (item) {
                    web.lists.getByTitle("DLA_Improvements").items.getById(id).update(improvement);
                    dispatch(slice.actions.setLoading(false));
                    toast.success(`Updated Improvement successfuly!`);
                }

            }else{
                console.log(improvement);
                web.lists.getByTitle("DLA_Improvements").items.add(improvement);
                dispatch(slice.actions.setLoading(false));
                toast.success(`Successfully added Improvement`);

            }
        } catch (e) {
            toast.error("Error adding Improvement");
            console.log(e);
            return e;
        }

    };
}

export function getDLAImprovements(id){

    const select = ['ID', 'Manager', 'Remediation', 'Responsibility', 'Estimated_Completion', 'Status'];

    return async (dispatch) => {
        dispatch(slice.actions.setLoading(true));

        const governance = await web.lists.getByTitle("DLA_Improvements").items.select(select).filter(`ProgramID eq ${id} and Lens eq 'governance'`).orderBy("Created", false).getAll().then( data => {
            return data ? data: [];
        } );

        const operations =  await web.lists.getByTitle("DLA_Improvements").items.select(select).filter(`ProgramID eq ${id} and Lens eq 'operations'`).orderBy("Created", false).getAll().then( data => {
            return data ? data: [];
        } );

        const people =  await web.lists.getByTitle("DLA_Improvements").items.select(select).filter(`ProgramID eq ${id} and Lens eq 'people'`).orderBy("Created", false).getAll().then( data => {
            return data ? data: [];
        } );

        const strategy =  await web.lists.getByTitle("DLA_Improvements").items.select(select).filter(`ProgramID eq ${id} and Lens eq 'strategy'`).orderBy("Created", false).getAll().then( data => {
            return data ? data: [];
        } );

        const technology =  await web.lists.getByTitle("DLA_Improvements").items.select(select).filter(`ProgramID eq ${id} and Lens eq 'technology'`).orderBy("Created", false).getAll().then( data => {
            return data ? data: [];
        } );

        const improvementData = {governance, operations, people, strategy, technology};

        console.log("got improvement data: ", improvementData);

        dispatch(slice.actions.setProgramImprovements(improvementData));
        return improvementData;

    };

}

export function getProgramAccomplishments(id){

    return async (dispatch) => {
        dispatch(slice.actions.setLoading(true));
        const result = web.lists.getByTitle("DLA_Users").items.filter("Email eq '"+id+"'").get().then( user => {
            dispatch(slice.actions.setProgram(user[0]));
            return user[0];
        } );

        return result;

    };

}

export function getProgramByAcronym(acronym){

  return async (dispatch) => {
      dispatch(slice.actions.setLoading(true));
      const program = await web.lists.getByTitle("DLA_Programs").items.filter(`Acronym eq '${acronym}'`).get();
      dispatch(slice.actions.setProgram(program[0]));

  };

}

