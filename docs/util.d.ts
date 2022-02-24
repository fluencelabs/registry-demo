import QRCode from 'qrcode';
export declare function addClass(id: string, className: string): void;
export declare function removeClass(id: string, className: string): void;
export declare function hide(id: string): void;
export declare function show(id: string): void;
export declare function onClick(id: string, handler: (el: MouseEvent) => void): void;
export declare function setText(id: string, text: string): void;
export declare function getValue(id: string): any;
export declare function createQrCode(targetId: string, link: string, opts: QRCode.QRCodeRenderersOptions): Promise<void>;
