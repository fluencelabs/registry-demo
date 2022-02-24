import './index.css';

import { Fluence } from '@fluencelabs/fluence';
import { krasnodar } from '@fluencelabs/fluence-network-environment';
import avmRunner from './avmRunner';
import { createQrCode, disable, getValue, hide, onClick, setText, show } from './util';

import { createMyRoute, notifySelfDiscovered, registerDiscoveryService, DiscoveryServiceDef } from './_aqua/export';

const label = 'registry-demo';

let selfDiscoveryRouteId: string;
interface DiscoveredUser {
    route: string;
    userName: string;
}
class DiscoveryService implements DiscoveryServiceDef {
    private _discoveredUsers: DiscoveredUser[] = [];

    notify_discovered(user: DiscoveredUser): DiscoveredUser[] {
        if (this._discoveredUsers.every((x) => x.route !== user.route)) {
            this._discoveredUsers.push(user);

            if (this.onUpdated) {
                this.onUpdated(this._discoveredUsers);
            }
        }

        return this._discoveredUsers;
    }

    setInitialList(userList: DiscoveredUser[]) {
        this._discoveredUsers = userList;

        if (this.onUpdated) {
            this.onUpdated(this._discoveredUsers);
        }
    }

    onUpdated: ((users: DiscoveredUser[]) => void) | null = null;
}

const discoveryServiceInstance = new DiscoveryService();

discoveryServiceInstance.onUpdated = async (users) => {
    const promises = users.map(async (x) => {
        const html =
            // force new line
            `<div>
                <div>${x.userName}</div>
                <canvas id="${x.route}" />
			</div>`;
        const li = document.createElement('li');
        li.innerHTML = html;
        return li;
    });

    const lis = await Promise.all(promises);

    const ul = document.getElementById('user-list')!;
    ul?.replaceChildren(...lis);

    for (let x of users) {
        createQrCode(x.route, link(x.route), {});
    }
};

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
    let res = await createMyRoute(label, myName);
    // res = await

    hide('loading');
    show('app');
}

onClick('start', async () => {
    disable('start');
    const myName = getValue('name');
    const createdRoute = await createMyRoute(label, myName);
    selfDiscoveryRouteId = createdRoute;
    let knownUsers = await notifySelfDiscovered({
        userName: myName,
        route: selfDiscoveryRouteId,
    });

    // @ts-ignore
    knownUsers = [
        {
            route: 'test1',
            userName: 'test1',
        },
        {
            route: 'test2',
            userName: 'test2',
        },
    ];
    // @ts-ignore
    discoveryServiceInstance.setInitialList(knownUsers);

    setText('join-link', selfDiscoveryRouteId);
    await createQrCode('qrcode', link(selfDiscoveryRouteId), { width: 640 });

    show('user-list-wrapper');
});

function link(id: string): string {
    return window.location.origin + '?join=' + id;
}

onClick('join', async () => {
    const myName = getValue('name');
    // const res = await joinRoom(roomPeerId, label);
    // if(res is not fine)
    //    throw

    show('room-list-wrapper');
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
