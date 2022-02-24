import './index.css';

import { CallParams, Fluence } from '@fluencelabs/fluence';
import { krasnodar } from '@fluencelabs/fluence-network-environment';
import avmRunner from './avmRunner';
import { createQrCode, disable, getValue, hide, link, onClick, setText, show, updateUserList } from './util';

import { createMyRoute, discoverAndNotify, registerDiscoveryService, DiscoveryServiceDef } from './_aqua/export';

const label = 'registry-demo';

let selfDiscoveryRouteId: string;
let joinRouteId: string | null;

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

    const params = new URLSearchParams(window.location.search);
    joinRouteId = params.get('join');

    if (joinRouteId) {
        setText('ref-route-id', joinRouteId);
        show('ref-route-id-wrapper');
    }

    hide('loading');
    show('app');
}

onClick('go', async () => {
    disable('go');

    const myName = getValue('name');

    if (joinRouteId) {
        const [routeId, knownUsers] = await discoverAndNotify(joinRouteId, label, myName);
        discoveryServiceInstance.setInitialList(knownUsers);
        selfDiscoveryRouteId = routeId;
    } else {
        selfDiscoveryRouteId = await createMyRoute(label, myName);
    }

    setText('join-link', link(selfDiscoveryRouteId));
    await createQrCode('qrcode', link(selfDiscoveryRouteId), { width: 480 });

    hide('ref-route-id-wrapper');
    show('join-link-wrapper');
    show('user-list-wrapper');
});

main();
