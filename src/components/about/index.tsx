import * as React from 'react';
import styled from 'styled-components';

import { withRouter, RouteComponentProps } from 'react-router-dom';

import Layout from '../ui/layout';

const AboutContainer = styled.div`
    width: 100%;
    max-width: 40rem;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Button = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem 2rem;
    cursor: pointer;
    font-size: 1.8rem;
    font-weight: 600;
    background-color: #60c197;
    border: none;
    color: white;

    :active {
        transform: translateY(2px);
    }
`;

interface State {}

type Props = RouteComponentProps;

class About extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {};
    }

    handleClick = () => {
        const { history } = this.props;
        history.push('/');
    };

    render() {
        return (
            <Layout>
                <AboutContainer>
                    <h2>Exercise training</h2>
                    <Button onClick={this.handleClick}>Back home</Button>
                    <p>
                       Exercise training is about tracking ones exercise over a
                       long period. This can be over a week, a month, months,
                       or over a year to check
                       on progress.
                    </p>
                </AboutContainer>
            </Layout>
        );
    }
}

export default withRouter(About);
