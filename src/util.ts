import QRCode from 'qrcode';

export function addClass(id: string, className: string) {
    const el = document.getElementById(id)!;
    el.classList.add(className);
}

export function removeClass(id: string, className: string) {
    const el = document.getElementById(id)!;
    el.classList.remove(className);
}

export function hide(id: string) {
    addClass(id, 'hidden');
}

export function show(id: string) {
    removeClass(id, 'hidden');
}

export function onClick(id: string, handler: (el: MouseEvent) => void) {
    const el = document.getElementById(id)!;
    el.onclick = handler;
}

export function setText(id: string, text: string) {
    const el = document.getElementById(id)!;
    el.textContent = text;
}

export function getValue(id: string) {
    const el: any = document.getElementById(id)!;
    return el.value;
}

export async function createQrCode(targetId: string, link: string, opts: QRCode.QRCodeRenderersOptions) {
    const el = document.getElementById(targetId)!;
    await QRCode.toCanvas(el, link, opts);
}

export function disable(id: string) {
    const el = document.getElementById(id)!;
    el.setAttribute('disabled', 'true');
}

export function enable(id: string) {
    const el = document.getElementById(id)!;
    el.removeAttribute('disabled');
}

export function link(id: string): string {
    return window.location.hostname + '?join=' + id;
}

interface DiscoveredUser {
    route: string;
    userName: string;
}

export async function updateUserList(users: DiscoveredUser[]) {
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
