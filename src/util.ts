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
