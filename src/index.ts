import './index.css';

import { CallParams, Fluence } from '@fluencelabs/fluence';
import { krasnodar } from '@fluencelabs/fluence-network-environment';
import avmRunner from './avmRunner';
import { createQrCode, getValue, hide, onClick, setText, show } from './util';

import { createRoute, notifySelfDiscovered, registerDiscoveryService, DiscoveryServiceDef } from './_aqua/export';

const interval = 3000;

const label = 'registry-demo';

let selfDiscoveryRouteId: string;

interface DiscoveredUser {
    route: string;
    userName: string;
}
class DiscoveryService implements DiscoveryServiceDef {
    private _discoveredUsers: DiscoveredUser[] = [];

    notify_discovered(user: DiscoveredUser): DiscoveredUser[] {
        if (this._discoveredUsers.some((x) => x.route !== user.route)) {
            this._discoveredUsers.push(user);
        }

        return this._discoveredUsers;
    }

    setInitialList(userList: DiscoveredUser[]) {
        this._discoveredUsers = userList;
    }
}

const discoveryServiceInstance = new DiscoveryService();

async function main() {
    await Fluence.start({
        avmRunner: avmRunner,
        connectTo: krasnodar[4],
    });

    registerDiscoveryService(discoveryServiceInstance);

    const selfPeerId = Fluence.getStatus().peerId!;
    setText('peerid', selfPeerId);

    const params = new URLSearchParams(window.location.search);
    const joinParam = params.get('join');

    const myName = getValue('name');
    let res = await createRoute(label, myName);
    // res = await

    hide('loading');
    show('app');
}

onClick('start', async () => {
    const myName = getValue('name');
    let res = await createRoute(label, myName);
    const knownUsers = await notifySelfDiscovered({
        userName: myName,
        route: selfDiscoveryRouteId,
    });
    // discoveryServiceInstance.setInitialList(knownUsers);

    const link = window.location.origin + '?join=' + selfDiscoveryRouteId;
    setText('join-link', link);
    await createQrCode('qrcode', link, { width: 640 });

    show('join-link-wrapper');
    show('room-list-wrapper');

    // setInterval(loadMemberList, interval);
});

onClick('join', async () => {
    const myName = getValue('name');
    // const res = await joinRoom(roomPeerId, label);
    // if(res is not fine)
    //    throw

    show('room-list-wrapper');

    // setInterval(loadMemberList, interval);
});

// async function loadMemberList() {
//     const members = await getMembers(roomPeerId, label);
//     const liElems = members.map((x) => {
//         const el = document.createElement('li');
//         el.textContent = x;
//         return el;
//     });
//     const roomElem = document.getElementById('room-list');
//     roomElem?.replaceChildren(...liElems);
// }

main();
