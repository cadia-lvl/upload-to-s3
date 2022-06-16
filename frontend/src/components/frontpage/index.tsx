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

enum AudioType {
    RSS = 'rss',
    AUDIO_FILES = 'audio_files',
}

const WelcomeTextContainer = styled.div``;

type Props = RouteComponentProps;

interface State {
    podcastType: string;
    rssFeed: string;
    selectedFiles: File[];
    selectedAudioFiles: File[];
    processing: boolean;
    audioFiles: boolean;
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
            audioFiles: false,
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
        this.setState({ selectedFiles: event.target.files });
    };

    onAudioFileChange = (event: any) => {
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
        const { audioFiles, selectedFiles, selectedAudioFiles } = this.state;
        let processing = true;
        this.setState({ processing });
        e.preventDefault();
        console.log('sending the file now');
        // TODO: verify formData;
        this.verifyFormData();

        await this.uploadFiles(selectedFiles);

        if (audioFiles) {
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

    handleRadioButton = (value: string) => {
        if (value == AudioType.RSS) {
            this.setState({ audioFiles: false });
            return;
        }
        if (value == AudioType.AUDIO_FILES) {
            this.setState({ audioFiles: true });
            return;
        }
    };

    submitDisabled = () => {
        const {
            podcastType,
            rssFeed,
            selectedFiles,
            selectedAudioFiles,
            processing,
            audioFiles,
        } = this.state;

        // Require podcast type
        if (!podcastType) return true;

        // Don't allow submit if processing
        if (processing) return true;

        // Require scripts
        if (selectedFiles.length === 0) return true;

        // If uploading audio files, require audio files
        // ELSE requires a value in the rss feed
        if (audioFiles) {
            if (selectedAudioFiles.length === 0) return true;
        } else {
            if (!rssFeed) return true;
        }
    };

    render() {
        const { processing, audioFiles } = this.state;
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
                        <RadioButtonsContainer>
                            <UploadTypeText>
                                Veldu hvernig þú vilt gefa hljóðskrár. RSS
                                hlekkur eða hlaðið upp hljóðskrár.
                            </UploadTypeText>
                            <input
                                type="radio"
                                id="rss"
                                name="audio_type"
                                value="rss"
                                onChange={() =>
                                    this.handleRadioButton(AudioType.RSS)
                                }
                                checked={!audioFiles}
                            ></input>
                            <RadioLabel htmlFor="rss">
                                RSSFeed hlekkur
                            </RadioLabel>
                            <br />
                            <input
                                type="radio"
                                id="audio_files"
                                name="audio_type"
                                value="audio_files"
                                onChange={() =>
                                    this.handleRadioButton(
                                        AudioType.AUDIO_FILES
                                    )
                                }
                            ></input>
                            <RadioLabel htmlFor="audio_files">
                                Hljóðskrár
                            </RadioLabel>
                        </RadioButtonsContainer>
                        {audioFiles ? (
                            <Form.Group
                                controlId="formFileMultipleAudio"
                                className="mb-3"
                            >
                                <Form.Label>
                                    Veldu hljóðskrár til að hlaða upp
                                    (hljóðskrár á sniði: .mp3, .mp4, .wav
                                    o.s.frv.)
                                </Form.Label>
                                <Form.Control
                                    type={'file'}
                                    onChange={this.onAudioFileChange}
                                    multiple
                                />
                            </Form.Group>
                        ) : (
                            <UrlInput
                                label={'RSSFeed'}
                                value={this.state.rssFeed}
                                placeholder={'https://hlekkurinn.is'}
                                onChange={this.onFeedChange}
                            />
                        )}

                        <Form.Group
                            controlId="formFileMultiple"
                            className="mb-3"
                        >
                            <Form.Label>
                                Veldu handrit til að hlaða upp (textaskrár á
                                sniði: .txt, .ppt, .rtf, .docx o.s.frv.)
                            </Form.Label>
                            <Form.Control
                                type={'file'}
                                onChange={this.onFileChange}
                                multiple
                            />
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
                            disabled={this.submitDisabled()}
                        >
                            Hlaða upp
                        </SubmitButton>
                    </Form>
                </FrontPageContainer>
            </Layout>
        );
    }
}

export default withRouter(FrontPage);
