import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import AppLoader from '../../loader';
import {
    MDBContainer,
    MDBRow,
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBCardTitle,
    MDBCardText,
    MDBCol,
    MDBTypography,
    MDBDropdownItem,
    MDBBadge
} from 'mdbreact';
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { portfolioData } from "./graphql/data";
import { FYReceivedAuthority, FYAnticipated } from "./graphql/allgraphvalues";
import Chart from "react-google-charts";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            padding: theme.spacing(2)
        },
        paper: {
            position:'relative',
            padding: theme.spacing(2),
            margin: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
            maxHeight: 600,
        },
}));

export default function Budgets() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.user.loading);
    const user = useSelector((state) => state.user.data);

    const [s, setState] = React.useState<any>({
        supportedPrograms: [],
        ReceivedBudgetAuthority: "922,143,547.34",
        AnticipatedReimbursable: "23,666,362.12",
        ReceivedReimbursable: "777,899,227.86",
        UFR: "679,344,231.09",
        FYReceivedAuthority: FYReceivedAuthority,
        FYAnticipated: FYAnticipated,
        graphFV1: [],
        portfolioSel:"",
        programsSel:"",
    });


    const renderCalculations = (data) => () => {
        console.log(data.portfolioSel);
        setState({
            ReceivedBudgetAuthority: data.ReceivedBudgetAuthority,
            AnticipatedReimbursable: data.AnticipatedReimbursable,
            ReceivedReimbursable: data.ReceivedReimbursable,
            UFR: data.UFR,
            supportedPrograms: data.supportedPrograms,
            FYReceivedAuthority: data.FYReceivedAuthority,
            FYAnticipated: data.FYAnticipated,
            portfolioSel: data.portfolioSel,
            programsSel: ""
        });
    };

    const renderGraph = (data) => () => {
        const graphData = data.graph;
        console.log(graphData);
        const FYReceivedAuthority_graph = graphData[0];
        const FYAnticipated_graph = graphData[1];
        setState({
            FYReceivedAuthority: FYReceivedAuthority_graph,
            FYAnticipated: FYAnticipated_graph,
            programsSel: data.programsSel,
        });
    };


    const bg_portfolio = { backgroundColor: "#B3C7E7", height: 35, borderRadius: 5 };
    const bg_portfolioSelected = { backgroundColor: "#04487B", height: 35, borderRadius: 5 };
    const portfolioText = { paddingTop: 6, color: "#212121", fontWeight: 500, fontSize: 13 };
    const portfolioTextSelected = { paddingTop: 6, color: "#fff", fontWeight: 500, fontSize: 13 };

    const bg_program = { backgroundColor: "#B3C7E7", height: 25, borderRadius: 5 };
    const bg_programSelected = { backgroundColor: "#04487B", height: 25, borderRadius: 5 };
    const programText = { paddingTop: 2, color: "#212121", fontWeight: 500, fontSize: 12 };
    const programTextSelected = { paddingTop: 2, color: "#fff", fontWeight: 500, fontSize: 12 };


    return (
        <MDBContainer>
            <MDBRow className="mt-3 ">
                <MDBCol className="mt-1 mb-1" lg="3" md="6" sm="12" >
                    <MDBCard className="border border-light" style={{ borderRadius: 0, backgroundColor: "#C6D0FF" }} >
                        <MDBCardBody className="mb-1 pb-2  mt-1 pt-2">
                            <MDBCardText className="text-center mb-0 pb-2 mt-0 pt-0" style={{ fontSize: 15, color: "#212121", fontWeight: 400 }}>Received Budget Authority</MDBCardText>
                            <MDBCardTitle style={{ fontSize: 21 }} className="text-center mb-0 pb-0 mt-0 pt-0" >${s.ReceivedBudgetAuthority}</MDBCardTitle>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol className="mt-1 mb-1" lg="3" md="6" sm="12">
                    <MDBCard className="border border-light" style={{ borderRadius: 0, backgroundColor: "#FFAEAE" }} >
                        <MDBCardBody className="mb-1 pb-2  mt-1 pt-2">
                            <MDBCardText className="text-center mb-0 pb-2 mt-0 pt-0" style={{ fontSize: 15, color: "#212121", fontWeight: 400 }}>Anticipated Reimbursable </MDBCardText>
                            <MDBCardTitle style={{ fontSize: 21 }} className="text-center mb-0 pb-0 mt-0 pt-0" >${s.AnticipatedReimbursable}</MDBCardTitle>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol className="mt-1 mb-1" lg="3" md="6" sm="12">
                    <MDBCard className="border border-light" style={{ borderRadius: 0, backgroundColor: "#AEFFC6" }} >
                        <MDBCardBody className="mb-1 pb-2  mt-1 pt-2">
                            <MDBCardText className="text-center mb-0 pb-2 mt-0 pt-0" style={{ fontSize: 15, color: "#212121", fontWeight: 400 }}>Received Reimbursable</MDBCardText>
                            <MDBCardTitle style={{ fontSize: 21 }} className="text-center mb-0 pb-0 mt-0 pt-0" >${s.ReceivedReimbursable}</MDBCardTitle>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol className="mt-1 mb-1" lg="3" md="6" sm="12" >
                    <MDBCard className="border border-light" style={{ borderRadius: 0, backgroundColor: "#F8FB92" }} >
                        <MDBCardBody className="mb-1 pb-2  mt-1 pt-2">
                            <MDBCardText className="text-center mb-0 pb-2 mt-0 pt-0" style={{ fontSize: 15, color: "#212121", fontWeight: 400 }}>UFR</MDBCardText>
                            <MDBCardTitle style={{ fontSize: 21 }} className="text-center mb-0 pb-0 mt-0 pt-0" >${s.UFR}</MDBCardTitle>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
            <MDBRow className="mt-3 ">
                <MDBCol lg="10" md="12" sm="12" >
                    <MDBCard className="border border-light">
                        <MDBCardBody className="mb-0 pb-1 mt-0 pt-1 ">
                            <MDBRow >
                                {portfolioData.map((data, key) => {
                                    return (
                                        <MDBCol key={key} onClick={renderCalculations({
                                            ReceivedBudgetAuthority: data.ReceivedBudgetAuthority,
                                            AnticipatedReimbursable: data.AnticipatedReimbursable,
                                            ReceivedReimbursable: data.ReceivedReimbursable,
                                            UFR: data.UFR,
                                            supportedPrograms: data.supportedPrograms,
                                            portfolioSel:data.portfolio,
                                            FYReceivedAuthority:data.FYReceivedAuthority,
                                            FYAnticipated:data.FYAnticipated,
                                        })} className="border border-light " style={(s.portfolioSel!=data.portfolio)?bg_portfolio:bg_portfolioSelected} lg="2" md="4" sm="4"  >
                                            <p style={(s.portfolioSel!=data.portfolio)?portfolioText:portfolioTextSelected}>{data.portfolio}</p>
                                        </MDBCol>
                                    );
                                })}
                            </MDBRow>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>

            <MDBRow className="mt-3 ">
                
                <MDBCol className="mt-1 mb-1" lg="4" md="12" sm="12" >
                    <MDBCard className="border border-light" style={{ borderRadius: 0 }} >
                        <MDBCardBody className="mb-1 pb-2  mt-1 pt-2 text-center">
                            <p style={{ fontWeight: 600, fontSize: 18 }}>FY 2020 Received Authority</p>
                            <Chart
                                width="100%"
                                height={200}
                                chartType="ColumnChart"
                                loader={<div>Loading Chart</div>}
                                data={s.FYReceivedAuthority}
                                options={{
                                    title: '',
                                    chartArea: { width: '60%', paddingLeft: 100 },
                                    hAxis: { title: '', minValue: 0 },
                                    vAxis: { title: '' },
                                }}
                            />
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol className="mt-1 mb-1" lg="4" md="12" sm="12" >
                    <MDBCard className="border border-light" style={{ borderRadius: 0 }} >
                        <MDBCardBody className="mb-1 pb-2  mt-1 pt-2 text-center">
                            <p className="mb-0 pb-0" style={{ fontWeight: 600, fontSize: 18 }}>FY 2020 Anticipated</p>
                            <p className="mt-0 pt-0" style={{ fontWeight: 500, fontSize: 14, color: "#868686" }}>(External J6)</p>
                            <Chart
                                width="100%"
                                height={180}
                                chartType="ColumnChart"
                                loader={<div>Loading Chart</div>}
                                data={s.FYAnticipated}
                                options={{
                                    title: '',
                                    chartArea: { width: '60%', paddingLeft: 100 },
                                    hAxis: { title: '', minValue: 0 },
                                    vAxis: { title: '' }
                                }}
                            />
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol className="mt-1 mb-1" lg="4" md="12" sm="12" >
                    <MDBCard className="border border-light" style={{ borderRadius: 0 }} >
                        <MDBCardBody className="mb-1 pb-2  mt-0 pt-1">
                            <p className="mb-0 pb-0" style={{ fontWeight: 600, fontSize: 18, }}>Program Supported</p>
                            <MDBDropdownItem divider />
                            <MDBRow className="ml-1 mr-1">
                                {(s.supportedPrograms) ?
                                    Object.entries(s.supportedPrograms).map(([key, val]) =>
                                        <MDBCol key={key} onClick={renderGraph({
                                            graph: val,
                                            programsSel: key
                                        })} className="border border-light" lg="4" md="3" sm="3" style={(s.programsSel!=key)?bg_program:bg_programSelected} >
                                            <p style={(s.programsSel!=key)?programText:programTextSelected}>{key}</p>
                                        </MDBCol>
                                    )
                                    : (
                                        <p className="mt-5 pt-5" style={{ fontWeight: 400, fontSize: 15, opacity: .7 }}>No Program Supported</p>
                                        // <MDBTypography className="mt-5 pt-5" style={{ fontWeight: 400, fontSize: 15, opacity: .7 }}>No Program Supported</MDBTypography>
                                    )}
                                {/* {(s.supportedPrograms) ?
                                    s.supportedPrograms.map((programs, index) => (
                                    <MDBCol  className="border border-light" lg="4" md="3" sm="3"  style={{ backgroundColor: "#B3C7E7", height:25, borderRadius:5,justifyContent:"center", }} >
                                        <MDBTypography style={{ paddingTop: 2, color: "#212121", fontWeight: 500, fontSize: 13 }}>{programs}</MDBTypography>                 
                                    </MDBCol>  
                                )) : (
                                    <MDBTypography  className="mt-5 pt-5" style={{ fontWeight: 400,fontSize:15, opacity:.7 }}>No Program Supported</MDBTypography>   
                                )}    */}
                            </MDBRow>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>

            

            <div style={{ display: 'flex', maxWidth: 900 }}>

            </div>

        </MDBContainer>
    );
}