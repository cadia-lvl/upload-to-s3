import * as React from 'react';
import styled from 'styled-components';
import Form from 'react-bootstrap/Form';
import TextInput from '../ui/input/text-input';

const RadioButtonsContainer = styled.div`
    margin-top: 1rem;
`;

const UploadTypeText = styled.p`
    margin: 0;
`;

const RadioLabel = styled.label`
    margin-left: 0.5rem;
`;

const UrlInput = styled(TextInput)`
    margin: 1rem 0rem;
`;

export enum AudioType {
    RSS = 'rss',
    AUDIO_FILES = 'audio_files',
    NONE = 'none',
}

interface AudioSelectionProps {
    onAudioFilesChanged: (event: any) => void;
    onFeedChange: (event: any) => void;
    onAudioTypeChanged: (event: any) => void;
}

export const AudioSelection: React.FunctionComponent<AudioSelectionProps> = (
    props
) => {
    const [audioFiles, setAudioFiles] = React.useState<File[]>([]);
    const [audioType, setAudioType] = React.useState<AudioType>(AudioType.NONE);
    const [feed, setFeed] = React.useState('');

    const handleRadioButton = (input: AudioType) => {
        setAudioType(input);
    };

    const feedChanged = (event: any) => {
        setFeed(event.target.value);
        props.onFeedChange(event);
    };

    return (
        <>
            <h3>Hljóðskrár</h3>
            <RadioButtonsContainer>
                <UploadTypeText>
                    Veldu hvernig þú vilt gefa hljóðskrár. RSS hlekkur eða
                    hlaðið upp hljóðskrár.
                </UploadTypeText>
                <input
                    type="radio"
                    id="rss"
                    name="audio_type"
                    value="rss"
                    onChange={() => handleRadioButton(AudioType.RSS)}
                    checked={audioType == AudioType.RSS}
                ></input>
                <RadioLabel htmlFor="rss">RSSFeed hlekkur</RadioLabel>
                <br />
                <input
                    type="radio"
                    id="audio_files"
                    name="audio_type"
                    value="audio_files"
                    onChange={() => handleRadioButton(AudioType.AUDIO_FILES)}
                    checked={audioType == AudioType.AUDIO_FILES}
                ></input>
                <RadioLabel htmlFor="audio_files">Hljóðskrár</RadioLabel>
            </RadioButtonsContainer>
            {audioFiles ? (
                <Form.Group controlId="formFileMultipleAudio" className="mb-3">
                    <Form.Label>
                        Veldu hljóðskrár til að hlaða upp (hljóðskrár á sniði:
                        .mp3, .mp4, .wav o.s.frv.)
                    </Form.Label>
                    <Form.Control
                        type={'file'}
                        onChange={props.onAudioFilesChanged}
                        multiple
                    />
                </Form.Group>
            ) : (
                <UrlInput
                    label={'RSSFeed'}
                    value={feed}
                    placeholder={'https://hlekkurinn.is'}
                    onChange={feedChanged}
                />
            )}
        </>
    );
};
