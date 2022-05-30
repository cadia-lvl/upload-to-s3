import * as React from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import TextInput from '../ui/input/text-input';
import Layout from '../ui/layout';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';

import * as api from '../../services/api';

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
    color: white;
    font-size: 2rem;
    height: 3.5rem;
    margin: 1rem 0rem;
    border: 1px solid ${({ disabled }) => (disabled ? 'gray' : '#60C197')};

    border-radius: 0.1rem;

    background-color: ${({ disabled }) => (disabled ? 'gray' : '#60C197')};

    cursor: ${({ disabled }) => (disabled ? 'initial' : 'pointer')};
    &:active {
        transform: ${({ disabled }) => `translateY(${disabled ? 0 : 2}px)`};
        outline: none;
    }

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
    selectedFiles: File[];
    processing: boolean;
}

class FrontPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        const podcastType = new
            URLSearchParams(this.props.location.search).get("showId");
        // autogenerate a chatroom name from the timestamp
        this.state = {
            // today: +new Date(),
            podcastType: (podcastType != null)? podcastType : '',
            selectedFiles: [],
            processing: false,
        };
    }

    onPodcastChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { history } = this.props;
        const podcastType = e.currentTarget.value;
        this.setState({ podcastType });
        if (podcastType.length === 0) {
            history.push(`/`);
        } else {
            history.push(`/?showId=${podcastType}`);
        }
    };

    // Thank you https://www.geeksforgeeks.org/file-uploading-in-react-js/
    // for the filechange function
    onFileChange = (event: any) => {
        this.setState( { selectedFiles: event.target.files });
    };

    verifyFormData = () => {
    }

    onFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        let processing = true;
        this.setState( { processing } );
        e.preventDefault();
        console.log('sending the file now');
        // TODO: verify formData;
        const podcastId = this.state.podcastType;
        const rssFeed = 'https://hlekkurinn.is';
        this.verifyFormData();
        if (this.state.selectedFiles != null && podcastId != null) {
            console.log(this.state.selectedFiles);
            for (let i = 0; i < this.state.selectedFiles.length; i++) {
                try {
                    await api.uploadFile(this.state.selectedFiles[i], podcastId, rssFeed);
                } catch(e) {
                    console.log('Error: Did not upload ' + this.state.selectedFiles[i]);
                    console.error(e);
                }
            }
            // TODO: show the list of filenames uploaded
        }
        // TODO: else say there was nothing to submit or it errored out
        processing = false;
        this.setState( { processing } );
        // Also say thanks
        const { history } = this.props;
        history.push(`/takk`);
    };

    // TODO: Display the filenames uploaded
    // TODO: only show the button if files have been attached

    handleJoin = (event: React.MouseEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { history } = this.props;
        const { podcastType } = this.state;
        if (podcastType.length === 0) {
            history.push(`/`);
        } else {
            history.push(`/?showId=${podcastType}`);
        }
    };

    render() {
        const { podcastType, selectedFiles, processing } = this.state;
        return (
            <Layout>
                <FrontPageContainer>
                    <WelcomeTextContainer>
                        <h3>Velkomin</h3>
                        <p>
                            Vinsamlegast bæta við skjalans hér.
                        </p>
                    </WelcomeTextContainer>
                    <Form onSubmit={this.onFileUpload}>
                            <UrlInput
                                label={'Podcast'}
                                value={this.state.podcastType}
                                placeholder={'Hlaðvarp nafn'}
                                onChange={this.onPodcastChange}
                                disabled
                            />
                            <Form.Group controlId="formFileMultiple" className="mb-3">
                              <Form.Label>Multiple files input example</Form.Label>
                              <Form.Control
                                    type={'file'}
                                    onChange={this.onFileChange}
                                    multiple />
                            </Form.Group>
                            {/* might be useful for if people upload all the
                                data as an archive
                            <Form.Group controlId="formFileLg" className="mb-3">
                              <Form.Label>Large file input example</Form.Label>
                              <Form.Control
                                    type={'file'}
                                    size={'lg'}
                                    onChange={this.onFileChange}
                              />
                            </Form.Group>
                            */}
                            <Spinner
                                animation={'border'}
                                role={'status'}
                                hidden={!processing}
                            >
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                            <SubmitButton
                                type="submit"
                                disabled={ !podcastType || selectedFiles.length === 0 || processing }
                                >Upload</SubmitButton>
                    </Form>
                </FrontPageContainer>
            </Layout>
        );
    }
}

export default withRouter(FrontPage);
