import axios, { AxiosResponse, AxiosError } from 'axios';

// NOTE! This currently only just uploads the first file, but what about the
// rest?
export const uploadFile = async (
    file: File,
    show: string,
    rssFeed: string,
    // clip: AudioInfo,
    // demographics: UserDemographics
): Promise<void> => {
    const url = getApiUrl('api/episodes');
    console.log('this is the url ' + url);

    const { type } = file;
    if (!type) {
        return Promise.reject();
    }

    const jsonString = JSON.stringify({
        show_id: show,
        audio_feed: rssFeed,
        file_type: file.type,
    });

    const metadata = new Blob([jsonString], {
        type: 'text/plain',
    });
    // blob.type gives the mime type like 'text/plain' for example

    const id = file.name; // || uuid(); Generate new id as fallback from the uuid library

    const formData: FormData = new FormData();
    formData.append('script', file, 'randomName');
    formData.append('metadata', metadata);

    return axios({
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'multipart/form-data',
            show,
            id,
        },
        data: formData,
    })
        .then((response: AxiosResponse) => {
            return response.data;
        })
        .catch((error: AxiosError) => {
            console.error(error.message);
            return Promise.reject(error.code);
        });
};

const getApiUrl = (apiPath: string = 'api') => {
    let pathname = window.location.origin;
    if (pathname.includes('localhost')) {
        pathname = pathname.replace('3000', '9090');
    }
    return `${pathname}/${apiPath}`;
}
