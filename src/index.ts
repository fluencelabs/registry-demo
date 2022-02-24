import './index.css';

import { CallParams, Fluence } from '@fluencelabs/fluence';
import { krasnodar } from '@fluencelabs/fluence-network-environment';
import avmRunner from './avmRunner';
import { createQrCode, disable, getValue, hide, onClick, setText, show } from './util';

import { createMyRoute, discoverAndNotify, registerDiscoveryService, DiscoveryServiceDef } from './_aqua/export';

const label = 'registry-demo';

let selfDiscoveryRouteId: string;

interface DiscoveredUser {
    route: string;
    userName: string;
}

class DiscoveryService implements DiscoveryServiceDef {
    private _discoveredUsers: DiscoveredUser[] = [];

    notify_discovered(route_id: string, userName: string): DiscoveredUser[] {
        if (this._discoveredUsers.every((x) => x.route !== route_id)) {
            this._discoveredUsers.push({
                userName: userName,
                route: route_id,
            });

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

discoveryServiceInstance.onUpdated = updateUserList;

async function main() {
    await Fluence.start({
        avmRunner: avmRunner,
        connectTo: krasnodar[4],
    });

    registerDiscoveryService(discoveryServiceInstance);

    const selfPeerId = Fluence.getStatus().peerId!;
    setText('peerid', selfPeerId);

    hide('loading');
    show('app');
}

onClick('go', async () => {
    disable('go');

    const myName = getValue('name');
    const params = new URLSearchParams(window.location.search);
    const joinParam = params.get('join');

    if (joinParam) {
        const [routeId, knownUsers] = await discoverAndNotify(joinParam, label, myName);
        discoveryServiceInstance.setInitialList(knownUsers);
        selfDiscoveryRouteId;
    } else {
        selfDiscoveryRouteId = await createMyRoute(label, myName);
    }

    const createdRoute = await createMyRoute(label, myName);
    selfDiscoveryRouteId = createdRoute;

    // @ts-ignore
    discoveryServiceInstance.setInitialList(knownUsers);

    setText('join-link', link(selfDiscoveryRouteId));
    await createQrCode('qrcode', link(selfDiscoveryRouteId), { width: 640 });

    show('user-list-wrapper');
});

function link(id: string): string {
    return window.location.origin + '?join=' + id;
}

async function updateUserList(users) {
    const promises = users.map(async (x) => {
        const html =
            // force new line
            `<div class="user">
                <div class="user__name">${x.userName}</div>
                <canvas class="user__canvas" id="${x.route}" />
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
}

main();
