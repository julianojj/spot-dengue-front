import styled from "styled-components";

const Container = styled.div`
    padding: 32px;
    background-color: #333;
`;

const StyledFooter = styled.footer`
    max-width: 1024px;
    width: 100%;
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #fff;

    p {
        color: #fff;
    }

    a {
        color: #fff;
        text-decoration: none;
        font-size: 18px;
        transition: opacity 0.3s ease;

        &:hover {
            color: #009039;
        }
    }
`;

export const Footer = () => {
    return (
        <Container>
            <StyledFooter>
                <p>Todos contra a Dengue. Denúncia já!</p>
            </StyledFooter>
        </Container>
    );
};
