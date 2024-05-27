import { useEffect, useState } from "react";
import styled from "styled-components";
import { Header } from "../header";
import { Carousel } from "../carousel";

const Container = styled.div`
    padding: 16px;
    display: flex;
    flex-direction: column;
    max-width: 1024px;
    width: 100%;
    margin: auto;
`;

const ReportContainer = styled.div`
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    background-color: #f9f9f9;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ReportStatus = styled.p`
    color: ${({ status }) => (status === "resolved" ? "#a7ce2e" : status === "canceled" ? "#FF0000" : "#FFA500")};
    font-weight: bold;
`;

const ReportComments = styled.p`
    font-weight: 700;
`;

const ReportMotion = styled.p`
    color: #444;
`

const FilterContainer = styled.div`
    margin-bottom: 16px;
`;

const FilterSelect = styled.select`
    padding: 8px;
    border-radius: 8px;
`;

export const Home = () => {
    const [reports, setReports] = useState([]);
    const [filteredStatus, setFilteredStatus] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await fetch("http://localhost:8080/get_all_reports");
                if (!response.ok) throw new Error("Erro ao carregar denúncias");
                const data = await response.json();
                setReports(data);
            } catch (error) {
                alert(error.message);
            }
        };
        fetchReports();
    }, []);

    const handleFilter = (e) => {
        setFilteredStatus(e.target.value === "all" ? null : e.target.value);
    };

    const filteredReports = filteredStatus
        ? reports.filter((report) => report.status === filteredStatus)
        : reports;

    const convertDatetimeToLocalDateBRL = (date) => {
        return new Date(date).toLocaleString('pt-BR')
    }

    return (
        <>
            <Header />
            <Container>
                <FilterContainer>
                    <FilterSelect onChange={handleFilter}>
                        <option value="all">Todos</option>
                        <option value="resolved">Resolvidos</option>
                        <option value="canceled">Cancelados</option>
                        <option value="pending">Pendentes</option>
                    </FilterSelect>
                </FilterContainer>
                {filteredReports.length > 0 ?
                    filteredReports.map((report) => (
                        <>
                            <ReportContainer key={report.reportID}>
                                <Carousel report={{ images: report.images }} />
                                <ReportComments>{report.comments}</ReportComments>
                                <ReportStatus status={report.status}>{report.status}</ReportStatus>
                                {report.motion !== "" &&
                                    <ReportMotion>{report.motion}</ReportMotion>
                                }
                                <p>{report.street}, {report.streetNumber}, {report.neighborhood}, {report.city} - {report.state}, {report.zipCode}</p>
                                <p>Denúnciado em: {convertDatetimeToLocalDateBRL(report.reportDate)}</p>
                                <p>Atualizado em: {convertDatetimeToLocalDateBRL(report.updateDate)}</p>
                                <h3>Imagens</h3>
                            </ReportContainer>
                        </>
                    ))
                    :
                    <>
                        Não há denuncias
                    </>
                }
            </Container>
        </>
    );
};
