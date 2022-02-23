import './index.css';

import { Fluence } from '@fluencelabs/fluence';
import { krasnodar } from '@fluencelabs/fluence-network-environment';
import QRCode from 'qrcode';
import { createRoom, joinRoom, getMembers } from './_aqua/export';

const interval = 3000;

const label = 'registry-demo';

function addClass(id: string, className: string) {
    const el = document.getElementById(id)!;
    el.classList.add(className);
}

function removeClass(id: string, className: string) {
    const el = document.getElementById(id)!;
    el.classList.remove(className);
}

function hide(id: string) {
    addClass(id, 'hidden');
}

function show(id: string) {
    removeClass(id, 'hidden');
}

function onClick(id: string, handler: (el: MouseEvent) => void) {
    const el = document.getElementById(id)!;
    el.onclick = handler;
}

function setText(id: string, text: string) {
    const el = document.getElementById(id)!;
    el.textContent = text;
}

function getValue(id: string) {
    const el: any = document.getElementById(id)!;
    return el.value;
}

async function createQrCode(targetId: string, link: string, opts: QRCode.QRCodeRenderersOptions) {
    const el = document.getElementById(targetId)!;
    await QRCode.toCanvas(el, link, opts);
}

let roomPeerId: string;

async function main() {
    await Fluence.start({
        connectTo: krasnodar[4],
    });

    const selfPeerId = Fluence.getStatus().peerId!;
    setText('peerid', selfPeerId);

    const params = new URLSearchParams(window.location.search);
    const joinParam = params.get('join');
    if (joinParam) {
        roomPeerId = joinParam;
        hide('start');
        show('join');
    } else {
        roomPeerId = selfPeerId;
        hide('join');
    }

    hide('loading');
    show('app');
}

onClick('start', async () => {
    const myName = getValue('name');
    let res = await createRoom(label);
    res = await joinRoom(roomPeerId, label);
    // if(res is not fine)
    //    throw

    const link = window.location.origin + '?join=' + roomPeerId;
    setText('join-link', link);
    await createQrCode('qrcode', link, { width: 640 });

    show('join-link-wrapper');
    show('room-list-wrapper');

    setInterval(loadMemberList, interval);
});

onClick('join', async () => {
    const myName = getValue('name');
    const res = await joinRoom(roomPeerId, label);
    // if(res is not fine)
    //    throw

    show('room-list-wrapper');

    setInterval(loadMemberList, interval);
});

async function loadMemberList() {
    const members = await getMembers(roomPeerId, label);
    const liElems = members.map((x) => {
        const el = document.createElement('li');
        el.textContent = x;
        return el;
    });
    const roomElem = document.getElementById('room-list');
    roomElem?.replaceChildren(...liElems);
}

main();
