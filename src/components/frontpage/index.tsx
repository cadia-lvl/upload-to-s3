import * as React from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import TextInput from '../ui/input/text-input';
import Layout from '../ui/layout';
import Form from 'react-bootstrap/Form';

const FrontPageContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 40rem;
    max-width: 100%;
    gap: 1.5rem;
`;

const SubmitButton = styled.button`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #60c197;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 2rem;
    height: 3.5rem;
    margin: 1rem 0rem;

    :active {
        transform: translateY(2px);
    }

    & > * {
        padding: 0.5rem 1rem;
    }
`;

const UrlInput = styled(TextInput)``;

const WelcomeTextContainer = styled.div``;

type Props = RouteComponentProps;

interface State {
    podcastType: string;
}

class FrontPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        // autogenerate a chatroom name from the timestamp
        this.state = {
            // today: +new Date(),
            podcastType: '',
        };
    }

    onPodcastChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const podcastType = e.currentTarget.value;
        this.setState({ podcastType });
    };

    handleJoin = (event: React.MouseEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { history } = this.props;
        const { podcastType } = this.state;
        history.push(`/${podcastType}`);
    };

    render() {
        return (
            <Layout>
                <FrontPageContainer>
                    <WelcomeTextContainer>
                        <h3>Welcome to the Podromur collection</h3>
                        <p>
                            You can upload your text files here. We accept many
                            different file types.
                        </p>
                    </WelcomeTextContainer>
                    <Form>
                            <UrlInput
                                label={'Podcast'}
                                value={this.state.podcastType}
                                placeholder={'Hlaðvarp nafn'}
                                onChange={this.onPodcastChange}
                            />
                            <Form.Group controlId="formFileMultiple" className="mb-3">
                              <Form.Label>Multiple files input example</Form.Label>
                              <Form.Control type="file" multiple />
                            </Form.Group>
                            <Form.Group controlId="formFileLg" className="mb-3">
                              <Form.Label>Large file input example</Form.Label>
                              <Form.Control type="file" size="lg" />
                            </Form.Group>
                            <SubmitButton>Upload</SubmitButton>
                    </Form>
                </FrontPageContainer>
            </Layout>
        );
    }
}

export default withRouter(FrontPage);
