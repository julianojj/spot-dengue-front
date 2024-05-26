import styled from "styled-components";

const Container = styled.div`
    padding: 32px;
    border-bottom: 1px solid #ddd;

    header {
        max-width: 1024px;
        width: 100%;
        margin: auto;
        display: flex;
        align-items: center;
        gap: 16px;

        h1 {
            font-size: 32px;
        }

        nav {
            display: flex;
            align-items: center;
            gap: 16px;

            a {
                color: #333;
                text-decoration: none;
                font-weight: bold;
                font-size: 18px;
                transition: opacity 0.3s ease;

                &:hover {
                    text-decoration: underline 2px #a7ce2e;
                    color: #a7ce2e;
                }
            }
        }
    }
`;


export const Header = () => {
    return(
        <Container>
        <header>
            <h1>Spot Dengue</h1>
            <nav>
                <a href="/">Página Inicial</a>
                <a href="/report">Página de Denúncias</a>
            </nav>
        </header>
    </Container>
    )
}