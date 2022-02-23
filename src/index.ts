import './index.css';

import { Fluence } from '@fluencelabs/fluence';
import { krasnodar } from '@fluencelabs/fluence-network-environment';
import QRCode from 'qrcode';
import { advertiseMyself, getMembers } from './_aqua/export';

const label = 'registry-demo';

async function main() {
    await Fluence.start({
        connectTo: krasnodar[4],
    });

    const selfPeerId = Fluence.getStatus().peerId;

    const peerIdElem = document.getElementById('peerid')!;
    peerIdElem.textContent = selfPeerId;

    const startElem = document.getElementById('start')!;

    startElem.onclick = async () => {
        const res = await advertiseMyself(label);
        // if(res is not fine)
        //    throw

        const qrcodeElem = document.getElementById('qrcode')!;
        const link = window.location.origin + '?join=' + selfPeerId;
        await QRCode.toCanvas(qrcodeElem, link, {
            width: 640,
        });

        setTimeout(async () => {
            const members = await getMembers(label);
            console.log(members);
            const liElems = members.map((x) => {
                const el = document.createElement('li');
                el.textContent = x;
                return el;
            });
            const roomElem = document.getElementById('room-list');
            roomElem?.replaceChildren(...liElems);
        }, 1000);
    };

    document.getElementById('loading')!.classList.add('hidden');
    document.getElementById('app')!.classList.remove('hidden');

    // console.log('stopping fluence');

    // await Fluence.stop();
}

main();
