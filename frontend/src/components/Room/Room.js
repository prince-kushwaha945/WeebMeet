import * as React from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { appId, serversecret } from '../helper';
import { useParams } from 'react-router-dom'

import './Room.css'

export function getUrlParams(
    url = window.location.href
) {
    let urlStr = url.split('?')[1];
    return new URLSearchParams(urlStr);
}

const Room = () => {

    const { roomid } = useParams();

    const myMeeting = async (element) => {
        const appID = appId;
        const serverSecret = serversecret;
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomid, Date.now().toString(), "Prince Kushwaha");
        // Create instance object from Kit Token.
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        // start the call
        zp.joinRoom({
            container: element,
            sharedLinks: [
                {
                    name: 'Personal link',
                    url:
                        window.location.protocol + '//' +
                        window.location.host + window.location.pathname
                },
            ],
            scenario: {
                mode: ZegoUIKitPrebuilt.VideoConference,
            },
        });
    };

    return (
        <div>
            <div
                className="myCallContainer"
                ref={myMeeting}
                style={{ width: '100%', height: '100vh' }}></div>
        </div>

    );
}

export default Room
