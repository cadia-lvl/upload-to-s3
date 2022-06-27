import * as React from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import TextInput from '../ui/input/text-input';
import Layout from '../ui/layout';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

import * as api from '../../services/api';
import { AudioSelection, AudioType } from './audio_selection';

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

const UploadTypeText = styled.p`
    margin: 0;
`;

const RadioLabel = styled.label`
    margin-left: 0.5rem;
`;

const NameInput = styled(TextInput)``;

const UrlInput = styled(TextInput)`
    margin: 1rem 0rem;
`;

const RadioButtonsContainer = styled.div`
    margin-top: 1rem;
`;

const FilesContainer = styled.div`
    max-height: 30rem;
`;

const FileItem = styled.div`
    display: flex;
    flex-direction: row;
    gap: 1rem;
    box-shadow: 0px 2px #e2e2e2;
`;

const Name = styled.div`
    padding: 0.5rem 0 0.5rem 0;
`;

const Status = styled.div`
    margin-top: auto;
    margin-bottom: auto;
    margin-right: 0.5rem;
`;

const Remove = styled.button`
    color: white;
    background: red;
    border: none;
    font-weight: bold;
    border-radius: 50%;
    width: 1.5rem;
    aspect-ratio: 1;
`;

const FormGroup = styled(Form.Group)`
    margin-top: 1.5rem;
`;

const FormControl = styled(Form.Control)`
    display: none;
`;

const LargeButton = styled(Button)`
    width: 20rem;
`;

const SelectedFilesTitle = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const RemoveAllButton = styled.button`
    border: none;
    color: white;
    background: red;
    font-weight: bold;

    :active {
        transform: translateY(2px);
    }
`;

const WelcomeTextContainer = styled.div``;

type Props = RouteComponentProps;

interface State {
    podcastType: string;
    rssFeed: string;
    selectedFiles: File[];
    selectedAudioFiles: File[];
    processing: boolean;
    audioType: AudioType;
}

class FrontPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        const podcastType = new URLSearchParams(this.props.location.search).get(
            'showId'
        );
        // autogenerate a chatroom name from the timestamp
        this.state = {
            // today: +new Date(),
            podcastType: podcastType != null ? podcastType : '',
            rssFeed: '',
            selectedFiles: [],
            selectedAudioFiles: [],
            processing: false,
            audioType: AudioType.NONE,
        };
    }

    onFeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rssFeed = e.currentTarget.value;
        this.setState({ rssFeed });
    };

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
        const { selectedFiles } = this.state;
        for (const file of event.target.files) {
            if (selectedFiles.some((e) => e.name == file.name)) continue;
            selectedFiles.push(file);
        }
        // TODO: Sort by name
        selectedFiles.sort((a, b) => a.name.localeCompare(b.name));
        this.setState({ selectedFiles });
    };

    onAudioFileChange = (event: any) => {
        const { selectedAudioFiles } = this.state;
        for (const file of event.target.files) {
            if (selectedAudioFiles.some((e) => e.name == file.name)) continue;
            selectedAudioFiles.push(file);
        }
        selectedAudioFiles.sort((a, b) => a.name.localeCompare(b.name));
        this.setState({ selectedAudioFiles: event.target.files });
    };

    verifyFormData = () => {
        //TODO: verify file formats and such
    };

    uploadFiles = async (files: File[]) => {
        const podcastId = this.state.podcastType;
        const rssFeed = this.state.rssFeed;
        if (files != null && podcastId != null) {
            console.log(files);
            for (let i = 0; i < files.length; i++) {
                try {
                    await api.uploadFile(files[i], podcastId, rssFeed);
                } catch (e) {
                    console.log('Error: Did not upload ' + files[i]);
                    console.error(e);
                }
            }
            // TODO: show the list of filenames uploaded
        }
    };

    onFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        const { audioType, selectedFiles, selectedAudioFiles } = this.state;
        let processing = true;
        this.setState({ processing });
        e.preventDefault();
        console.log('sending the file now');
        // TODO: verify formData;
        this.verifyFormData();

        await this.uploadFiles(selectedFiles);

        // Hide audiotype for now
        if (audioType == AudioType.AUDIO_FILES) {
            await this.uploadFiles(selectedAudioFiles);
        }
        // TODO: else say there was nothing to submit or it errored out
        processing = false;
        this.setState({ processing });
        // Also say thanks
        const { history } = this.props;
        history.push(`/takk`);
    };

    // TODO: Display the filenames uploaded

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

    onAudioTypeChanged = (value: AudioType) => {
        this.setState({ audioType: value });
    };

    submitDisabled = () => {
        const {
            podcastType,
            rssFeed,
            selectedFiles,
            selectedAudioFiles,
            processing,
            audioType,
        } = this.state;

        // Require podcast type
        if (!podcastType) return true;

        // Don't allow submit if processing
        if (processing) return true;

        // Require scripts
        if (selectedFiles.length === 0) return true;

        // If uploading audio files, require audio files
        // ELSE requires a value in the rss feed
        if (
            audioType == AudioType.AUDIO_FILES &&
            selectedAudioFiles.length == 0
        )
            return true;

        if (audioType == AudioType.RSS && !rssFeed) return true;
    };

    removeFileClicked = (filename: string) => {
        const { selectedFiles } = this.state;

        const filteredFiles = selectedFiles.filter((e) => e.name != filename);

        this.setState({ selectedFiles: filteredFiles });
    };

    clearAllSelectedFiles = () => {
        this.setState({ selectedFiles: [], selectedAudioFiles: [] });
    };

    render() {
        const { processing, audioType, selectedFiles } = this.state;
        return (
            <Layout>
                <FrontPageContainer>
                    <WelcomeTextContainer>
                        <h3>Velkomin/n</h3>
                        <p>Vinsamlegast bættu við skjölum hér.</p>
                    </WelcomeTextContainer>
                    <Form onSubmit={this.onFileUpload}>
                        <NameInput
                            label={'Hlaðvarp'}
                            value={this.state.podcastType}
                            placeholder={'Nafn hlaðvarps'}
                            onChange={this.onPodcastChange}
                            disabled
                        />
                        {audioType != AudioType.NONE && (
                            <AudioSelection
                                onFeedChange={this.onFeedChange}
                                onAudioFilesChanged={this.onAudioFileChange}
                                onAudioTypeChanged={this.onAudioTypeChanged}
                            />
                        )}
                        <FormGroup
                            controlId="formFileMultiple"
                            className="mb-3"
                        >
                            <Form.Label>
                                Veldu handrit til að hlaða upp (textaskrár á
                                sniði: .txt, .ppt, .rtf, .docx o.s.frv.)
                            </Form.Label>
                            <FormControl
                                type={'file'}
                                onChange={this.onFileChange}
                                multiple
                            />
                            <div className="d-grid">
                                <Button
                                    variant={
                                        selectedFiles.length > 0
                                            ? 'success'
                                            : 'primary'
                                    }
                                    size="lg"
                                    onClick={() =>
                                        document
                                            .getElementById('formFileMultiple')
                                            ?.click()
                                    }
                                >
                                    {selectedFiles.length > 0
                                        ? 'Velja fleiri skrár'
                                        : 'Velja skrár'}
                                </Button>
                            </div>
                        </FormGroup>
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
                            disabled={this.submitDisabled()}
                        >
                            Hlaða upp
                        </SubmitButton>
                    </Form>
                    <FilesContainer>
                        {selectedFiles && selectedFiles.length > 0 && (
                            <SelectedFilesTitle>
                                <h3>Valdar skrár ({selectedFiles.length})</h3>
                                <Button
                                    variant="danger"
                                    onClick={this.clearAllSelectedFiles}
                                >
                                    Fjarlægja allar skrár
                                </Button>
                            </SelectedFilesTitle>
                        )}
                        {selectedFiles &&
                            Array.from(selectedFiles).map((file) => {
                                return (
                                    <FileItem key={file.name}>
                                        <Status>
                                            <Button
                                                variant="danger"
                                                onClick={() =>
                                                    this.removeFileClicked(
                                                        file.name
                                                    )
                                                }
                                                title={'Fjarlægja'}
                                            >
                                                X
                                            </Button>
                                        </Status>
                                        <Name>{file.name}</Name>
                                    </FileItem>
                                );
                            })}
                    </FilesContainer>
                </FrontPageContainer>
            </Layout>
        );
    }
}

export default withRouter(FrontPage);
